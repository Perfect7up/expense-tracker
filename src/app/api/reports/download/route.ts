// /api/reports/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { getDbUser } from "../_utils";

export async function GET(req: NextRequest) {
  const authUser = await getAuthenticatedUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getDbUser(authUser);

  const [expenses, incomes] = await Promise.all([
    prisma.expense.findMany({ where: { userId: user.id } }),
    prisma.income.findMany({ where: { userId: user.id } }),
  ]);

  const combined = [
    ...expenses.map(e => ({ ...e, record_type: "EXPENSE" })),
    ...incomes.map(i => ({ ...i, record_type: "INCOME" }))
  ];

  if (combined.length === 0) return new NextResponse("No data", { status: 404 });

  const cleanedData = combined.map((item) => {
    const cleanedItem: any = {};
    Object.keys(item).forEach((key) => {
      if (key.toLowerCase().includes("id")) return; // Strip IDs

      let value = item[key];
      if (value instanceof Date) {
        value = value.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      }
      cleanedItem[key] = value;
    });
    return cleanedItem;
  });

  const headers = Object.keys(cleanedData[0]).join(",");
  const rows = cleanedData.map(row =>
    Object.values(row).map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
  );
  const csv = [headers, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=financial-report.csv`,
    },
  });
}