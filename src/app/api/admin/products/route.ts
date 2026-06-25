import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Admin middleware
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", status: 401 };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user || user.role !== "ADMIN") {
    return { error: "Forbidden", status: 403 };
  }
  return { user };
}

export async function GET() {
  const check = await requireAdmin();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  try {
    const [products, totalProducts, totalUsers, totalOrders, revenueData] =
      await Promise.all([
        prisma.product.findMany({
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
        prisma.product.count(),
        prisma.user.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: { status: { not: "CANCELLED" } },
        }),
      ]);

    return NextResponse.json({
      products,
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue: revenueData._sum.totalAmount || 0,
      },
    });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const check = await requireAdmin();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  try {
    const body = await req.json();
    const product = await prisma.product.create({ data: body });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
