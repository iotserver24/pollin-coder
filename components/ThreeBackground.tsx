"use client";

import React, { useEffect, useState } from 'react';

// Create a static version for server rendering
const StaticBackground = () => (
  <div className="fixed inset-0 z-0 bg-black"></div>
);

export default function ThreeBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Create particles dynamically on the client side
    const container = document.createElement('div');
    container.className = 'absolute inset-0 opacity-20';
    
    for (let i = 0; i < 100; i++) {
      const particle = document.createElement('div');
      
      // Apply styles
      particle.className = 'absolute rounded-full bg-purple-500';
      particle.style.width = `${Math.random() * 4 + 1}px`;
      particle.style.height = `${Math.random() * 4 + 1}px`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animation = `pulse ${Math.random() * 8 + 2}s infinite`;
      particle.style.opacity = `${Math.random() * 0.5 + 0.3}`;
      
      container.appendChild(particle);
    }
    
    // Add particles to the background div
    const backgroundEl = document.getElementById('particle-background');
    if (backgroundEl) {
      backgroundEl.appendChild(container);
    }
    
    // Cleanup function
    return () => {
      if (backgroundEl && backgroundEl.contains(container)) {
        backgroundEl.removeChild(container);
      }
    };
  }, []);

  return <div id="particle-background" className="fixed inset-0 z-0 bg-black"></div>;
} 