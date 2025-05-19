"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Particle animation
function ParticleField({ count = 1000 }) {
  const points = useRef<THREE.Points>(null);
  
  // Generate random points in a 3D space
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 5;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime() * 0.05;
    points.current.rotation.x = time * 0.02;
    points.current.rotation.y = time * 0.03;
  });

  return (
    <Points ref={points} positions={particlePositions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ThreeCanvas() {
  const [contextLost, setContextLost] = useState(false);

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    setContextLost(true);
  };

  const handleContextRestored = () => {
    setContextLost(false);
  };

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);

  if (contextLost) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-purple-400 opacity-30">
          Recovering 3D context...
        </div>
      </div>
    );
  }

  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 60 }}
      onContextLost={handleContextLost}
      onContextRestore={handleContextRestored}
    >
      <ambientLight intensity={0.2} />
      <ParticleField />
      <mesh scale={[80, 80, 1]} position={[0, 0, -5]}>
        <planeGeometry />
        <meshBasicMaterial color="#050505" />
      </mesh>
    </Canvas>
  );
} 