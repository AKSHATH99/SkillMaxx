import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          message: "Project ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json(
      {
        message: "Project deleted successfully",
        success: true,
        project,
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
