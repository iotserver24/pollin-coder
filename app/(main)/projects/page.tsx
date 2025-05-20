"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Spinner from "@/components/spinner";

interface Project {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
  model: string;
  quality: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFork = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/fork`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.newChatId) {
        router.push(`/chats/${data.newChatId}`);
      }
    } catch (error) {
      console.error('Failed to fork project:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Projects Gallery</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-gray-400">
                    Created {formatDate(project.createdAt)}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-300 line-clamp-3">{project.prompt}</p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-sm">
                      {project.model}
                    </span>
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm">
                      {project.quality}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleFork(project.id)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Fork Project
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 