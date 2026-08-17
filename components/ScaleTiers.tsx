"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Tier {
  index: number;
  volume: string;
  totalHeight: number;
  limeRatio: number;
  label: string;
  subtitle: string;
  delay: number;
}

const TIERS: Tier[] = [
  {
    index: 1,
    volume: "500+",
    totalHeight: 260,
    limeRatio: 0.5,
    label: "ОБСЯГ ЛІДІВ",
    subtitle: "Стандартна ставка + базовий прозвон",
    delay: 0.05,
  },
  {
    index: 2,
    volume: "2K+",
    totalHeight: 340,
    limeRatio: 0.52,
    label: "ОБСЯГ ЛІДІВ",
    subtitle: "Пріоритет гарячого контакту (до 2 хв)",
    delay: 0.15,
  },
  {
    index: 3,
    volume: "5K+",
    totalHeight: 420,
    limeRatio: 0.55,
    label: "ОБСЯГ ЛІДІВ",
    subtitle: "Спеціальний % за викуп + кастомні скрипти",
    delay: 0.25,
  },
  {
    index: 4,
    volume: "10K+",
    totalHeight: 500,
    limeRatio: 0.58,
    label: "ОБСЯГ ЛІДІВ",
    subtitle:
      "Виділена команда 24/7 + розширений CRM-доступ",
    delay: 0.35,
  },
  {
    index: 5,
    volume: "25K+",
    totalHeight: 580,
    limeRatio: 0.62,
    label: "ОБСЯГ ЛІДІВ",
    subtitle: "Персональний спред, нуль фіксу, кастомні гео",
    delay: 0.45,
  },
];

const GROW_DURATION = 1.15;

const EASE: [number, number, number, number] = [
  0.22,
  1,
  0.36,
  1,
];

export default function ScaleTiers() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.18,
  });

  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  return (
    <section ref={sectionRef} id="tiers" className="st">
      <div className="st-inner">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.div
          className="st-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          transition={{
            duration: 0.7,
            ease: EASE,
          }}
        >
          <h2 className="st-title">
            <span className="st-title-muted">
              Ваш місячний обсяг визначає
            </span>{" "}
            <span className="st-title-white">
              пріоритет
            </span>
          </h2>

          <p className="st-subtitle">
            Чим вищий підтверджений обсяг лідів за місяць,
            тим більший % апруву, нижчий спред та виділена
            команда closer&apos;ів. Для обсягу від 25K діють
            персональні умови.
          </p>
        </motion.div>

        {/* =====================================================
            DESKTOP
        ===================================================== */}

        <div className="st-bars st-bars-desktop">
          {TIERS.map((tier) => {
            const isFinal = tier.index === 5;
            const isHovered = hoveredTier === tier.index;
            const anotherTierHovered =
              hoveredTier !== null && !isHovered;

            const limeHeight = Math.round(
              tier.totalHeight * tier.limeRatio
            );

            const darkHeight =
              tier.totalHeight - limeHeight;

            const wrapClass =
              "st-bar-wrap st-tier-" + tier.index;

            const barClass =
              isFinal
                ? "st-bar-bg st-bar-bg-final"
                : "st-bar-bg";

            return (
              <div
                key={tier.index}
                className={wrapClass}
                style={
                  {
                    height: tier.totalHeight + "px",
                    "--tier-delay": tier.delay + "s",
                  } as React.CSSProperties
                }
              >
                {/* FLOOR GLOW */}

                <motion.div
                  className="st-floor-glow"
                  initial={{
                    opacity: 0,
                    scaleX: 0.72,
                    scaleY: 0.72,
                  }}
                  animate={
                    isInView
                      ? {
                          opacity: isHovered
                            ? 0.72
                            : anotherTierHovered
                            ? 0.14
                            : 0.34,
                          scaleX: isHovered ? 1.05 : 1,
                          scaleY: isHovered ? 1.08 : 1,
                        }
                      : {
                          opacity: 0,
                        }
                  }
                  transition={{
                    duration: 0.65,
                    delay: tier.delay + 0.2,
                    ease: EASE,
                  }}
                />

                {/* BAR */}

                <motion.div
                  className={barClass}
                  initial={{
                    height: 0,
                    opacity: 0,
                    y: 0,
                    scaleY: 0.96,
                  }}
                  animate={
                    isInView
                      ? {
                          height: tier.totalHeight,
                          opacity: anotherTierHovered ? 0.72 : 1,
                          y: isHovered
                            ? isFinal
                              ? -10
                              : -8
                            : 0,
                          scaleY: isHovered
                            ? isFinal
                              ? 1.02
                              : 1.015
                            : 1,
                        }
                      : {
                          height: 0,
                          opacity: 0,
                        }
                  }
                  transition={{
                    height: {
                      duration: GROW_DURATION,
                      delay: tier.delay,
                      ease: EASE,
                    },
                    opacity: {
                      duration: 0.35,
                      delay: tier.delay,
                    },
                    y: {
                      duration: 0.38,
                      ease: EASE,
                    },
                    scaleY: {
                      duration: 0.42,
                      ease: EASE,
                    },
                  }}
                  onMouseEnter={() =>
                    setHoveredTier(tier.index)
                  }
                  onMouseLeave={() =>
                    setHoveredTier(null)
                  }
                >
                  {/* INTERNAL LIGHTS */}

                  <div className="st-surface-light st-surface-light-main" />

                  <div className="st-surface-light st-surface-light-secondary" />

                  <div className="st-surface-light st-surface-light-white" />

                  {/* LOCAL SWEEP */}

                  <div className="st-local-sweep" />

                  {/* TOP */}

                  <div
                    className="st-bar-top-fill"
                    style={{
                      height: limeHeight + "px",
                    }}
                  >
                    <span className="st-index">
                      {String(tier.index).padStart(2, "0")}
                    </span>

                    <div className="st-volume-wrap">
                      <span className="st-volume-number">
                        {tier.volume}
                      </span>

                      <span className="st-volume-tag">
                        LEADS / MO
                      </span>
                    </div>

                    <div className="st-top-specular" />

                    <div className="st-top-glass-sheen" />

                    {isFinal && (
                      <div className="st-final-sweep" />
                    )}
                  </div>

                  {/* BOTTOM */}

                  <div
                    className="st-bar-bottom-fill"
                    style={{
                      height: darkHeight + "px",
                    }}
                  >
                    <span className="st-sublabel">
                      {tier.label}
                    </span>

                    <p className="st-subtitle-text">
                      {tier.subtitle}
                    </p>

                    <div className="st-bottom-line" />
                  </div>

                  {/* EDGES */}

                  <div className="st-edge-highlight" />

                  <div className="st-edge-highlight-bottom" />
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            MOBILE
        ===================================================== */}

        <div className="st-bars-mobile">
          {TIERS.map((tier) => {
            const isFinal = tier.index === 5;

            return (
              <motion.div
                key={tier.index}
                className={
                  "st-mcard st-mobile-tier-" + tier.index
                }
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        y: 0,
                      }
                    : {
                        opacity: 0,
                        y: 18,
                      }
                }
                transition={{
                  duration: 0.6,
                  delay: tier.index * 0.07,
                  ease: EASE,
                }}
              >
                <div className="st-mcard-glow" />

                <div className="st-mcard-sweep" />

                <div className="st-mcard-top">
                  <span className="st-index">
                    {String(tier.index).padStart(2, "0")}
                  </span>

                  <div className="st-mcard-value">
                    <span className="st-volume-number">
                      {tier.volume}
                    </span>

                    <span className="st-volume-tag">
                      LEADS / MO
                    </span>
                  </div>

                  {isFinal && (
                    <div className="st-mobile-final-sweep" />
                  )}
                </div>

                <div className="st-mcard-bottom">
                  <span className="st-sublabel">
                    {tier.label}
                  </span>

                  <p className="st-subtitle-text">
                    {tier.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .st {
          position: relative;
          width: 100%;
          background: #000;
          color: #fff;
          padding: 100px 24px 90px;
          overflow: hidden;
        }

        .st::before {
          content: "";
          position: absolute;
          pointer-events: none;
          width: 1100px;
          height: 460px;
          left: 50%;
          bottom: -80px;
          transform: translateX(-50%);
          background: radial-gradient(
            ellipse at center,
            rgba(42, 79, 160, 0.035) 0%,
            rgba(90, 125, 50, 0.018) 34%,
            transparent 72%
          );
          filter: blur(60px);
        }

        .st-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
        }

        .st-heading {
          position: relative;
          z-index: 5;
        }

        .st-title {
          max-width: 700px;
          margin: 0;
          font-family: var(--font-jakarta), sans-serif;
          font-size: 58px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.08;
        }

        .st-title-muted {
          color: #6b6b6b;
        }

        .st-title-white {
          color: #fff;
          font-weight: 800;
        }

        .st-subtitle {
          margin-top: 20px;
          max-width: 640px;
          font-family: var(--font-jakarta), sans-serif;
          font-size: 17px;
          font-weight: 500;
          line-height: 1.6;
          color: #a3a3a3;
        }

        .st-bars {
          position: relative;
          margin-top: 68px;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          align-items: flex-end;
          gap: 14px;
        }

        .st-bar-wrap {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          isolation: isolate;
        }

        /* =====================================================
           LOCAL FLOOR LIGHT
        ===================================================== */

        .st-floor-glow {
          position: absolute;
          left: 8%;
          bottom: -24px;
          width: 84%;
          height: 80px;
          border-radius: 50%;
          pointer-events: none;
          z-index: -2;
          filter: blur(32px);
          background: radial-gradient(
            ellipse at center,
            rgba(32, 70, 190, 0.12) 0%,
            rgba(19, 48, 140, 0.04) 30%,
            transparent 72%
          );
          will-change: transform, opacity;
        }

        .st-tier-1 .st-floor-glow {
          background: radial-gradient(
            ellipse at center,
            rgba(35, 76, 210, 0.16) 0%,
            rgba(15, 45, 150, 0.045) 34%,
            transparent 72%
          );
        }

        .st-tier-2 .st-floor-glow {
          background: radial-gradient(
            ellipse at center,
            rgba(34, 78, 228, 0.16) 0%,
            rgba(18, 50, 150, 0.045) 35%,
            transparent 72%
          );
        }

        .st-tier-3 .st-floor-glow {
          background: radial-gradient(
            ellipse at center,
            rgba(133, 189, 36, 0.18) 0%,
            rgba(77, 122, 18, 0.045) 36%,
            transparent 74%
          );
        }

        .st-tier-4 .st-floor-glow {
          background: radial-gradient(
            ellipse at center,
            rgba(31, 75, 220, 0.1) 0%,
            rgba(128, 184, 46, 0.1) 32%,
            transparent 74%
          );
        }

        .st-tier-5 .st-floor-glow {
          left: 5%;
          width: 90%;
          background: radial-gradient(
            ellipse at center,
            rgba(140, 194, 48, 0.17) 0%,
            rgba(48, 74, 180, 0.045) 38%,
            transparent 74%
          );
          filter: blur(35px);
        }

        /* =====================================================
           CARD
        ===================================================== */

        .st-bar-bg {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 17px;
          background: linear-gradient(
            145deg,
            #030405 0%,
            #0b0f13 43%,
            #020304 100%
          );
          border: 1px solid rgba(190, 214, 225, 0.15);
          box-shadow:
            0 22px 60px rgba(0, 0, 0, 0.7),
            0 9px 24px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.085),
            inset 0 -1px 0 rgba(255, 255, 255, 0.022);
          transform-origin: bottom center;
          will-change: transform, height, opacity;
          transition:
            border-color 0.35s ease,
            box-shadow 0.35s ease;
        }

        .st-bar-bg:hover {
          border-color: rgba(231, 244, 248, 0.31);
          box-shadow:
            0 34px 82px rgba(0, 0, 0, 0.78),
            0 14px 32px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(50, 95, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }

        /* =====================================================
           INTERNAL LIGHTS
        ===================================================== */

        .st-surface-light {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          mix-blend-mode: screen;
          z-index: 2;
          will-change: transform;
        }

        .st-surface-light-main {
          width: 185%;
          height: 70%;
          left: -44%;
          bottom: -18%;
          background: radial-gradient(
            ellipse at center,
            rgba(40, 90, 255, 0.13) 0%,
            rgba(24, 57, 185, 0.045) 34%,
            transparent 74%
          );
          filter: blur(36px);
          animation: tierSmokeA 17s ease-in-out infinite;
          animation-delay: calc(var(--tier-delay) * -3);
        }

        .st-surface-light-secondary {
          width: 145%;
          height: 82%;
          right: -52%;
          top: 15%;
          background: radial-gradient(
            ellipse at center,
            rgba(130, 205, 45, 0.07) 0%,
            rgba(94, 154, 32, 0.02) 40%,
            transparent 74%
          );
          filter: blur(36px);
          animation: tierSmokeB 21s ease-in-out infinite;
          animation-delay: calc(var(--tier-delay) * -4);
        }

        .st-surface-light-white {
          width: 165%;
          height: 58%;
          top: -19%;
          right: -55%;
          background: radial-gradient(
            ellipse at center,
            rgba(246, 250, 253, 0.13) 0%,
            rgba(219, 230, 237, 0.035) 32%,
            transparent 72%
          );
          filter: blur(28px);
          animation: tierChrome 19s ease-in-out infinite;
          animation-delay: calc(var(--tier-delay) * -2);
        }

        /* =====================================================
           LOCAL SWEEP
        ===================================================== */

        .st-local-sweep {
          position: absolute;
          top: -45%;
          left: -70%;
          width: 38%;
          height: 190%;
          pointer-events: none;
          z-index: 11;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.012) 28%,
            rgba(255, 255, 255, 0.068) 50%,
            rgba(255, 255, 255, 0.012) 72%,
            transparent 100%
          );
          filter: blur(7px);
          transform: rotate(12deg);
          opacity: 0.42;
          animation:
            localSweep
            var(--sweep-duration, 13s)
            cubic-bezier(0.22, 1, 0.36, 1)
            var(--sweep-delay, 0s)
            infinite;
        }

        .st-tier-1 {
          --sweep-duration: 12s;
          --sweep-delay: -2s;
        }

        .st-tier-2 {
          --sweep-duration: 15s;
          --sweep-delay: -7s;
        }

        .st-tier-3 {
          --sweep-duration: 17s;
          --sweep-delay: -11s;
        }

        .st-tier-4 {
          --sweep-duration: 13s;
          --sweep-delay: -5s;
        }

        .st-tier-5 {
          --sweep-duration: 18s;
          --sweep-delay: -14s;
        }

        /* =====================================================
           TOP
        ===================================================== */

        .st-bar-top-fill {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 3;
          background: linear-gradient(
            145deg,
            rgba(15, 24, 40, 0.96) 0%,
            rgba(4, 8, 15, 0.98) 50%,
            rgba(2, 4, 8, 0.99) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.055);
        }

        .st-top-specular {
          position: absolute;
          width: 155%;
          height: 84%;
          left: -26%;
          top: -37%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.125) 0%,
            rgba(255, 255, 255, 0.032) 28%,
            transparent 70%
          );
          filter: blur(19px);
          transform: rotate(-12deg);
          pointer-events: none;
          animation: topReflection 14s ease-in-out infinite;
          animation-delay: calc(var(--tier-delay) * -5);
        }

        .st-top-glass-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            112deg,
            transparent 0%,
            transparent 38%,
            rgba(255, 255, 255, 0.025) 48%,
            transparent 58%,
            transparent 100%
          );
          opacity: 0.8;
          pointer-events: none;
        }

        .st-final-sweep {
          position: absolute;
          top: -35%;
          left: -75%;
          width: 42%;
          height: 170%;
          z-index: 12;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(240, 255, 220, 0.02) 28%,
            rgba(255, 255, 255, 0.12) 50%,
            rgba(180, 235, 95, 0.035) 68%,
            transparent
          );
          filter: blur(9px);
          transform: rotate(11deg);
          opacity: 0;
          animation:
            finalSweep
            1.35s
            cubic-bezier(0.16, 1, 0.3, 1)
            0.85s
            1;
        }

        /* =====================================================
           INDEX
        ===================================================== */

        .st-index {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 20;
          font-family: "Courier New", monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(235, 245, 252, 0.4);
        }

        /* =====================================================
           NUMBER
        ===================================================== */

        .st-volume-wrap {
          position: relative;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          transform: translateY(2px);
        }

        .st-volume-number {
          font-family:
            var(--font-jakarta),
            sans-serif;
          font-size: 2.65rem;
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 0.95;
          color: #edf4f7;
          text-align: center;
          text-shadow:
            0 1px 1px rgba(255, 255, 255, 0.13),
            0 8px 22px rgba(0, 0, 0, 0.48);
          transition:
            transform 0.35s ease,
            color 0.35s ease,
            text-shadow 0.35s ease;
        }

        .st-bar-bg:hover .st-volume-number {
          transform: scale(1.025);
        }

        .st-volume-tag {
          font-family: "Courier New", monospace;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: rgba(210, 223, 231, 0.26);
        }

        /* =====================================================
           BOTTOM
        ===================================================== */

        .st-bar-bottom-fill {
          position: relative;
          z-index: 4;
          width: 100%;
          padding: 18px 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: linear-gradient(
            145deg,
            #07090b 0%,
            #10151a 47%,
            #050708 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.028);
        }

        .st-sublabel {
          font-family: "Courier New", monospace;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.11em;
          color: rgba(214, 229, 236, 0.34);
        }

        .st-subtitle-text {
          margin: 0;
          font-family:
            var(--font-jakarta),
            sans-serif;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.48;
          color: rgba(236, 243, 247, 0.68);
          text-align: left;
        }

        .st-bottom-line {
          width: 100%;
          height: 1px;
          margin-top: auto;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.07) 50%,
            transparent 100%
          );
          opacity: 0.52;
        }

        /* =====================================================
           EDGES
        ===================================================== */

        .st-edge-highlight {
          position: absolute;
          inset: 0;
          z-index: 14;
          pointer-events: none;
          border-radius: inherit;
          box-shadow:
            inset 0 0 0 1px
              rgba(255, 255, 255, 0.018);
          background: radial-gradient(
            ellipse 72% 52% at 90% 5%,
            rgba(245, 250, 253, 0.065) 0%,
            transparent 60%
          );
        }

        .st-edge-highlight-bottom {
          position: absolute;
          left: 10%;
          bottom: 1px;
          width: 80%;
          height: 1px;
          z-index: 14;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 20%,
            rgba(255, 255, 255, 0.11) 50%,
            rgba(255, 255, 255, 0.04) 80%,
            transparent 100%
          );
          filter: blur(0.3px);
        }

        /* =====================================================
           TIER 1
        ===================================================== */

        .st-tier-1 .st-bar-bg {
          background: linear-gradient(
            145deg,
            #02050a 0%,
            #08152b 50%,
            #030508 100%
          );
          border-color: rgba(76, 116, 190, 0.2);
        }

        .st-tier-1 .st-bar-top-fill {
          background:
            radial-gradient(
              ellipse 58% 62% at 82% 18%,
              rgba(220, 232, 241, 0.08) 0%,
              transparent 67%
            ),
            linear-gradient(
              145deg,
              #091630 0%,
              #050b16 50%,
              #020407 100%
            );
        }

        .st-tier-1 .st-surface-light-main {
          background: radial-gradient(
            ellipse at center,
            rgba(32, 79, 255, 0.21) 0%,
            rgba(22, 52, 190, 0.055) 42%,
            transparent 74%
          );
        }

        /* =====================================================
           TIER 2
        ===================================================== */

        .st-tier-2 .st-bar-bg {
          background: linear-gradient(
            145deg,
            #030506 0%,
            #0c1219 49%,
            #020305 100%
          );
          border-color: rgba(130, 161, 186, 0.21);
        }

        .st-tier-2 .st-bar-top-fill {
          background:
            radial-gradient(
              ellipse 80% 60% at 18% 10%,
              rgba(236, 244, 248, 0.1) 0%,
              transparent 63%
            ),
            linear-gradient(
              145deg,
              #10203a 0%,
              #060b14 47%,
              #020407 100%
            );
        }

        .st-tier-2 .st-surface-light-main {
          background: radial-gradient(
            ellipse at center,
            rgba(37, 91, 255, 0.19) 0%,
            rgba(23, 57, 180, 0.045) 44%,
            transparent 74%
          );
        }

        .st-tier-2 .st-surface-light-secondary {
          background: radial-gradient(
            ellipse at center,
            rgba(220, 231, 238, 0.065) 0%,
            transparent 72%
          );
        }

        /* =====================================================
           TIER 3
        ===================================================== */

        .st-tier-3 .st-bar-bg {
          background: linear-gradient(
            145deg,
            #040703 0%,
            #0a1106 45%,
            #020402 100%
          );
          border-color: rgba(142, 188, 55, 0.25);
        }

        .st-tier-3 .st-bar-top-fill {
          background:
            radial-gradient(
              ellipse 68% 62% at 77% 19%,
              rgba(198, 243, 105, 0.14) 0%,
              transparent 65%
            ),
            linear-gradient(
              145deg,
              #172f0b 0%,
              #071106 46%,
              #020503 100%
            );
        }

        .st-tier-3 .st-surface-light-main {
          background: radial-gradient(
            ellipse at center,
            rgba(173, 240, 56, 0.27) 0%,
            rgba(119, 181, 31, 0.07) 44%,
            transparent 74%
          );
        }

        .st-tier-3 .st-surface-light-secondary {
          opacity: 0.55;
          background: radial-gradient(
            ellipse at center,
            rgba(205, 239, 120, 0.055) 0%,
            transparent 72%
          );
        }

        .st-tier-3 .st-volume-number {
          color: #f0ffd4;
          text-shadow:
            0 0 24px rgba(164, 233, 53, 0.16),
            0 8px 22px rgba(0, 0, 0, 0.5);
        }

        /* =====================================================
           TIER 4
        ===================================================== */

        .st-tier-4 .st-bar-bg {
          background: linear-gradient(
            145deg,
            #020508 0%,
            #08100d 42%,
            #040712 75%,
            #020304 100%
          );
          border-color: rgba(111, 157, 169, 0.22);
        }

        .st-tier-4 .st-bar-top-fill {
          background:
            radial-gradient(
              ellipse 48% 72% at 79% 28%,
              rgba(153, 225, 58, 0.15) 0%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 55% 66% at 19% 10%,
              rgba(44, 87, 255, 0.14) 0%,
              transparent 68%
            ),
            linear-gradient(
              145deg,
              #0a1528 0%,
              #071109 46%,
              #030407 100%
            );
        }

        .st-tier-4 .st-surface-light-main {
          background: radial-gradient(
            ellipse at center,
            rgba(33, 84, 255, 0.2) 0%,
            rgba(21, 52, 170, 0.045) 42%,
            transparent 74%
          );
        }

        .st-tier-4 .st-surface-light-secondary {
          background: radial-gradient(
            ellipse at center,
            rgba(156, 226, 57, 0.13) 0%,
            rgba(105, 166, 33, 0.032) 42%,
            transparent 74%
          );
        }

        /* =====================================================
           TIER 5
        ===================================================== */

        .st-tier-5 .st-bar-bg {
          background: linear-gradient(
            145deg,
            #080a0b 0%,
            #14191c 27%,
            #090c0d 58%,
            #030504 100%
          );
          border-color: rgba(202, 220, 224, 0.26);
          box-shadow:
            0 28px 76px rgba(0, 0, 0, 0.72),
            0 12px 28px rgba(0, 0, 0, 0.45),
            0 0 36px rgba(125, 175, 47, 0.045),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .st-tier-5 .st-bar-top-fill {
          background:
            radial-gradient(
              ellipse 72% 60% at 80% 12%,
              rgba(247, 251, 253, 0.17) 0%,
              rgba(219, 231, 237, 0.045) 31%,
              transparent 67%
            ),
            radial-gradient(
              ellipse 65% 70% at 15% 90%,
              rgba(157, 226, 61, 0.12) 0%,
              rgba(98, 159, 35, 0.03) 45%,
              transparent 74%
            ),
            linear-gradient(
              145deg,
              #172123 0%,
              #0c1314 39%,
              #040606 100%
            );
        }

        .st-tier-5 .st-surface-light-main {
          background: radial-gradient(
            ellipse at center,
            rgba(178, 233, 69, 0.18) 0%,
            rgba(108, 171, 37, 0.04) 42%,
            transparent 74%
          );
        }

        .st-tier-5 .st-surface-light-white {
          opacity: 1.05;
          background: radial-gradient(
            ellipse at center,
            rgba(250, 253, 255, 0.2) 0%,
            rgba(221, 234, 240, 0.055) 34%,
            transparent 72%
          );
        }

        .st-tier-5 .st-volume-number {
          color: #f0f7f8;
          text-shadow:
            0 0 20px rgba(194, 232, 82, 0.1),
            0 8px 23px rgba(0, 0, 0, 0.5);
        }

        /* =====================================================
           KEYFRAMES
        ===================================================== */

        @keyframes tierSmokeA {
          0% {
            transform:
              translate3d(-10px, 3px, 0)
              scale(1);
          }

          24% {
            transform:
              translate3d(15px, -9px, 0)
              scale(1.06);
          }

          50% {
            transform:
              translate3d(28px, 9px, 0)
              scale(1.11);
          }

          76% {
            transform:
              translate3d(-3px, -12px, 0)
              scale(1.045);
          }

          100% {
            transform:
              translate3d(-10px, 3px, 0)
              scale(1);
          }
        }

        @keyframes tierSmokeB {
          0% {
            transform:
              translate3d(4px, 0, 0)
              rotate(-4deg)
              scale(1);
          }

          31% {
            transform:
              translate3d(-16px, -8px, 0)
              rotate(4deg)
              scale(1.06);
          }

          63% {
            transform:
              translate3d(-8px, 14px, 0)
              rotate(-6deg)
              scale(1.1);
          }

          100% {
            transform:
              translate3d(4px, 0, 0)
              rotate(-4deg)
              scale(1);
          }
        }

        @keyframes tierChrome {
          0% {
            transform:
              translate3d(0, 0, 0)
              rotate(-12deg)
              scale(1);
          }

          34% {
            transform:
              translate3d(-13px, 7px, 0)
              rotate(-8deg)
              scale(1.04);
          }

          68% {
            transform:
              translate3d(13px, 13px, 0)
              rotate(-17deg)
              scale(1.07);
          }

          100% {
            transform:
              translate3d(0, 0, 0)
              rotate(-12deg)
              scale(1);
          }
        }

        @keyframes topReflection {
          0% {
            transform:
              translate3d(0, 0, 0)
              rotate(-12deg)
              scale(1);
          }

          50% {
            transform:
              translate3d(20px, 7px, 0)
              rotate(-8deg)
              scale(1.06);
          }

          100% {
            transform:
              translate3d(0, 0, 0)
              rotate(-12deg)
              scale(1);
          }
        }

        @keyframes localSweep {
          0% {
            transform:
              translate3d(-55%, 0, 0)
              rotate(12deg);
            opacity: 0;
          }

          12% {
            opacity: 0.06;
          }

          42% {
            opacity: 0.5;
          }

          62% {
            opacity: 0.22;
          }

          100% {
            transform:
              translate3d(330%, 0, 0)
              rotate(12deg);
            opacity: 0;
          }
        }

        @keyframes finalSweep {
          0% {
            left: -80%;
            opacity: 0;
          }

          18% {
            opacity: 0.1;
          }

          48% {
            opacity: 0.78;
          }

          74% {
            opacity: 0.22;
          }

          100% {
            left: 150%;
            opacity: 0;
          }
        }

        @keyframes mobileSweep {
          0% {
            left: -65%;
          }

          46% {
            left: 125%;
          }

          100% {
            left: 125%;
          }
        }

        @keyframes finalSweepMobile {
          0% {
            left: -40%;
            opacity: 0;
          }

          25% {
            opacity: 0.15;
          }

          52% {
            opacity: 0.65;
          }

          100% {
            left: 145%;
            opacity: 0;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        .st-bars-mobile {
          display: none;
        }

        @media (max-width: 1300px) {
          .st-title {
            font-size: 48px;
          }

          .st-volume-number {
            font-size: 2.3rem;
          }
        }

        @media (max-width: 1024px) {
          .st-title {
            font-size: 40px;
          }

          .st-bars {
            gap: 10px;
          }

          .st-volume-number {
            font-size: 1.95rem;
          }

          .st-subtitle-text {
            font-size: 11px;
          }
        }

        @media (max-width: 900px) {
          .st-bars-desktop {
            display: none;
          }

          .st-bars-mobile {
            display: flex;
            flex-direction: column;
            gap: 14px;
            margin-top: 56px;
          }

          .st-mcard {
            position: relative;
            overflow: hidden;
            border-radius: 18px;
            border: 1px solid rgba(180, 210, 230, 0.17);
            background: linear-gradient(
              145deg,
              #030405 0%,
              #0b1015 50%,
              #020304 100%
            );
            box-shadow:
              0 20px 50px rgba(0, 0, 0, 0.62),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
          }

          .st-mcard-glow {
            position: absolute;
            pointer-events: none;
            width: 85%;
            height: 90%;
            right: -20%;
            bottom: -30%;
            border-radius: 50%;
            filter: blur(38px);
            opacity: 0.68;
            background: radial-gradient(
              ellipse at center,
              rgba(45, 90, 255, 0.16) 0%,
              transparent 70%
            );
          }

          .st-mcard-sweep {
            position: absolute;
            top: -50%;
            left: -60%;
            width: 42%;
            height: 190%;
            pointer-events: none;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.055) 50%,
              transparent 100%
            );
            filter: blur(8px);
            transform: rotate(12deg);
            opacity: 0.35;
            animation:
              mobileSweep
              11s
              ease-in-out
              infinite;
          }

          .st-mcard-top {
            position: relative;
            min-height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: linear-gradient(
              145deg,
              #09111f 0%,
              #04080e 50%,
              #020304 100%
            );
          }

          .st-mcard-value {
            position: relative;
            z-index: 3;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          .st-mcard-bottom {
            position: relative;
            z-index: 3;
            padding: 20px 18px 22px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            background: linear-gradient(
              145deg,
              #090c0f 0%,
              #11161a 55%,
              #050708 100%
            );
          }

          .st-mobile-tier-3 {
            border-color: rgba(
              150,
              215,
              55,
              0.27
            );
          }

          .st-mobile-tier-3 .st-mcard-glow {
            background: radial-gradient(
              ellipse at center,
              rgba(165, 235, 55, 0.19) 0%,
              transparent 70%
            );
          }

          .st-mobile-tier-4 .st-mcard-glow {
            background: radial-gradient(
              ellipse at center,
              rgba(36, 83, 255, 0.15) 0%,
              rgba(146, 216, 55, 0.09) 40%,
              transparent 70%
            );
          }

          .st-mobile-tier-5 {
            border-color: rgba(
              205,
              225,
              230,
              0.24
            );
          }

          .st-mobile-tier-5 .st-mcard-glow {
            background: radial-gradient(
              ellipse at center,
              rgba(160, 230, 60, 0.18) 0%,
              rgba(65, 105, 255, 0.08) 40%,
              transparent 72%
            );
          }

          .st-mobile-final-sweep {
            position: absolute;
            top: -40%;
            left: -40%;
            width: 32%;
            height: 180%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.1),
              transparent
            );
            filter: blur(8px);
            transform: rotate(10deg);
            animation:
              finalSweepMobile
              1.25s
              ease
              0.7s
              1;
            opacity: 0;
          }
        }

        @media (max-width: 640px) {
          .st {
            padding: 80px 16px 70px;
          }

          .st-title {
            font-size: 32px;
          }

          .st-subtitle {
            font-size: 15px;
          }

          .st-mcard-top {
            min-height: 130px;
          }

          .st-volume-number {
            font-size: 2.35rem;
          }

          .st-subtitle-text {
            font-size: 12px;
          }
        }

        @media (hover: none) {
          .st-bar-bg:hover {
            border-color: rgba(
              190,
              214,
              225,
              0.15
            );

            box-shadow:
              0 22px 60px rgba(0, 0, 0, 0.7),
              0 9px 24px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.085),
              inset 0 -1px 0 rgba(255, 255, 255, 0.022);
          }

          .st-bar-bg:hover .st-volume-number {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .st-surface-light-main,
          .st-surface-light-secondary,
          .st-surface-light-white,
          .st-top-specular,
          .st-local-sweep,
          .st-final-sweep,
          .st-mcard-sweep,
          .st-mobile-final-sweep {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}