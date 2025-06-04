import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { uploadFile } from "../../../../lib/cloudinary";

export async function POST(request) {
    try {
        // Get FormData from the request
        const formData = await request.formData();

        const prisma = new PrismaClient();
        
        // Extract files
        const screenshots = formData.getAll('screenshots');
        const demoVideo = formData.get('demoVideo');
        
        // Extract other form fields
        const title = formData.get('title');
        const description = formData.get('description');
        const githubUrl = formData.get('githubUrl');
        const liveUrl = formData.get('liveUrl');
        const techStack = JSON.parse(formData.get('techStack'));
        const acceptingCollabs = formData.get('acceptingCollabs') === 'true';
        const collabDescription = formData.get('collabDescription');
        const ownerId = formData.get('ownerId');

        // Validate required fields
        if (!title || !description || !techStack || !ownerId) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Upload screenshots
        const uploadedScreenshots = [];
        for (const screenshot of screenshots) {
            const buffer = await screenshot.arrayBuffer();
            const result = await uploadFile(buffer, 'project-screenshots');
            if (result.success) {
                uploadedScreenshots.push(result.url);
            }
        }

        // Upload demo video if present
        let demoVideoUrl = null;
        if (demoVideo) {
            const videoBuffer = await demoVideo.arrayBuffer();
            const videoResult = await uploadFile(videoBuffer, 'project-videos');
            if (videoResult.success) {
                demoVideoUrl = videoResult.url;
            }
        }

        // Create project in database
        const project = await prisma.project.create({
            data: {
                title,
                description,
                githubUrl,
                liveUrl,
                techStack,
                screenshots: uploadedScreenshots,
                acceptingCollabs,
                collabDescription,
                demoVideo: demoVideoUrl,
                owner: {
                    connect: {
                        id: ownerId
                    }
                }
            }
        });
        
        return NextResponse.json({
            message: "Project created successfully",
            success: true,
            project
        }, { status: 201 });

    } catch (error) {
        console.error("Error while creating project:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
}
