import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid review data" },
        { status: 400 }
      );
    }

    // Upsert review (one review per user per product)
    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: { rating, comment },
      create: {
        userId: session.user.id,
        productId,
        rating,
        comment,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    // Update product average rating
    const reviews = await prisma.review.findMany({
      where: { productId },
    });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        ratingCount: reviews.length,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
