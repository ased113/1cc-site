"use client";

import React from "react";
import { motion } from "framer-motion";

interface Tier {
  index: number;
  volume: string;
  totalHeight: number;
  limeRatio: number;
  subtitle: string;
  delay: number;
}

const TIERS: Tier[] = [
  {
    index: 1,
    volume: "500+",
    totalHeight: 260,
    limeRatio: 0.5,
    subtitle: "Стандартна ставка + базовий прозвон",
    delay: 0.1,
  },
  {
    index: 2,
    volume: "2K+",
    totalHeight: 340,
    limeRatio: 0.52,
    subtitle: "Пріоритет гарячого контакту (до 3 хв)",
    delay: 0.2,
  },
  {
    index: 3,
    volume: "5K+",
    totalHeight: 420,
    limeRatio: 0.55,
    subtitle: "Спеціальний % за викуп + кастомні скрипти",
    delay: 0.3,
  },
  {
    index: 4,
    volume: "10K+",
    totalHeight: 500,
    limeRatio: 0.57,
    subtitle: "Виділена команда 24/7 + розширений CRM-доступ",
    delay: 0.4,
  },
  {
    index: 5,
    volume: "25K+",
    totalHeight: 580,
    limeRatio: 0.6,
    subtitle: "Персональний спред, нуль фіксу, кастомні гео",
    delay: 0.5,
  },
];

const GROW_DURATION = 0.8;

export default function ScaleTiers() {
  return (
    <section id="tiers" className="st">

      <div className="st-inner">

        <span className="st-label">РІВНІ ОБСЯГУ</span>

        <h2 className="st-title">
          Ваш місячний обсяг визначає пріоритет
        </h2>

        <p className="st-subtitle">
          Що вищий підтверджений обсяг лідів за місяць, то більший % апруву,
          нижчий спред та виділена команда closer'ів. Для обсягу від 25K
          діють персональні умови.
        </p>

        {/* DESKTOP — animated growth bars */}
        <div className="st-bars st-bars-desktop">
          {TIERS.map((tier) => {
            const limeHeight = Math.round(tier.totalHeight * tier.limeRatio);
            const darkHeight = tier.totalHeight - limeHeight;
            const contentDelay = tier.delay + GROW_DURATION;

            return (
              <div
                key={tier.index}
                className="st-bar-wrap"
                style={{ height: `${tier.totalHeight}px` }}
              >
                <motion.div
                  className="st-bar-bg"
                  initial={{ height: 0 }}
                  whileInView={{ height: tier.totalHeight }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{
                    duration: GROW_DURATION,
                    delay: tier.delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ boxShadow: "0 0 30px rgba(163,230,53,0.3)" }}
                >
                  <div className="st-bar-top-fill" style={{ height: `${limeHeight}px` }} />
                  <div className="st-bar-bottom-fill" style={{ height: `${darkHeight}px` }} />
                </motion.div>

                <div className="st-bar-content" style={{ height: `${tier.totalHeight}px` }}>
                  <div className="st-content-top" style={{ height: `${limeHeight}px` }}>
                    <motion.span
                      className="st-index"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.35, delay: contentDelay }}
                    >
                      0{tier.index}
                    </motion.span>
                    <motion.span
                      className="st-volume"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.35, delay: contentDelay + 0.05 }}
                    >
                      {tier.volume}
                    </motion.span>
                  </div>

                  <div className="st-content-bottom" style={{ height: `${darkHeight}px` }}>
                    <motion.p
                      className="st-subtitle-text"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.35, delay: contentDelay + 0.1 }}
                    >
                      {tier.subtitle}
                    </motion.p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE — simple cards, no height animation */}
        <div className="st-bars-mobile">
          {TIERS.map((tier) => (
            <motion.div
              key={tier.index}
              className="st-mcard"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: tier.index * 0.06 }}
            >
              <div className="st-mcard-top">
                <span className="st-mcard-index">0{tier.index}</span>
                <span className="st-mcard-volume">{tier.volume}</span>
              </div>
              <div className="st-mcard-bottom">
                <p>{tier.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <style jsx>{`
        .st {
          position: relative;
          width: 100%;
          background: #050505;
          color: #fff;
          padding: 100px 24px 80px;
          overflow: hidden;
        }

        .st-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
        }

        .st-label {
          display: block;
          margin-bottom: 12px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #a3e635;
        }

        .st-title {
          max-width: 700px;
          font-family: var(--font-jakarta), sans-serif;
          font-size: 58px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.08;
          color: #ffffff;
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
          margin-top: 56px;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          align-items: end;
          gap: 18px;
        }

        .st-bar-wrap {
          position: relative;
          width: 100%;
        }

        .st-bar-bg {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column-reverse;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .st-bar-top-fill {
          width: 100%;
          background: linear-gradient(to top, #84cc16, #bef264);
        }

        .st-bar-bottom-fill {
          width: 100%;
          background: rgba(20, 20, 20, 0.92);
          backdrop-filter: blur(20px);
        }

        .st-bar-content {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          pointer-events: none;
        }

        .st-content-top {
          width: 100%;
          padding: 20px 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .st-index {
          position: absolute;
          top: 16px;
          right: 16px;
          font-family: "Courier New", monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(0, 0, 0, 0.4);
        }

        .st-volume {
          margin-top: auto;
          font-family: var(--font-jakarta), sans-serif;
          font-size: 44px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1;
          color: #050505;
        }

        .st-content-bottom {
          width: 100%;
          padding: 16px;
          display: flex;
          align-items: flex-start;
        }

        .st-subtitle-text {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.65);
          text-align: left;
        }

        .st-bars-mobile {
          display: none;
        }

        @media (max-width: 1300px) {
          .st-inner {
            max-width: 100%;
          }
          .st-title {
            font-size: 48px;
          }
        }

        @media (max-width: 1024px) {
          .st-volume {
            font-size: 34px;
          }
          .st-title {
            font-size: 40px;
          }
        }

        @media (max-width: 900px) {
          .st-bars-desktop {
            display: none;
          }

          .st-bars-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 56px;
          }

          .st-mcard {
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .st-mcard-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 20px;
            background: linear-gradient(to right, #84cc16, #bef264);
          }

          .st-mcard-index {
            font-family: "Courier New", monospace;
            font-size: 12px;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.45);
          }

          .st-mcard-volume {
            font-family: var(--font-jakarta), sans-serif;
            font-size: 30px;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: #050505;
          }

          .st-mcard-bottom {
            padding: 14px 20px;
            background: rgba(20, 20, 20, 0.92);
          }

          .st-mcard-bottom p {
            font-size: 13px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.65);
          }
        }

        @media (max-width: 640px) {
          .st {
            padding: 90px 16px;
          }
          .st-title {
            font-size: 32px;
          }
        }
      `}</style>

    </section>
  );
}