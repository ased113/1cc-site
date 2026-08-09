"use client";

import React, { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

function StatValue({ target, pad, suffix }: { target: number; pad?: number; suffix?: string }) {
  const { value, ref } = useCountUp(target);
  const display = pad ? String(value).padStart(pad, "0") : String(value);

  return (
    <div className="about-stat-value" ref={ref}>
      {display}
      {suffix}
    </div>
  );
}

const ROTATING_WORDS = [
  "REVENUE ENGINE",
  "CLOSING MACHINE",
  "SALES SYSTEM",
  "GROWTH ENGINE",
];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 400);
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`rotating-word ${visible ? "is-visible" : ""}`}>
      {ROTATING_WORDS[index]}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="about">

      <div className="light-streak" />

      <div className="tech-layer">
        <div className="tech-line">01CC / ABOUT</div>
        <div className="tech-line">SYSTEM.STATUS: ACTIVE</div>
        <div className="tech-divider" />
        <div className="tech-line">REVENUE</div>
        <div className="tech-line">CONVERSION</div>
        <div className="tech-line">CLOSING</div>
        <div className="tech-line">PERFORMANCE</div>
      </div>

      <div className="tech-grid">
        <div className="tech-grid-v" />
        <div className="tech-grid-h" />
      </div>

      <div className="about-inner">

        <span className="about-label">
          <span className="about-dot" />
          WHO WE ARE
        </span>

        <h2 className="about-title">
          <span className="about-title-static">Ми не call-центр.</span>
          <br />
          <span className="about-title-static">Ми —</span> <RotatingWord />.
        </h2>

        <p className="about-text">
          Не обробляємо ліди. Забираємо гроші з бази. Без довгих скриптів і
          формальних дзвінків «для звіту». Наші closer'и пробивають відмови,
          працюють із запереченнями та дотискають угоди там, де інші списали
          трафік у брак.
        </p>

        <div className="about-grid">

          <div className="about-card about-card-wide">
            <div className="card-top-row">
              <div className="about-card-num">01</div>
              <div className="card-status">
                <span className="status-dot" />
                ACTIVE
              </div>
            </div>
            <div className="card-line" />
            <div className="about-card-title">No fluff</div>
            <div className="about-card-text">
              Без «звітів про активність». Тільки конверсія і закриті угоди.
            </div>
          </div>

          <div className="about-card">
            <div className="about-card-num">02</div>
            <div className="card-line" />
            <div className="about-card-title">Top-tier team</div>
            <div className="about-card-text">
              Кожен оператор пройшов відбір жорсткіший, ніж у більшість вакансій
              в IT.
            </div>
          </div>

          <div className="about-card">
            <div className="about-card-num">03</div>
            <div className="card-line" />
            <div className="about-card-title">Full control</div>
            <div className="about-card-text">
              Прозора аналітика в реальному часі. Ти бачиш кожен дзвінок, кожну
              цифру.
            </div>
          </div>

        </div>

        <div className="about-stats">
          <div className="about-stat">
            <StatValue target={2} />
            <div className="about-stat-label">
              Years
              <br />
              in the game
            </div>
            <div className="about-stat-metric">
              <span className="metric-arrow">↑</span> 2023
            </div>
          </div>

          <div className="about-stat">
            <StatValue target={100} suffix="+" />
            <div className="about-stat-label">
              Happy
              <br />
              clients
            </div>
            <div className="about-stat-metric">
              <span className="metric-arrow">↑</span> 94%
            </div>
          </div>

          <div className="about-stat">
            <StatValue target={300} suffix="K+" />
            <div className="about-stat-label">
              Leads
              <br />
              closed
            </div>
            <div className="about-stat-metric">
              <span className="metric-arrow">↑</span> +32%
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .about {
          position: relative;
          width: 100%;
          min-height: 100vh;

          background: #000;
          color: #fff;

          display: flex;
          align-items: center;

          padding: 140px 32px;
          overflow: hidden;

          scroll-margin-top: 110px;
        }

        .light-streak {
          position: absolute;
          top: 210px;
          left: -10%;
          width: 55%;
          height: 2px;

          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.9) 55%,
            rgba(220, 220, 220, 0.7) 70%,
            rgba(163, 230, 53, 0.6) 85%,
            transparent 100%
          );

          transform: rotate(-14deg);
          transform-origin: right center;
          filter: blur(0.5px);
          opacity: 0.55;
          pointer-events: none;
        }

        .tech-layer {
          position: absolute;
          top: 50%;
          right: 48px;
          transform: translateY(-50%);

          text-align: right;
          pointer-events: none;

          font-family: "Courier New", monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.2);
          line-height: 2.1;

          opacity: 0.9;
        }

        .tech-line {
          white-space: nowrap;
        }

        .tech-divider {
          margin: 10px 0;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
        }

        .tech-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .tech-grid-v {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 320px;
          width: 1px;
          background: rgba(255, 255, 255, 0.06);
        }

        .tech-grid-h {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
        }

        .about-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
        }

        .about-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 8px 20px;

          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);

          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        .about-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a3e635;
          box-shadow: 0 0 10px rgba(163, 230, 53, 0.9);
          animation: dotPulse 2.2s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 10px rgba(163, 230, 53, 0.9);
          }
          50% {
            opacity: 0.5;
            box-shadow: 0 0 4px rgba(163, 230, 53, 0.4);
          }
        }

        .about-title {
          margin-top: 36px;

          font-size: 52px;
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.08;
          text-transform: uppercase;
        }

        .about-title-static {
          color: rgba(255, 255, 255, 0.85);
        }

        .rotating-word {
          display: inline-block;

          font-family: inherit;
          font-weight: 900;
          text-transform: uppercase;
          color: #ffffff;
          text-shadow: 0 0 24px rgba(255, 255, 255, 0.35);

          opacity: 0;
          filter: blur(8px);
          transform: translateY(4px);

          transition: opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease;
        }

        .rotating-word.is-visible {
          opacity: 1;
          filter: blur(0px);
          transform: translateY(0);
        }

        .about-text {
          margin-top: 28px;
          max-width: 680px;

          font-size: 20px;
          font-weight: 500;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.72);
        }

        .about-grid {
          margin-top: 72px;

          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .about-card {
          position: relative;
          padding: 32px 28px;

          background: #060606;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;

          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }

        .about-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.28);
          background: #0b0b0b;
        }

        .about-card-wide {
          grid-column: 1 / -1;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .about-card-num {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.35);
          transition: color 0.25s ease;
        }

        .about-card:hover .about-card-num {
          color: rgba(163, 230, 53, 0.9);
        }

        .card-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: rgba(163, 230, 53, 0.7);
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #a3e635;
          box-shadow: 0 0 8px rgba(163, 230, 53, 0.8);
          animation: dotPulse 2.2s ease-in-out infinite;
        }

        .card-line {
          margin-top: 14px;
          width: 0;
          height: 1px;
          background: rgba(163, 230, 53, 0.5);
          transition: width 0.4s ease;
        }

        .about-card:hover .card-line {
          width: 48px;
        }

        .about-card-title {
          margin-top: 16px;

          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .about-card-text {
          margin-top: 10px;
          max-width: 520px;

          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.45);
        }

        .about-stats {
          margin-top: 64px;

          display: grid;
          grid-template-columns: repeat(3, 1fr);

          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 32px;
        }

        .about-stat {
          padding: 0 28px;
        }

        .about-stat:not(:first-child) {
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        :global(.about-stat-value) {
          font-size: 40px;
          font-weight: 900;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }

        .about-stat-label {
          margin-top: 6px;

          font-size: 11px;
          line-height: 1.5;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        .about-stat-metric {
          margin-top: 18px;
          padding-top: 14px;

          border-top: 1px solid rgba(255, 255, 255, 0.08);

          display: inline-flex;
          align-items: center;
          gap: 5px;

          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: rgba(163, 230, 53, 0.85);
        }

        .metric-arrow {
          font-size: 11px;
          line-height: 1;
        }

        @media (max-width: 1100px) {
          .tech-layer,
          .tech-grid {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .about {
            padding: 100px 20px;
          }

          .about-title {
            font-size: 34px;
          }

          .about-grid {
            grid-template-columns: 1fr;
          }

          .about-card-wide {
            grid-column: auto;
          }

          .about-stats {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .about-stat {
            padding: 0;
          }

          .about-stat:not(:first-child) {
            border-left: none;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 24px;
          }
        }
      `}</style>

    </section>
  );
}