import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    // Get reviewId and userId from URL search params
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('reviewId');
    const userId = searchParams.get('userId');

    if (!reviewId || !userId) {
      return NextResponse.json(
        { error: 'Review ID and User ID are required' },
        { status: 400 }
      );
    }

    // Find the review and include project owner information
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        project: {
          select: {
            ownerId: true
          }
        }
      }
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user is either the review author or the project owner
    const isReviewAuthor = review.userId === userId;
    const isProjectOwner = review.project.ownerId === userId;

    if (!isReviewAuthor && !isProjectOwner) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only delete your own reviews or reviews on your projects' },
        { status: 403 }
      );
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
