import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import ProjectPageClient from "./project-page-client";

type ProjectPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.id,
    }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = projects.find((item) => item.id === slug);

    if (!project) {
        return {
            title: "Project not found",
        };
    }

    return {
        title: `${project.name} | Projects`,
        description: project.description,
    };
}

export default async function Page({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = projects.find((item) => item.id === slug);

    if (!project) {
        notFound();
    }

    return <ProjectPageClient project={project} />;
}
