import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        {
          message: "Project ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    // Clear all collaboration requests for the specified project
    await prisma.collabApplication.deleteMany({
      where: {
        projectId: projectId,
        status: {
          in: ["PENDING", "REJECTED"],
        },
      },
    });

    return NextResponse.json(
      {
        message: "Collaboration requests cleared successfully",
        success: true,
      },
      { status: 200 }
    );
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
