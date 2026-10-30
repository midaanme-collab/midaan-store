'use client';

import React, { useRef, useState, MouseEvent, ReactNode } from 'react';

interface Interactive3DTiltProps {
  children: ReactNode;
  className?: string;
  maxRotation?: number;
  scale?: number;
  showGlare?: boolean;
}

export default function Interactive3DTilt({
  children,
  className = '',
  maxRotation = 12,
  scale = 1.03,
  showGlare = true,
}: Interactive3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
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
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative [perspective:1200px] select-none ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
      {showGlare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-30 transition-opacity duration-300 mix-blend-overlay"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 75%)`,
          }}
        />
      )}
    </div>
  );
}
