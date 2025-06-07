import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {    
    // Await params before accessing properties (Next.js 15+ requirement)
    const { slug } = await params;
    
    if (!slug) {
        return NextResponse.json({ message: 'Project slug is required' }, { status: 400 });
    }
    
    const prisma = new PrismaClient();
    
    try {
        const project = await prisma.project.findUnique({
            where: { id: slug },
            include: {
                owner: true,
                contributors: true,
                collabApplications: true,
                reviews: {
                    include: {
                        user: true,
                        likes: true
                    }
                }
            },
        });
        
        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }
        
        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}