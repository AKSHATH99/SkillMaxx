
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProjectPage({ params }) {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/project/${params.slug}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch project');
                }
                const data = await response.json();
                setProject(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [params.slug]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <p>ADD EDITIING FEATURES LATER :)</p>
            <h1 className="text-2xl font-bold mb-4">Project: {params.slug}</h1>
            {project && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    {project.image && (
                        <div className="relative w-full h-64">
                            <Image 
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <p className="text-gray-700">{project.description}</p>
                    <div className="flex gap-2">
                        {project.technologies?.map((tech, index) => (
                            <span 
                                key={index}
                                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}