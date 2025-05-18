"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

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

export default function ThreeBackgroundScene() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-black">
        <div className="absolute inset-0 flex items-center justify-center text-purple-400 opacity-30">
          Loading 3D elements...
        </div>
      </div>
    );
  }

  return <ThreeCanvas />;
} 