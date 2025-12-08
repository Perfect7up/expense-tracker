import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- Validation Schema ---
const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name too long"),
  type: z.enum(["EXPENSE", "INCOME"]),
});

const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Name too long")
    .optional(),
  type: z.enum(["EXPENSE", "INCOME"]).optional(),
});

// --- Helper: Get or Create DB User ---
async function getDbUser(authUser: { id: string; email?: string }) {
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: {
      email: authUser.email!,
      supabaseId: authUser.id,
    },
    update: {},
  });
}

// --- GET Handler ---
export async function GET(request: NextRequest) {
  try {
    // 1. Get User Context
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Sync with Database
    const dbUser = await getDbUser(authUser);

    // 3. Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "EXPENSE" or "INCOME"
    const includeCounts = searchParams.get("includeCounts") === "true";

    // 4. Build where clause
    const whereClause: any = {
      userId: dbUser.id,
    };

    if (type) {
      whereClause.type = type;
    }

    // 5. Fetch Categories
    let categories;

    if (includeCounts) {
      // Fetch categories with expense and income counts
      categories = await prisma.category.findMany({
        where: whereClause,
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              expenses: true,
              incomes: true,
            },
          },
        },
      });

      // Format the response
      categories = categories.map((category) => ({
        ...category,
        expenseCount: category._count.expenses,
        incomeCount: category._count.incomes,
        _count: undefined,
      }));
    } else {
      categories = await prisma.category.findMany({
        where: whereClause,
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- POST Handler ---
export async function POST(request: NextRequest) {
  try {
    console.log("=== POST /api/categories called ===");

    // 1. Get User Context
    const authUser = await getAuthenticatedUser();
    console.log(
      "Auth user:",
      authUser ? "✓ Authenticated" : "✗ Not authenticated"
    );

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse & Validate Body
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const validation = createCategorySchema.safeParse(body);
    console.log(
      "Validation result:",
      validation.success ? "✓ Valid" : "✗ Invalid"
    );

    if (!validation.success) {
      console.error(
        "Validation errors:",
        JSON.stringify(validation.error.format(), null, 2)
      );
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    // 3. Sync with Database & Create Category
    console.log("Getting/creating DB user...");
    const dbUser = await getDbUser(authUser);
    console.log("DB User ID:", dbUser.id);

    const data = validation.data;
    console.log("Validated data:", JSON.stringify(data, null, 2));

    // Check for duplicate category name for the same user and type
    const existingCategory = await prisma.category.findFirst({
      where: {
        userId: dbUser.id,
        name: data.name,
        type: data.type,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name and type already exists" },
        { status: 409 }
      );
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        userId: dbUser.id,
      },
    });

    console.log("Category created successfully:", category.id);

    // 4. Return Result
    return NextResponse.json(category);
  } catch (error) {
    console.error("POST Category Error - Full details:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        error: "Failed to create category",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// --- PUT/PATCH Handler ---
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get ID from query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const dbUser = await getDbUser(authUser);
    const data = validation.data;

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found or you don't have permission" },
        { status: 404 }
      );
    }

    // If name is being updated, check for duplicates
    if (data.name && data.name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          userId: dbUser.id,
          name: data.name,
          type: data.type || existingCategory.type,
          NOT: { id: id },
        },
      });

      if (duplicateCategory) {
        return NextResponse.json(
          { error: "Another category with this name and type already exists" },
          { status: 409 }
        );
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : existingCategory.name,
        type: data.type !== undefined ? data.type : existingCategory.type,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// --- DELETE Handler ---
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const dbUser = await getDbUser(authUser);

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
      include: {
        _count: {
          select: {
            expenses: true,
            incomes: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found or you don't have permission" },
        { status: 404 }
      );
    }

    // Check if category has any transactions
    const totalTransactions =
      existingCategory._count.expenses + existingCategory._count.incomes;
    if (totalTransactions > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category with existing transactions",
          details: {
            expenseCount: existingCategory._count.expenses,
            incomeCount: existingCategory._count.incomes,
          },
        },
        { status: 400 }
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
