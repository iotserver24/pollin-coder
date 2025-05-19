"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

// Dynamically import Three.js components with no SSR
const ThreeCanvas = dynamic(() => import('./ThreeCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black">
      <div className="absolute inset-0 flex items-center justify-center text-purple-400 opacity-30">
        Loading 3D elements...
      </div>
    </div>
  ),
});

// Fallback component for when Three.js fails
const ThreeFallback = () => (
  <div className="w-full h-full bg-black">
    <div className="absolute inset-0 flex items-center justify-center text-purple-400 opacity-30">
      Unable to load 3D background
    </div>
  </div>
);

export default function ThreeBackgroundScene() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      // Cleanup any Three.js resources
      if (typeof window !== 'undefined') {
        const canvas = document.querySelector('canvas');
        if (canvas) {
          const gl = canvas.getContext('webgl');
          if (gl) {
            gl.getExtension('WEBGL_lose_context')?.loseContext();
          }
        }
      }
    };
  }, []);

  if (!isMounted) {
    return <ThreeFallback />;
  }

  return (
    <ErrorBoundary FallbackComponent={ThreeFallback}>
      <ThreeCanvas />
    </ErrorBoundary>
  );
} 