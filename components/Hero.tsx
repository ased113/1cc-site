"use client";

import React, { useEffect, useRef, useState } from "react";

const REVEAL_RADIUS = 88;
const TRAIL_LIFETIME = 1650;
const TRAIL_SPACING = 9;

interface TrailPoint {
  x: number;
  y: number;
  time: number;
  random: number;
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!hero || !video || !canvas || !cursor) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    video.muted = true;
    video.volume = 0;
    video.play().catch(() => {});

    const photo = new Image();
    photo.src = "/photos/photo1cc.jpg";

    let canvasWidth = 0;
    let canvasHeight = 0;
    let pixelRatio = 1;
    let rafId: number;

    const trail: TrailPoint[] = [];
    let lastX: number | null = null;
    let lastY: number | null = null;
    let mouseX = 0;
    let mouseY = 0;
    let mouseInside = false;

    function resizeCanvas() {
      if (!hero || !canvas) return;
      const rect = hero.getBoundingClientRect();

      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = rect.width;
      canvasHeight = rect.height;

      canvas.width = Math.round(canvasWidth * pixelRatio);
      canvas.height = Math.round(canvasHeight * pixelRatio);
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";

      ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function drawCoverImage() {
      if (!photo.complete) return;

      const imageRatio = photo.width / photo.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

      if (imageRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imageRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imageRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctx!.drawImage(photo, offsetX, offsetY, drawWidth, drawHeight);
    }

    function addTrailPoint(x: number, y: number, time: number) {
      trail.push({
        x,
        y,
        time,
        random: 0.9 + Math.random() * 0.2,
      });
    }

    function createTrailBetween(x1: number, y1: number, x2: number, y2: number) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.ceil(distance / TRAIL_SPACING));
      const now = performance.now();

      for (let i = 1; i <= steps; i++) {
        const progress = i / steps;
        addTrailPoint(x1 + dx * progress, y1 + dy * progress, now);
      }
    }

    function eraseSpot(x: number, y: number, radius: number, opacity: number) {
      const gradient = ctx!.createRadialGradient(x, y, radius * 0.15, x, y, radius);
      gradient.addColorStop(0, `rgba(0,0,0,${opacity})`);
      gradient.addColorStop(0.52, `rgba(0,0,0,${opacity * 0.92})`);
      gradient.addColorStop(0.76, `rgba(0,0,0,${opacity * 0.52})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx!.fillStyle = gradient;
      ctx!.beginPath();
      ctx!.arc(x, y, radius, 0, Math.PI * 2);
      ctx!.fill();
    }

    function render() {
      const now = performance.now();

      ctx!.globalCompositeOperation = "source-over";
      ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
      drawCoverImage();

      ctx!.globalCompositeOperation = "destination-out";

      for (let i = trail.length - 1; i >= 0; i--) {
        const point = trail[i];
        const age = now - point.time;

        if (age > TRAIL_LIFETIME) {
          trail.splice(i, 1);
          continue;
        }

        const life = age / TRAIL_LIFETIME;
        const opacity = Math.pow(1 - life, 1.7);
        const radius = REVEAL_RADIUS * point.random * (1 - life * 0.38);

        eraseSpot(point.x, point.y, radius, opacity);
      }

      if (mouseInside) {
        const pulse = 1 + Math.sin(now * 0.004) * 0.025;
        eraseSpot(mouseX, mouseY, REVEAL_RADIUS * pulse, 1);
      }

      ctx!.globalCompositeOperation = "source-over";
      rafId = requestAnimationFrame(render);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = hero!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouseX = x;
      mouseY = y;

      if (cursor) {
        cursor.style.transform = `translate3d(${x - 3.5}px, ${y - 3.5}px, 0)`;
      }

      if (lastX !== null && lastY !== null) {
        createTrailBetween(lastX, lastY, x, y);
      } else {
        addTrailPoint(x, y, performance.now());
      }

      lastX = x;
      lastY = y;
    }

    function onPointerEnter(event: PointerEvent) {
      mouseInside = true;
      setIsHovered(true);

      const rect = hero!.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
      lastX = mouseX;
      lastY = mouseY;

      addTrailPoint(mouseX, mouseY, performance.now());
    }

    function onPointerLeave() {
      mouseInside = false;
      setIsHovered(false);
      lastX = null;
      lastY = null;
    }

    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerenter", onPointerEnter);
    hero.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resizeCanvas);

    photo.onload = () => {
      resizeCanvas();
      rafId = requestAnimationFrame(render);
    };

    return () => {
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerenter", onPointerEnter);
      hero.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resizeCanvas);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">
            <span className="logo-dot" />
            <span>1CC</span>
          </a>

          <nav className="nav">
  <a href="#about" className="nav-link">Про нас</a>
  <a href="#pricing" className="nav-link">Тарифи</a>
  <a href="#contacts" className="nav-link">Контакти</a>
</nav>

          <div className="header-action">
            <a href="#start" className="start-button">
              Почати роботу
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section ref={heroRef} className={`hero ${isHovered ? "is-hovered" : ""}`} id="hero">
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
          >
            <source src="/videos/video.mp4" type="video/mp4" />
          </video>

          <canvas ref={canvasRef} className="hero-canvas" />

          <div ref={cursorRef} className="custom-cursor" />
        </section>
      </main>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          width: 100%;
          background: #000;
        }

        body {
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .hero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          background: #000;
          cursor: none;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 1;
          pointer-events: none;
        }

        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .custom-cursor {
          position: absolute;
          top: 0;
          left: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.45);
          transform: translate3d(-100px, -100px, 0);
          z-index: 20;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .hero.is-hovered .custom-cursor {
          opacity: 1;
        }

        .header {
          position: fixed;
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 64px);
          max-width: 1380px;
          z-index: 100;
        }

        .header-inner {
          height: 72px;
          padding: 0 12px 0 26px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          border-radius: 22px;
          background: rgba(10, 10, 10, 0.43);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 12px 45px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.045);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .logo {
          justify-self: start;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .logo-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 14px rgba(255, 255, 255, 0.55);
        }

        .nav {
          justify-self: center;
          display: flex;
          align-items: center;
          gap: 42px;
        }

        .nav-link {
          position: relative;
          color: rgba(255, 255, 255, 0.66);
          font-size: 14px;
          font-weight: 500;
          transition: color 0.25s ease;
        }

        .nav-link:hover {
          color: #fff;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -8px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #fff;
          transform: translateX(-50%) scale(0);
          opacity: 0;
          transition: 0.25s ease;
        }

        .nav-link:hover::after {
          opacity: 1;
          transform: translateX(-50%) scale(1);
        }

        .header-action {
          justify-self: end;
        }

        .start-button {
          height: 48px;
          padding: 0 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          border-radius: 15px;
          background: #fff;
          color: #080808;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.02em;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        .start-button:hover {
          transform: translateY(-2px);
          background: #f3f3f3;
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.12);
        }

        .arrow {
          width: 19px;
          height: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #0b0b0b;
          color: white;
          font-size: 11px;
          transition: transform 0.25s ease;
        }

        .start-button:hover .arrow {
          transform: translateX(3px);
        }

        @media (max-width: 760px) {
          .hero {
            cursor: auto;
          }
          .custom-cursor {
            display: none;
          }
          .header {
            top: 14px;
            width: calc(100% - 28px);
          }
          .header-inner {
            height: 62px;
            padding: 0 18px;
            grid-template-columns: 1fr auto;
            border-radius: 18px;
          }
          .nav {
            display: none;
          }
          .header-action {
            display: block;
          }
          .start-button {
            height: 42px;
            padding: 0 16px;
            font-size: 13px;
          }
          .logo {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
}