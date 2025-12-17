import { NextResponse } from "next/server";
import prisma from "@/app/core/lib/prisma";
import { createServerSupabase } from "@/app/core/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prompts from "@/app/core/config/ai-prompts.json";

export async function POST(req: Request) {
  try {
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

    // 1. Get or create User in Prisma
    const dbUser = await prisma.user.upsert({
      where: { supabaseId: user.id },
      update: {},
      create: {
        supabaseId: user.id,
        email: user.email!,
      },
    });

    // 2. Check if message is conversational
    if (isConversationalMessage(message)) {
      const reply = getConversationalResponse(message);
      return NextResponse.json({
        success: true,
        conversational: true,
        message: reply,
      });
    }

    // 3. AI Processing
    let parsed: any;
    let usedFallback = false;

    if (process.env.GEMINI_API_KEY?.trim()) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { temperature: 0.1, maxOutputTokens: 400 },
        });

        const prompt = prompts.gemini.transaction_parsing.replace(
          "{{MESSAGE}}",
          message
        );

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        if (text.startsWith("```json")) text = text.substring(7);
        if (text.startsWith("```")) text = text.substring(3);
        if (text.endsWith("```")) text = text.substring(0, text.length - 3);

        parsed = JSON.parse(text.trim());
        
        // Clean up amount if it's not a report
        if (parsed.type !== 'report') {
            let amount = typeof parsed.amount === "string"
                ? parseFloat(parsed.amount.replace(/[^0-9.-]+/g, ""))
                : Number(parsed.amount);
            if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
            parsed.amount = amount;
        }
        
        parsed.type = parsed.type.toLowerCase();

      } catch (aiError) {
        console.error("❌ AI parsing failed:", aiError);
      }
    }

    // 4. Fallback Parsing
    if (!parsed) {
      usedFallback = true;
      parsed = parseTransactionFallback(message);

      if (!parsed) {
        return NextResponse.json(
          {
            error: "Could not process request. Try: 'Spent $20 on food', or 'Download expense report'",
          },
          { status: 422 }
        );
      }
    }

    // =============================================================
    // 🆕 HANDLE REPORT DOWNLOAD REQUESTS
    // =============================================================
    if (parsed.type === "report") {
      const reportType = parsed.report_type || "expenses"; // default to expenses
      const format = parsed.format || "csv"; // default to csv
      
      // Construct the URL for your existing GET endpoint
      const downloadUrl = `/api/reports/download?type=${reportType}&format=${format}`;
      
      return NextResponse.json({
        success: true,
        intent: "download",
        message: `I've generated your ${reportType} report.`,
        downloadUrl: downloadUrl, // Frontend should check for this and trigger window.open
        parsed: parsed
      });
    }

    // 5. Category Handling (For Transactions)
    let categoryId: string | null = null;
    if (parsed.category && parsed.category !== "Other") {
      const existingCategory = await prisma.category.findFirst({
        where: {
          userId: dbUser.id,
          name: { equals: parsed.category, mode: "insensitive" },
        },
      });
      if (existingCategory) categoryId = existingCategory.id;
    }

    // 6. Save Transaction to DB
    let savedRecord;
    const amount = parsed.amount;
    let finalNote = parsed.note || parsed.title;

    if (parsed.type === "expense") {
      savedRecord = await prisma.expense.create({
        data: {
          amount: amount,
          userId: dbUser.id,
          note: finalNote,
          occurredAt: new Date(),
          currency: "USD",
          categoryId: categoryId,
        },
      });
    } else if (parsed.type === "income") {
      savedRecord = await prisma.income.create({
        data: {
          amount: amount,
          userId: dbUser.id,
          source: parsed.title || "Manual Entry",
          note: finalNote,
          receivedAt: new Date(),
          currency: "USD",
          categoryId: categoryId,
        },
      });
    } else if (parsed.type === "subscription") {
      const cycle = parsed.cycle || "MONTHLY";
      savedRecord = await prisma.subscription.create({
        data: {
          name: parsed.title,
          amount: amount,
          userId: dbUser.id,
          currency: "USD",
          cycle: cycle,
          startDate: new Date(),
          nextBilling: new Date(),
          isActive: true,
          autoExpense: true,
          note: finalNote,
          categoryId: categoryId,
        },
      });
      await prisma.expense.create({
        data: {
          userId: dbUser.id,
          amount: amount,
          currency: "USD",
          note: `Initial expense for subscription: ${parsed.title}`,
          categoryId: categoryId,
          subscriptionId: savedRecord.id,
          occurredAt: new Date(),
        },
      });
    } else if (parsed.type === "investment") {
      const quantity = parsed.quantity || 1;
      const pricePerUnit = amount;
      const symbol = parsed.symbol ? parsed.symbol.toUpperCase() : null;
      const action = parsed.action || "buy";

      const existingAsset = await prisma.investment.findFirst({
        where: {
          userId: dbUser.id,
          OR: [
            { name: { equals: parsed.title, mode: "insensitive" } },
            ...(symbol ? [{ symbol: symbol }] : []),
          ],
        },
      });

      if (existingAsset) {
       const currentQty = existingAsset.quantity.toNumber();
       const currentAvg = existingAsset.averageBuyPrice.toNumber();
       let newQuantity = currentQty;
       let newAvgPrice = currentAvg;

       if (action === "buy") {
         const totalCostOld = currentQty * currentAvg;
         const totalCostNew = quantity * pricePerUnit;
         newQuantity = currentQty + quantity;
         if (newQuantity > 0) newAvgPrice = (totalCostOld + totalCostNew) / newQuantity;
       } else if (action === "sell") {
         newQuantity = Math.max(0, currentQty - quantity);
       }

        savedRecord = await prisma.investment.update({
          where: { id: existingAsset.id },
          data: {
            quantity: newQuantity,
            averageBuyPrice: newAvgPrice,
            currentPrice: pricePerUnit,
            ...(categoryId ? { categoryId } : {}),
          },
        });
      } else {
        if (action === "sell") {
          return NextResponse.json({ error: "Cannot sell an asset you don't own yet." }, { status: 400 });
        }
        savedRecord = await prisma.investment.create({
          data: {
            userId: dbUser.id,
            name: parsed.title,
            symbol: symbol,
            quantity: quantity,
            averageBuyPrice: pricePerUnit,
            currentPrice: pricePerUnit,
            categoryId: categoryId,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      saved: savedRecord,
      parsed: parsed,
      usedFallback: usedFallback,
    });
  } catch (err: any) {
    console.error("API ROUTE ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// Helper: Detect Conversational Messages
// -------------------------------------------------------------
function isConversationalMessage(message: string): boolean {
  const lowerMsg = message.toLowerCase().trim();
  
  // 🆕 If user asks to download, it is NOT conversational, it is functional
  if (lowerMsg.includes("download") || lowerMsg.includes("export") || lowerMsg.includes("report")) {
    return false;
  }

  const hasAmount = /\$?\s*\d+/.test(lowerMsg);
  const transactionKeywords = [
    "add expense", "add income", "spent", "paid", "received", "earned",
    "subscription", "subscribe", "buy", "sell", "invest", "trade", "stock",
    "shares", "purchase"
  ];

  if (hasAmount && transactionKeywords.some((k) => lowerMsg.includes(k))) {
    return false; 
  }

  const conversationalPatterns = [
    /^(hi|hello|hey|thanks|help|bye)/i
  ];
  return conversationalPatterns.some((p) => p.test(lowerMsg));
}

function getConversationalResponse(message: string): string {
  return "I can help track expenses, income, subscriptions, and investments! Or try 'Download expense report'.";
}

// -------------------------------------------------------------
// Helper: Smart Fallback Parsing
// -------------------------------------------------------------
function parseTransactionFallback(message: string) {
  try {
    const lower = message.toLowerCase().trim();

    // 🆕 1. Detect Reports
    if (lower.includes("download") || lower.includes("export") || lower.includes("report")) {
        const type = "report";
        let reportType = "expenses";
        if (lower.includes("income")) reportType = "incomes";
        
        let format = "csv";
        if (lower.includes("json")) format = "json";

        return { type, report_type: reportType, format, amount: 0 };
    }

    // 2. Detect Transactions
    let type: "income" | "expense" | "subscription" | "investment" = "expense";
    let action = "buy";
    let category = "Other";
    let cycle = "MONTHLY";

    if (lower.includes("buy") || lower.includes("invest") || lower.includes("stock")) {
      type = "investment";
      action = "buy";
      category = "Stocks";
    } else if (lower.includes("sell") || lower.includes("trade")) {
      type = "investment";
      action = "sell";
      category = "Stocks";
    } else if (lower.includes("subscription")) {
      type = "subscription";
      category = "Subscription";
    } else if (lower.includes("income") || lower.includes("salary")) {
      type = "income";
      category = "Salary";
    }

    // Extract Amount (Skip for report logic above)
    const amountMatch = lower.match(/(\$?\s*)([\d,]+(?:\.\d+)?)/);
    if (!amountMatch) return null; // Transaction must have amount
    
    const amount = parseFloat(amountMatch[2].replace(/,/g, ""));

    // Extract Description
    let description = message
      .replace(amountMatch[0], "")
      .replace(/(add|expense|income|subscription|spent|paid|received|for|on)/gi, "")
      .trim();
      
    if (!description) description = type.charAt(0).toUpperCase() + type.slice(1);

    return {
      type,
      title: description.substring(0, 50),
      amount: amount,
      category,
      cycle: type === "subscription" ? cycle : undefined,
      action: type === "investment" ? action : undefined
    };
  } catch (error) {
    return null;
  }
}