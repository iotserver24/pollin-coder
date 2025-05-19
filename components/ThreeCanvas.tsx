"use client";

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Particle animation
function ParticleField({ count = 2000 }) {
  const points = useRef<THREE.Points>(null);
  const { gl } = useThree();
  
  // Handle WebGL context loss
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost');
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
    };

    gl.domElement.addEventListener('webglcontextlost', handleContextLost);
    gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
      gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  // Generate random points in a 3D space
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime() * 0.1;
    points.current.rotation.x = time * 0.05;
    points.current.rotation.y = time * 0.07;
  });

  return (
    <Points ref={points} positions={particlePositions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        const gl = canvasRef.current.getContext('webgl');
        if (gl) {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      }
    };
  }, []);

  return (
    <Canvas 
      ref={canvasRef}
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true
      }}
      dpr={[1, 2]} // Limit pixel ratio for better performance
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