"use client";

import React from "react";
import { motion } from "framer-motion";

interface Tier {
  index: number;
  volume: string;
  totalHeight: number;
  limeRatio: number;
  subtitle: string;
}

const TIERS: Tier[] = [
  {
    index: 1,
    volume: "500+",
    totalHeight: 260,
    limeRatio: 0.5,
    subtitle: "Стандартна ставка + базовий прозвон",
  },
  {
    index: 2,
    volume: "2K+",
    totalHeight: 340,
    limeRatio: 0.52,
    subtitle: "Пріоритет гарячого контакту (до 3 хв)",
  },
  {
    index: 3,
    volume: "5K+",
    totalHeight: 420,
    limeRatio: 0.55,
    subtitle: "Спеціальний % за викуп + кастомні скрипти",
  },
  {
    index: 4,
    volume: "10K+",
    totalHeight: 500,
    limeRatio: 0.57,
    subtitle: "Виділена команда 24/7 + розширений CRM-доступ",
  },
  {
    index: 5,
    volume: "25K+",
    totalHeight: 580,
    limeRatio: 0.6,
    subtitle: "Персональний спред, нуль фіксу, кастомні гео",
  },
];

export default function ScaleTiers() {
  return (
    <section className="st">

      <div className="st-inner">

        <span className="st-label">РІВНІ ОБСЯГУ</span>

        <h2 className="st-title">
          Ваш місячний обсяг визначає пріоритет
        </h2>

        <p className="st-subtitle">
          Чим вищий підтверджений обсяг лідів за місяць, тим більший % апруву,
          нижчий спред та виділена команда closer'ів. Для обсягу від 25K
          діють персональні умови.
        </p>

        <div className="st-bars">
          {TIERS.map((tier) => {
            const limeHeight = Math.round(tier.totalHeight * tier.limeRatio);
            const darkHeight = tier.totalHeight - limeHeight;

            return (
              <motion.div
                key={tier.index}
                className="st-bar"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: tier.index * 0.06 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 30px rgba(163,230,53,0.3)",
                }}
                style={{ height: `${tier.totalHeight}px` }}
              >
                <div
                  className="st-bar-top"
                  style={{ height: `${limeHeight}px` }}
                >
                  <span className="st-bar-num">0{tier.index}</span>
                  <span className="st-bar-volume">{tier.volume}</span>
                </div>

                <div
                  className="st-bar-bottom"
                  style={{ height: `${darkHeight}px` }}
                >
                  <p className="st-bar-subtitle">{tier.subtitle}</p>
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

        .st-bar {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          width: 100%;

          border-radius: 16px;
          overflow: hidden;
          cursor: default;

          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .st-bar-top {
          width: 100%;
          padding: 20px 16px;

          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;

          background: linear-gradient(to top, #84cc16, #bef264);
        }

        .st-bar-num {
          font-family: "Courier New", monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(0, 0, 0, 0.5);
        }

        .st-bar-volume {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #050505;
        }

        .st-bar-bottom {
          width: 100%;
          padding: 16px;

          display: flex;
          align-items: flex-start;

          background: rgba(20, 20, 20, 0.92);
          backdrop-filter: blur(20px);
        }

        .st-bar-subtitle {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.6);
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
          .st-bar-volume {
            font-size: 30px;
          }

          .st-title {
            font-size: 40px;
          }
        }

        @media (max-width: 900px) {
          .st-bars {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .st-bar {
            height: auto !important;
            flex-direction: row;
          }

          .st-bar-top {
            height: auto !important;
            flex-shrink: 0;
            width: 140px;
            align-items: center;
          }

          .st-bar-bottom {
            height: auto !important;
            align-items: center;
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