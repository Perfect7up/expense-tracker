import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { getDbUser } from "../_utils";

export async function GET(req: NextRequest) {
  const authUser = await getAuthenticatedUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getDbUser(authUser);

  const type = req.nextUrl.searchParams.get("type"); // expenses | incomes
  const format = req.nextUrl.searchParams.get("format") ?? "csv";

  let data: any[] = [];

  if (type === "expenses") {
    data = await prisma.expense.findMany({
      where: { userId: user.id },
    });
  }

  if (type === "incomes") {
    data = await prisma.income.findMany({
      where: { userId: user.id },
    });
  }

  if (format === "json") {
    return NextResponse.json(data);
  }

  // CSV
  const headers = Object.keys(data[0] ?? {}).join(",");
  const rows = data.map(row =>
    Object.values(row).map(v => `"${v ?? ""}"`).join(",")
  );

  const csv = [headers, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${type}-report.csv`,
    },
  });
}
