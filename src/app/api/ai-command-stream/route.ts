// app/api/ai-command-stream/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/core/lib/prisma";
import { createServerSupabase } from "@/app/core/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    // -------------------------------------------------------------
    // 1️⃣ Auth Check
    // -------------------------------------------------------------
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: user not logged in" },
        { status: 401 }
      );
    }

    // -------------------------------------------------------------
    // 2️⃣ Input Validation
    // -------------------------------------------------------------
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { message } = body;
    const lower = message.toLowerCase().trim();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    console.log("📝 Processing message:", message);

    // -------------------------------------------------------------
    // 3️⃣ Get or create User in Prisma DB
    // -------------------------------------------------------------
    const dbUser = await prisma.user.upsert({
      where: { supabaseId: user.id },
      update: {},
      create: {
        supabaseId: user.id,
        email: user.email!,
      },
    });

    // -------------------------------------------------------------
    // 3.5️⃣ Handle Download Commands
    // -------------------------------------------------------------
    const downloadCommands = [
      "download expense summary",
      "download expenses summary",
      "download expense report",
      "download expenses report",
      "download income summary",
      "download incomes summary",
      "download income report",
      "download incomes report",
      "give me expense summary",
      "give me income summary",
      "generate expense summary",
      "generate income summary",
      "export expenses",
      "export income",
    ];

    const isDownloadCommand = downloadCommands.some((cmd) =>
      lower.includes(cmd)
    );

    if (isDownloadCommand) {
      console.log("📁 Download command detected!");

      const type = lower.includes("income") ? "income" : "expense";

      // Detect period from message
      let period = "month"; // default
      if (lower.includes("week") || lower.includes("weekly")) {
        period = "week";
      } else if (
        lower.includes("year") ||
        lower.includes("yearly") ||
        lower.includes("annual")
      ) {
        period = "year";
      } else if (
        lower.includes("all") ||
        lower.includes("everything") ||
        lower.includes("complete")
      ) {
        period = "all";
      }

      const downloadUrl = `/api/download-summary?type=${type}&period=${period}`;

      return NextResponse.json({
        success: true,
        conversational: false,
        download: true,
        message: `📊 Here is your ${type} summary for the ${period === "all" ? "entire history" : `past ${period}`}.`,
        fileUrl: downloadUrl,
      });
    }

    // -------------------------------------------------------------
    // 4️⃣ Check if message is conversational (not a transaction)
    // -------------------------------------------------------------
    if (isConversationalMessage(message)) {
      console.log("💬 Conversational message detected");

      // Handle with AI for friendly response
      if (process.env.GEMINI_API_KEY?.trim()) {
        try {
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 150,
            },
          });

          const conversationPrompt = `You are a friendly financial assistant. Respond naturally and helpfully to the user's message.

User message: "${message}"

Keep your response brief (1-2 sentences) and friendly. If they're thanking you, acknowledge it warmly. If they're asking a question, answer helpfully.`;

          const result = await model.generateContent(conversationPrompt);
          const response = await result.response;
          const reply = response.text().trim();

          return NextResponse.json({
            success: true,
            conversational: true,
            message: reply,
          });
        } catch (error) {
          console.error("AI conversation error:", error);
          // Fallback to simple responses
        }
      }

      // Fallback conversational responses
      const reply = getConversationalResponse(message);
      return NextResponse.json({
        success: true,
        conversational: true,
        message: reply,
      });
    }

    // -------------------------------------------------------------
    // 5️⃣ AI Processing with Google Gemini (for transactions)
    // -------------------------------------------------------------
    let parsed: any;
    let usedFallback = false;

    // Try AI first if API key is available
    if (process.env.GEMINI_API_KEY?.trim()) {
      try {
        console.log("🔑 Gemini API key found, attempting AI parsing...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200,
          },
        });

        const prompt = `You are a financial assistant. Extract structured data from the user's message.

User message: "${message}"

Return ONLY a valid JSON object with this exact structure:
{
  "type": "expense" or "income",
  "title": "short descriptive title",
  "amount": number,
  "note": "optional additional context",
  "category": "optional category like Food, Transport, Shopping, Entertainment, Bills, Healthcare, Education, Salary, Gift, Other"
}

Rules:
1. Amount must be a positive number
2. Type must be either "expense" or "income"
3. Title should be brief (2-5 words)
4. If category is unclear, use "Other"
5. If the message mentions adding an expense, spending money, or buying something, it's "expense"
6. If the message mentions receiving money, salary, sold something, or income, it's "income"

Examples:
- "I ate burger for 5$ add expense" → {"type": "expense", "title": "Burger meal", "amount": 5, "note": "Ate burger", "category": "Food"}
- "add income of $50000" → {"type": "income", "title": "Income", "amount": 50000, "note": "Added income", "category": "Salary"}
- "Got paid 2000 for freelance work" → {"type": "income", "title": "Freelance payment", "amount": 2000, "note": "Freelance work", "category": "Salary"}
- "Bought groceries for $50" → {"type": "expense", "title": "Grocery shopping", "amount": 50, "note": "Groceries", "category": "Food"}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        console.log("✅ Raw AI response:", text);

        // Clean up the response
        text = text.trim();

        // Remove markdown code blocks
        if (text.startsWith("```json")) {
          text = text.substring(7);
        } else if (text.startsWith("```")) {
          text = text.substring(3);
        }
        if (text.endsWith("```")) {
          text = text.substring(0, text.length - 3);
        }
        text = text.trim();

        // Extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in AI response");
        }

        parsed = JSON.parse(jsonMatch[0]);
        console.log("✅ Parsed AI response:", parsed);

        // Validate required fields
        if (!parsed.type || !parsed.title || parsed.amount === undefined) {
          throw new Error("Missing required fields in AI response");
        }

        // Convert amount to number
        const amount =
          typeof parsed.amount === "string"
            ? parseFloat(parsed.amount.replace(/[^0-9.-]+/g, ""))
            : Number(parsed.amount);

        if (isNaN(amount) || amount <= 0) {
          throw new Error(`Invalid amount: ${parsed.amount}`);
        }

        parsed.amount = amount;
        parsed.type = parsed.type.toLowerCase();

        console.log("🎯 AI parsing successful");
      } catch (aiError: any) {
        console.error("❌ AI parsing failed:", aiError.message);
        // Fall through to fallback parsing
      }
    } else {
      console.log("⚠️ No Gemini API key found, using fallback");
    }

    // -------------------------------------------------------------
    // 6️⃣ Fallback to Regex Parsing if AI fails or not configured
    // -------------------------------------------------------------
    if (!parsed) {
      usedFallback = true;
      console.log("🔄 Using fallback parsing...");

      parsed = parseTransactionFallback(message);

      if (!parsed) {
        return NextResponse.json(
          {
            error:
              "Could not process your transaction. Please try being more specific (e.g., 'Add $50 income' or 'Spent $20 on lunch')",
          },
          { status: 422 }
        );
      }

      console.log("✅ Fallback parsing result:", parsed);
    }

    // -------------------------------------------------------------
    // 7️⃣ Save to DB (AI or Fallback Path)
    // -------------------------------------------------------------
    let savedRecord;
    const amount = parsed.amount;

    // Prepare note
    let finalNote = parsed.note || parsed.title;
    if (parsed.category && parsed.category !== "Other") {
      finalNote += ` [${parsed.category}]`;
    }

    if (parsed.type === "expense") {
      savedRecord = await prisma.expense.create({
        data: {
          amount: amount,
          userId: dbUser.id,
          note: finalNote,
          occurredAt: new Date(),
          currency: "USD",
          categoryId: null,
        },
      });
    } else if (parsed.type === "income") {
      savedRecord = await prisma.income.create({
        data: {
          amount: amount,
          userId: dbUser.id,
          source: parsed.category || "Manual Entry",
          note: finalNote,
          receivedAt: new Date(),
          currency: "USD",
          categoryId: null,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Could not determine if expense or income" },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      saved: savedRecord,
      parsed: parsed,
      usedFallback: usedFallback,
      aiAvailable: !!process.env.GEMINI_API_KEY?.trim(),
    });
  } catch (err: any) {
    console.error("API ROUTE ERROR:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// Helper: Detect Conversational Messages
// -------------------------------------------------------------
function isConversationalMessage(message: string): boolean {
  const lowerMsg = message.toLowerCase().trim();

  // Check if message has amount indicators (likely a transaction)
  const hasAmount = /\$?\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?/.test(
    lowerMsg
  );

  // Transaction keywords
  const transactionKeywords = [
    "add expense",
    "add income",
    "spent",
    "spend",
    "bought",
    "paid for",
    "received",
    "earned",
    "salary",
    "purchase",
    "buy",
    "expense of",
    "income of",
  ];

  const hasTransactionKeyword = transactionKeywords.some((k) =>
    lowerMsg.includes(k)
  );

  // If it has an amount AND transaction keyword, it's likely a transaction
  if (hasAmount && hasTransactionKeyword) {
    return false;
  }

  // Conversational patterns
  const conversationalPatterns = [
    /^(thanks?|thank you|ty|thx)/i,
    /^(hello|hi|hey|good morning|good evening)/i,
    /^(how are you|what's up|whats up)/i,
    /^(ok|okay|cool|nice|great|awesome)/i,
    /^(bye|goodbye|see you|later)/i,
    /^(help|what can you do)/i,
    /^(yes|no|yep|nope|yeah)/i,
  ];

  return conversationalPatterns.some((pattern) => pattern.test(lowerMsg));
}

// -------------------------------------------------------------
// Helper: Generate Conversational Response
// -------------------------------------------------------------
function getConversationalResponse(message: string): string {
  const lowerMsg = message.toLowerCase().trim();

  if (/^(thanks?|thank you|ty|thx)/i.test(lowerMsg)) {
    return "You're welcome! Happy to help with your finances. 😊";
  }

  if (/^(hello|hi|hey)/i.test(lowerMsg)) {
    return "Hi there! I can help you track expenses and income. Just tell me what you spent or earned!";
  }

  if (/^(how are you|what's up|whats up)/i.test(lowerMsg)) {
    return "I'm doing great, thanks for asking! Ready to help you manage your finances. 💰";
  }

  if (/^(bye|goodbye|see you|later)/i.test(lowerMsg)) {
    return "Goodbye! Come back anytime you need to track your finances. 👋";
  }

  if (/^(help|what can you do)/i.test(lowerMsg)) {
    return "I can help you track expenses and income! Try saying things like 'Spent $20 on lunch' or 'Add $500 income'.";
  }

  return "I'm here to help! You can tell me about expenses or income you'd like to track.";
}

// -------------------------------------------------------------
// Helper: Smart Fallback Parsing
// -------------------------------------------------------------
function parseTransactionFallback(message: string) {
  try {
    const lowerMsg = message.toLowerCase().trim();

    // 1. Extract Amount - more robust regex
    const amountRegex =
      /(\$?\s*)(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?)/;
    const amountMatch = lowerMsg.match(amountRegex);

    if (!amountMatch) return null;

    const amountStr = amountMatch[2].replace(/,/g, "");
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) return null;

    // 2. Determine Type - prioritize income keywords
    const incomeKeywords = [
      "income",
      "salary",
      "paid",
      "received",
      "deposit",
      "earned",
      "sold",
      "got paid",
      "add income",
      "record income",
      "income of",
      "salary of",
    ];

    const expenseKeywords = [
      "spent",
      "spend",
      "buy",
      "bought",
      "purchase",
      "expense",
      "cost",
      "pay",
      "paid for",
    ];

    let type: "income" | "expense" = "expense"; // default

    // Check for income keywords first
    if (incomeKeywords.some((k) => lowerMsg.includes(k))) {
      type = "income";
    }
    // If no income keywords found, check for expense keywords
    else if (expenseKeywords.some((k) => lowerMsg.includes(k))) {
      type = "expense";
    }
    // If message starts with "add" and has amount, it's likely income
    else if (lowerMsg.startsWith("add") || lowerMsg.startsWith("record")) {
      type = "income";
    }

    // 3. Extract Description
    let description = message
      .replace(amountMatch[0], "") // Remove amount
      .replace(
        /(add|record|log|track|expense|income|spent|spend|paid|received|for|on|of)/gi,
        ""
      )
      .trim();

    if (!description || description.length < 2) {
      description = type === "income" ? "Income" : "Purchase";
    }

    // 4. Determine Category
    let category = type === "income" ? "Salary" : "Other";

    if (type === "expense") {
      const categories = {
        Food: [
          "burger",
          "food",
          "eat",
          "restaurant",
          "grocery",
          "meal",
          "lunch",
          "dinner",
          "coffee",
          "cafe",
        ],
        Transport: [
          "gas",
          "fuel",
          "uber",
          "taxi",
          "transport",
          "bus",
          "flight",
          "train",
          "metro",
          "parking",
        ],
        Shopping: [
          "buy",
          "purchase",
          "shop",
          "shopping",
          "amazon",
          "store",
          "mall",
          "online",
        ],
        Bills: [
          "bill",
          "rent",
          "electricity",
          "water",
          "internet",
          "phone",
          "subscription",
          "utility",
        ],
        Entertainment: [
          "movie",
          "concert",
          "game",
          "netflix",
          "spotify",
          "entertainment",
          "fun",
        ],
      };

      for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some((keyword) => lowerMsg.includes(keyword))) {
          category = cat;
          break;
        }
      }
    }

    return {
      type: type,
      title:
        description.length > 50
          ? description.substring(0, 50) + "..."
          : description,
      amount: amount,
      note: message,
      category: category,
    };
  } catch (error) {
    console.error("Fallback parsing error:", error);
    return null;
  }
}
