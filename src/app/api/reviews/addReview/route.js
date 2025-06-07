import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();
    const {
      comment,
      uiRating,
      performanceRating,
      ideaRating,
      overallRating,
      tag,
      projectId,
      userId,
    } = body;

    // Validate required fields
    if (!comment || !uiRating || !performanceRating || !ideaRating || !overallRating || !tag || !projectId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate ratings are between 1-5
    const ratings = [uiRating, performanceRating, ideaRating, overallRating];
    if (ratings.some(rating => rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Ratings must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate tag is valid
    const validTags = ['DESIGN', 'FUNCTIONALITY', 'PERFORMANCE', 'INNOVATION', 'USER_EXPERIENCE'];
    if (!validTags.includes(tag)) {
      return NextResponse.json(
        { error: 'Invalid review tag' },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        comment,
        uiRating,
        performanceRating,
        ideaRating,
        overallRating,
        tag,
        userId,
        projectId,
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

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
