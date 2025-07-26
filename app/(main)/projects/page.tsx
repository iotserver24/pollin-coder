"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Spinner from "@/components/spinner";
import { useAnalytics } from "@/hooks/use-analytics";

interface Project {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
  model: string;
  quality: string;
}

// Skeleton loading component for project cards
const ProjectCardSkeleton = () => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <div className="mb-4">
      <div className="h-6 bg-gray-700 rounded mb-2 w-3/4 animate-skeleton-shimmer"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 animate-skeleton-shimmer"></div>
    </div>
    <div className="mb-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-full animate-skeleton-shimmer"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 animate-skeleton-shimmer"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6 animate-skeleton-shimmer"></div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 bg-gray-700 rounded w-16 animate-skeleton-shimmer"></div>
        <div className="h-6 bg-gray-700 rounded w-20 animate-skeleton-shimmer"></div>
      </div>
    </div>
    <div className="h-10 bg-gray-700 rounded w-full animate-skeleton-shimmer"></div>
  </div>
);

// Loading skeleton grid
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div 
        key={index} 
        style={{ 
          animationDelay: `${index * 0.1}s`,
          animationFillMode: 'both'
        }}
        className="animate-fadeIn"
      >
        <ProjectCardSkeleton />
      </div>
    ))}
  </div>
);

export default function ProjectsPage() {
  const router = useRouter();
  const analytics = useAnalytics();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [forkingProjectId, setForkingProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    // Track gallery view only once
    if (!hasTrackedView.current) {
      analytics.trackGalleryViewed();
      hasTrackedView.current = true;
    }
    fetchProjects();
  }, []); // Remove analytics from dependency array

  const fetchProjects = async (isRefresh = false) => {
    try {
      setError(null);
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleFork = async (projectId: string) => {
    try {
      setForkingProjectId(projectId);
      
      // Track project fork attempt
      analytics.trackProjectForked(projectId);
      
      const response = await fetch(`/api/projects/${projectId}/fork`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.newChatId) {
        router.push(`/chats/${data.newChatId}`);
      }
    } catch (error) {
      console.error('Failed to fork project:', error);
      analytics.trackError('project_fork_failed', error instanceof Error ? error.message : 'Fork failed');
      alert('Failed to fork project. Please try again.');
    } finally {
      setForkingProjectId(null);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Projects Gallery</h1>
          {!isLoading && (
            <button
              onClick={() => fetchProjects(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {isRefreshing ? (
                <>
                  <Spinner className="w-4 h-4" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </>
              )}
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <Spinner className="w-6 h-6 text-purple-400" />
                <span className="text-purple-300 text-lg">Loading projects...</span>
              </div>
            </div>
            <LoadingSkeleton />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-red-400 text-lg mb-4">{error}</div>
            <button
              onClick={() => fetchProjects(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-400 text-lg mb-4">No projects found</div>
            <p className="text-gray-500 text-sm mb-6">Create your first project to get started!</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="relative">
            {isRefreshing && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-3 bg-gray-900/90 px-4 py-2 rounded-lg">
                  <Spinner className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300">Updating projects...</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500 transition-colors">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400">
                      Created {formatDate(project.createdAt)}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-300 line-clamp-3 mb-4">{project.prompt}</p>
                    <div className="flex gap-2">
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
                    disabled={forkingProjectId === project.id || isRefreshing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {forkingProjectId === project.id ? (
                      <>
                        <Spinner className="w-5 h-5 mr-2" />
                        Forking...
                      </>
                    ) : (
                      'Fork Project'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 