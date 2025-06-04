import { PrismaClient } from "@prisma/client"
import { NextResponse , NextRequest } from "next/server";

export async function POST(request){
    try{
        const {requestId} = await request.json();

        const prisma = new PrismaClient();

        if(!requestId){
            return NextResponse.json({
                message: "Request ID is required",
                success: false
            }, {status: 400});
        }

        const acceptRequest = await prisma.CollabApplication.update({
            where: {id: requestId},
            data: {status: "ACCEPTED"}
        })

        return NextResponse.json({  
            message: "Collaboration request accepted successfully",
            success: true,
            acceptRequest
        }, {status: 200});
    }catch(error){
        console.log(error);
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, {status: 500});
    }
}