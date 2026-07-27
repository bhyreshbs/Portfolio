"use client";

import { useEffect, useRef } from "react";

interface SecureImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function SecureImage({ src, alt = "Secure Image", className = "" }: SecureImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // Important for external URLs
    
    img.onload = () => {
      // Set canvas dimensions to match the image's intrinsic size
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = src;
  }, [src]);

  return (
    <div 
      className={`relative select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()} // Disable right-click
      onDragStart={(e) => e.preventDefault()}   // Disable drag
    >
      {/* 
        The canvas renders the pixels of the image, so there is no <img src="..."> in the DOM 
        for someone to easily inspect and save.
      */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover pointer-events-none"
        aria-label={alt}
      />
      
      {/* 
        A transparent overlay that catches all mouse events. 
        If someone tries to right-click or inspect, they hit this empty div instead of the canvas.
      */}
      <div className="absolute inset-0 z-10 bg-transparent"></div>
    </div>
  );
}
