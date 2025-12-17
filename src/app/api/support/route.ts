import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const supportSchema = z.object({
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message is too short"),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = supportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { subject, message } = parsed.data;

    await resend.emails.send({
      from: "Expense Tracker AI <onboarding@resend.dev>",
      to: process.env.SUPPORT_EMAIL!,
      subject: `[Support] ${subject}`,
      replyTo: user.email,
      text: `
User: ${user.email}

Message:
${message}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Support email error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
