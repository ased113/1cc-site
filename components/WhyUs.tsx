"use client";

import React from "react";
import { motion } from "framer-motion";

const FEATURES = [
  "Адаптація під GEO та вертикаль",
  "Speed to Lead",
  "Гнучкі умови під обсяг",
  "Контроль closer'ів",
  "Прозора аналітика",
  "Готовність до масштабування",
];

const EASE = [0.16, 1, 0.3, 1] as const;

function Check() {
  return (
    <span className="check">
      <svg viewBox="0 0 12 12" width="9" height="9" fill="none">
        <path
          d="M2.2 6.05 4.7 8.45 9.7 3.55"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Cross() {
  return <span className="cross">×</span>;
}

export default function WhyUs() {
  return (
    <section id="why-1cc" className="why-section">
      <div className="why-container">
        <motion.div
          className="why-panel"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* ============ HEADER — title left, two short paragraphs right ============ */}
          <div className="panel-header">
            <motion.div
              className="title-block"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <h2>
                <span className="title-muted">Чому саме</span>
                <span className="title-white">1CC?</span>
              </h2>
            </motion.div>

            <motion.div
              className="header-copy"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
            >
              <p>
                Більшість call-центрів працюють за одним сценарієм: одна
                логіка обробки, одна схема контролю та однаковий сервіс
                для всіх.
              </p>
              <p>
                <strong>1CC — це не конвеєр.</strong> Ми адаптуємо процес
                під ваш GEO, вертикаль та обсяг, щоб швидше забирати
                апрув і не втрачати гроші на етапі обробки.
              </p>
            </motion.div>
          </div>

          {/* ============ COMPARISON TABLE — one strict grid for header + every row,
              so the check/cross always sit exactly under "1CC" / "Other",
              never inline with the feature text. ============ */}
          <div className="comparison">
            <div className="comparison-row comparison-header">
              <div className="col-feature header-label">Feature</div>
              <div className="col-mark header-label header-brand">1CC</div>
              <div className="col-mark header-label">Other</div>
            </div>

            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature}
                className="comparison-row comparison-feature"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.42, delay: 0.12 + index * 0.05, ease: EASE }}
              >
                <div className="col-feature feature-name">{feature}</div>
                <div className="col-mark">
                  <Check />
                </div>
                <div className="col-mark">
                  <Cross />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Plain <style> tag on purpose — NOT <style jsx>. In this project's
          dev environment, styled-jsx's class-hash + head-injection pipeline
          was silently failing for this component (the jsx-* class showed up
          on the element, but the matching <style> never landed in <head>,
          so zero rules ever applied). A plain <style> tag needs no special
          build-time injection — it's just a normal DOM node React renders
          inline, so it always works. Selectors are scoped under
          .why-section so it won't leak if this file is ever duplicated. */}
      <style>{`
        .why-section {
          position: relative;
          width: 100%;
          padding: 160px 24px 140px;
          background: #000;
        }

        .why-section .why-container {
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
        }

        .why-section .why-panel {
          width: 100%;
          padding: 60px 64px 24px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #0a0a0a;
        }

        .why-section .panel-header {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          column-gap: 80px;
          margin-bottom: 56px;
        }

        .why-section .title-block h2 {
          display: flex;
          flex-direction: column;
          margin: 0;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: clamp(38px, 4vw, 54px);
          font-weight: 800;
          letter-spacing: -0.015em;
          line-height: 1.06;
        }

        .why-section .title-muted {
          color: rgba(255, 255, 255, 0.4);
        }

        .why-section .title-white {
          margin-top: 2px;
          color: #ffffff;
        }

        .why-section .header-copy {
          max-width: 520px;
          padding-top: 6px;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 14px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.46);
        }

        .why-section .header-copy p {
          margin: 0;
        }

        .why-section .header-copy p + p {
          margin-top: 18px;
        }

        .why-section .header-copy strong {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 700;
        }

        .why-section .comparison {
          width: 100%;
        }

        .why-section .comparison-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 100px 100px;
          align-items: center;
        }

        .why-section .col-feature {
          min-width: 0;
        }

        .why-section .col-mark {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .why-section .comparison-header {
          padding-bottom: 16px;
        }

        .why-section .header-label {
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.35);
        }

        .why-section .header-brand {
          font-weight: 700;
          color: rgba(255, 255, 255, 0.85);
        }

        .why-section .comparison-feature {
          min-height: 64px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          transition: background 0.22s ease;
          cursor: default;
        }

        .why-section .comparison-feature:hover {
          background: rgba(255, 255, 255, 0.035);
        }

        .why-section .comparison-feature:hover .feature-name {
          color: #ffffff;
        }

        .why-section .feature-name {
          padding: 14px 24px 14px 0;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.92);
          transition: color 0.22s ease;
        }

        .why-section .check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f1f1f1;
          color: #111;
        }

        .why-section .cross {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          font-family: Arial, sans-serif;
          font-size: 16px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.32);
        }

        @media (max-width: 1050px) {
          .why-section .why-panel {
            padding: 48px 40px 20px;
          }

          .why-section .panel-header {
            column-gap: 48px;
          }

          .why-section .comparison-row {
            grid-template-columns: minmax(0, 1fr) 80px 80px;
          }
        }

        @media (max-width: 800px) {
          .why-section {
            padding: 140px 16px 90px;
          }

          .why-section .why-panel {
            padding: 36px 24px 16px;
          }

          .why-section .panel-header {
            display: flex;
            flex-direction: column;
            gap: 24px;
            margin-bottom: 40px;
          }

          .why-section .header-copy {
            max-width: none;
            padding-top: 0;
          }

          .why-section .comparison-row {
            grid-template-columns: minmax(0, 1fr) 60px 60px;
          }

          .why-section .feature-name {
            font-size: 13px;
            padding-right: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .why-section * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}