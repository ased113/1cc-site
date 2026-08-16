"use client";

import React, { useEffect, useRef } from "react";

export const LiquidMeshBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (mouse.x === 0 && mouse.y === 0) {
        mouse.x = mouse.targetX = width / 2;
        mouse.y = mouse.targetY = height / 2;
      }
    };

    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    container.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.015;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Interactive fluid glow aura under cursor
      const auraGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        450
      );
      auraGradient.addColorStop(0, "rgba(163, 230, 53, 0.25)");
      auraGradient.addColorStop(0.4, "rgba(163, 230, 53, 0.08)");
      auraGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 450, 0, Math.PI * 2);
      ctx.fill();

      // 2. High-tech grid with mouse distortion
      const step = 40;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        for (let y = 0; y < height; y += 20) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;

          let shiftX = 0;
          if (dist < maxDist) {
            shiftX = Math.sin(dist * 0.05 - time * 2) * (1 - dist / maxDist) * 15;
          }

          if (y === 0) ctx.moveTo(x + shiftX, y);
          else ctx.lineTo(x + shiftX, y);
        }
        ctx.stroke();
      }

      // 3. Glowing accent nodes
      for (let x = 20; x < width; x += step * 2) {
        for (let y = 20; y < height; y += step * 2) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.fillStyle = "#a3e635";
            ctx.globalAlpha = (1 - dist / 180) * 0.8;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="liquid-mesh-wrap">
      <div className="liquid-mesh-blob" />
      <canvas ref={canvasRef} className="liquid-mesh-canvas" />

      <style jsx>{`
        .liquid-mesh-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .liquid-mesh-blob {
          position: absolute;
          top: 33%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: rgba(163, 230, 53, 0.1);
          border-radius: 50%;
          filter: blur(150px);
          animation: meshPulse 5s ease-in-out infinite;
        }

        @keyframes meshPulse {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
        }

        .liquid-mesh-canvas {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default LiquidMeshBackground;