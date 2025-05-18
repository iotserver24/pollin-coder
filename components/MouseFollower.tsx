"use client";

import React, { useState, useEffect } from 'react';

export default function MouseFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Function to update position
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Add event listener
    window.addEventListener('mousemove', updatePosition);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);

  if (!isClient) return null;

  return (
    <>
      {/* Main large follower */}
      <div 
        className="fixed pointer-events-none z-0 opacity-30 rounded-full bg-purple-600 blur-3xl"
        style={{
          width: '400px',
          height: '400px',
          transform: `translate(${position.x - 200}px, ${position.y - 200}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      />
      
      {/* Secondary smaller follower */}
      <div 
        className="fixed pointer-events-none z-0 opacity-50 rounded-full bg-purple-400 blur-xl"
        style={{
          width: '100px',
          height: '100px',
          transform: `translate(${position.x - 50}px, ${position.y - 50}px)`,
          transition: 'transform 0.05s linear',
        }}
      />
      
      {/* Little bright dot at cursor */}
      <div 
        className="fixed pointer-events-none z-0 opacity-80 rounded-full bg-white"
        style={{
          width: '8px',
          height: '8px',
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
        }}
      />
    </>
  );
} 