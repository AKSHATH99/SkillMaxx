import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  try { 
    const prisma = new PrismaClient();
    const { projectID } = await request.json();
    if (!projectID) {
      return NextResponse.json(
        {
          message: "Project ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const collabRequests = await prisma.collabApplication.findMany({
      where: {
        projectId: projectID,
      },
      include: {
        user: {
          select: {
            id: true,
            Name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Collaboration requests fetched successfully",
      success: true,
      collabRequests,
    }, {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
