// app/api/subscriptions/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const now = new Date();

    // 1. Find all active subscriptions that are due for payment (nextBilling <= now)
    const dueSubscriptions = await prisma.subscription.findMany({
      where: {
        userId: dbUser.id,
        isActive: true,
        autoExpense: true,
        nextBilling: {
          lte: now, // Less than or equal to today
        },
      },
    });

    let createdCount = 0;

    // 2. Process each due subscription
    for (const sub of dueSubscriptions) {
      // Create the Expense record
      await prisma.expense.create({
        data: {
          userId: dbUser.id,
          amount: sub.amount,
          currency: sub.currency,
          note: `Auto-generated from subscription: ${sub.name}`,
          categoryId: sub.categoryId,
          subscriptionId: sub.id,
          occurredAt: sub.nextBilling, // Use the billing date as the expense date
        },
      });

      // Calculate the NEXT billing date
      const nextDate = new Date(sub.nextBilling);
      
      switch (sub.cycle) {
        case "DAILY":
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case "WEEKLY":
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case "MONTHLY":
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case "YEARLY":
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }

      // Update the subscription with the new nextBilling date
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          nextBilling: nextDate,
        },
      });

      createdCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${createdCount} subscription(s).`,
      processed: createdCount 
    });

  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json(
      { error: "Failed to sync subscriptions" },
      { status: 500 }
    );
  }
}