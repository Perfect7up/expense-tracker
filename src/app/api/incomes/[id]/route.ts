import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { updateIncomeSchema } from "@/app/core/schema/income";

// --- Helper: Upsert user ---
async function getDbUser(authUser: { id: string; email?: string }) {
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: { email: authUser.email!, supabaseId: authUser.id },
    update: {},
  });
}

// --- GET Single Income ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getDbUser(authUser);
    const { id } = await params;

    const income = await prisma.income.findFirst({
      where: {
        id: id,
        userId: dbUser.id,
      },
      include: { category: true },
    });

    if (!income) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    return NextResponse.json({ ...income, amount: Number(income.amount) });
  } catch (error) {
    console.error("GET Single Income Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- UPDATE Income ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getDbUser(authUser);
    const { id } = await params;

    const body = await request.json();
    const validation = updateIncomeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    // Check if income exists and belongs to user
    const existingIncome = await prisma.income.findFirst({
      where: {
        id: id,
        userId: dbUser.id,
      },
    });

    if (!existingIncome) {
      return NextResponse.json(
        { error: "Income not found or you don't have permission" },
        { status: 404 }
      );
    }

    const data = validation.data;

    const income = await prisma.income.update({
      where: { id: id },
      data: {
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.source !== undefined && { source: data.source }),
        ...(data.note !== undefined && { note: data.note }),
        ...(data.receivedAt !== undefined && {
          receivedAt: new Date(data.receivedAt),
        }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      },
      include: { category: true },
    });

    return NextResponse.json({ ...income, amount: Number(income.amount) });
  } catch (error) {
    console.error("PUT Income Error:", error);
    return NextResponse.json(
      { error: "Failed to update income" },
      { status: 500 }
    );
  }
}

// --- DELETE Income ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("=== DELETE INCOME API CALLED ===");
  console.log("Request URL:", request.url);

  try {
    // 1. Get authenticated user
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      console.log("ERROR: No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Authenticated user ID:", authUser.id);

    // 2. Get database user
    const dbUser = await getDbUser(authUser);
    console.log("Database user ID:", dbUser.id);

    // 3. Get income ID from params (await it!)
    const { id } = await params;
    console.log("Income ID to delete:", id);

    if (!id || id === "[id]") {
      console.log("ERROR: Invalid income ID");
      return NextResponse.json({ error: "Invalid income ID" }, { status: 400 });
    }

    // 4. Check if income exists and belongs to user
    const existingIncome = await prisma.income.findFirst({
      where: {
        id: id,
        userId: dbUser.id,
      },
    });

    console.log("Existing income found:", !!existingIncome);

    if (!existingIncome) {
      console.log("ERROR: Income not found or doesn't belong to user");
      return NextResponse.json(
        { error: "Income not found or you don't have permission" },
        { status: 404 }
      );
    }

    // 5. Delete the income
    console.log("Attempting to delete income...");
    await prisma.income.delete({
      where: { id: id },
    });

    console.log("SUCCESS: Income deleted");

    return NextResponse.json(
      {
        success: true,
        message: "Income deleted successfully",
        deletedId: id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("=== DELETE INCOME ERROR ===");
    console.error("Error:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete income due to related records" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete income",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    console.log("=== DELETE INCOME COMPLETED ===");
  }
}
