import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    // Parse request body
    const body = await req.json();
    const {
      reviewId,
      comment,
      uiRating,
      performanceRating,
      ideaRating,
      overallRating,
      tag,
      userId,
    } = body;

    // Validate required fields
    if (!reviewId || !userId) {
      return NextResponse.json(
        { error: 'Review ID and User ID are required' },
        { status: 400 }
      );
    }

    // Find the existing review
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user is the review author
    if (existingReview.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only edit your own reviews' },
        { status: 403 }
      );
    }

    // Validate ratings if provided
    if (uiRating || performanceRating || ideaRating || overallRating) {
      const ratings = [
        uiRating || existingReview.uiRating,
        performanceRating || existingReview.performanceRating,
        ideaRating || existingReview.ideaRating,
        overallRating || existingReview.overallRating
      ];

      if (ratings.some(rating => rating < 1 || rating > 5)) {
        return NextResponse.json(
          { error: 'Ratings must be between 1 and 5' },
          { status: 400 }
        );
      }
    }

    // Validate tag if provided
    if (tag) {
      const validTags = ['DESIGN', 'FUNCTIONALITY', 'PERFORMANCE', 'INNOVATION', 'USER_EXPERIENCE'];
      if (!validTags.includes(tag)) {
        return NextResponse.json(
          { error: 'Invalid review tag' },
          { status: 400 }
        );
      }
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        comment: comment || existingReview.comment,
        uiRating: uiRating || existingReview.uiRating,
        performanceRating: performanceRating || existingReview.performanceRating,
        ideaRating: ideaRating || existingReview.ideaRating,
        overallRating: overallRating || existingReview.overallRating,
        tag: tag || existingReview.tag,
      },
      include: {
        user: {
          select: {
            id: true,
            Name: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
