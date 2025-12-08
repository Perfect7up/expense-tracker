import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";

// ----------------------------
// GET /api/download-summary
// ----------------------------
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch DB user
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Query params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "expense"; // expense | income
    const period = searchParams.get("period") || "month"; // month | year

    // Date Range
    const now = new Date();
    let startDate: Date;

    if (period === "year") {
      startDate = new Date(now.getFullYear() - 1, 0, 1);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    }

    // Fetch RAW DATA (not summary)
    let records: any[] = [];

    if (type === "expense") {
      records = await prisma.expense.findMany({
        where: {
          userId: dbUser.id,
          occurredAt: { gte: startDate, lte: now },
        },
        include: {
          category: true, // IMPORTANT
        },
        orderBy: { occurredAt: "asc" },
      });
    } else {
      records = await prisma.income.findMany({
        where: {
          userId: dbUser.id,
          receivedAt: { gte: startDate, lte: now },
        },
        orderBy: { receivedAt: "asc" },
      });
    }

    // CSV Helper
    const escapeCSV = (val: any) => {
      if (!val) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const formatDate = (d: Date) => new Date(d).toLocaleDateString("en-US");

    const formatTime = (d: Date) =>
      new Date(d).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

    // CSV headers
    const headers =
      type === "expense"
        ? ["Date", "Time", "Amount", "Currency", "Note", "Category"]
        : ["Date", "Time", "Amount", "Currency", "Note", "Source"];

    // CSV rows
    const rows = records.map((item) => {
      const dateField = type === "expense" ? item.occurredAt : item.receivedAt;

      const lastField =
        type === "expense"
          ? item.category?.name || "Uncategorized"
          : item.source || "N/A";

      return [
        escapeCSV(formatDate(dateField)),
        escapeCSV(formatTime(dateField)),
        escapeCSV(Number(item.amount).toFixed(2)),
        escapeCSV(item.currency || "USD"),
        escapeCSV(item.note || ""),
        escapeCSV(lastField),
      ].join(",");
    });

    // Combine CSV
    const csvString = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvString, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}-summary.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV Download Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
