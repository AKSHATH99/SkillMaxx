import { PrismaClient } from "@prisma/client";
import { NextResponse , NextRequest } from "next/server";

export async function POST(request){
    try{
        const prisma = new PrismaClient();

        const {projectId, userId, message} = await request.json();
        console.log(projectId, userId, message);

        if(!projectId || !userId || !message){
            return NextResponse.json({
                message: "All fields are required",
                success: false
            }, {status: 400});
        }

        const project = await prisma.project.findUnique({
            where: {id: projectId}
        })

        if(!project){
            return NextResponse.json({  
                message: "Project not found",
                success: false
            }, {status: 404});
        }

        const existingRequest = await prisma.collabApplication.findFirst({
            where: {
                projectId,
                userId
            }
        })  

        if(existingRequest){
            return NextResponse.json({
                message: "You have already sent a collaboration request to this project",
                success: false
            }, {status: 400});
        }
        const collabRequest = await prisma.collabApplication.create({
            data:{
                projectId,
                userId,
                message,
                status: "PENDING",
                createdAt: new Date(),
            }
        })

        return NextResponse.json({
            message: "Collaboration request sent successfully",
            success: true,
            collabRequest
        }, {status: 201});
            
        
    }catch(error){
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
