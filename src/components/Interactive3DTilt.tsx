'use client';

import React, { useRef, useState, MouseEvent, ReactNode } from 'react';

interface Interactive3DTiltProps {
  children: ReactNode;
  className?: string;
  maxRotation?: number;
  scale?: number;
}

export default function Interactive3DTilt({
  children,
  className = '',
  maxRotation = 15,
  scale = 1.05,
}: Interactive3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation based on distance from center
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    setRotateY(percentX * maxRotation);
    setRotateX(-percentY * maxRotation); // Negative so it tilts towards mouse
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
      className={`relative transition-all duration-200 ease-linear [perspective:1000px] ${className}`}
      style={{
        transform: isHovered
          ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
          : 'rotateX(0deg) rotateY(0deg) scale(1)',
      }}
    >
      {children}
    </div>
  );
}
