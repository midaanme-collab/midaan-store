'use client';

import React, { useRef, useState, useSyncExternalStore, MouseEvent, ReactNode } from 'react';

interface Interactive3DTiltProps {
  children: ReactNode;
  className?: string;
  maxRotation?: number;
  scale?: number;
  showGlare?: boolean;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export default function Interactive3DTilt({
  children,
  className = '',
  maxRotation = 6, // subtle per instructions
  scale = 1.015,
  showGlare = true,
}: Interactive3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const percentX = (clientX / rect.width) * 2 - 1; // -1 to 1
    const percentY = (clientY / rect.height) * 2 - 1; // -1 to 1

    setRotateY(percentX * maxRotation);
    setRotateX(-percentY * maxRotation);

    setGlarePos({
      x: (clientX / rect.width) * 100,
      y: (clientY / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    if (!prefersReducedMotion) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const transformStyle = prefersReducedMotion || !isHovered
    ? 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    : `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative [perspective:1200px] ${className}`}
      style={{
        transform: transformStyle,
        transition: isHovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
      {showGlare && !prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-30 transition-opacity duration-300 mix-blend-overlay"
          style={{
            opacity: isHovered ? 0.8 : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.05) 35%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}
