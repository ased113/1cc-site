"use client";

import React from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const JOIN_US = [
  { label: "Instagram", href: "https://www.instagram.com/1chancecc/" },
  { label: "Telegram", href: "https://t.me/onechancecc" },
  { label: "Support", href: "https://t.me/onechanceg" },
];
const PRODUCT = ["Send Feedback", "Blog", "Terms of use", "Privacy Policy"];

export default function Footer() {
  return (
    <section id="contact" className="footer-section">
      {/* soft blue glow pooling toward the bottom of the page */}
      <div className="footer-glow" aria-hidden="true" />

      <div className="footer-container">
        {/* ============ FINAL CTA ============ */}
        <motion.h2
          className="footer-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="title-white">Готові побачити</span>
          <span className="title-muted">результат у цифрах?</span>
        </motion.h2>

        <motion.p
          className="footer-subtext"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          Команди, які вже довірили нам обробку лідів, бачать результат
          не в презентації, а в цифрах.
        </motion.p>

        <motion.div
          className="footer-cta"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
        >
          <a
            href="https://t.me/onechanceg"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-btn"
          >
            Залишити заявку
          </a>
        </motion.div>

        {/* ============ DIVIDER — a line, "1CC" in the middle, a line ============ */}
        <div className="footer-divider">
          <span className="divider-line" />
          <span className="divider-mark">1CC</span>
          <span className="divider-line" />
        </div>

        {/* ============ FOOTER ============ */}
        <div className="footer-bottom">
          <div className="footer-brand">
            <video
              className="footer-logo-video"
              src="/videos/video.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <span className="footer-col-title">Join us</span>
              {JOIN_US.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link footer-link--active"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="footer-col">
              <span className="footer-col-title">Product</span>
              {PRODUCT.map((item) => (
                <span key={item} className="footer-link">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <span className="footer-rights">All rights reserved © 2026</span>
        </div>
      </div>

      {/* Plain <style> tag on purpose — not <style jsx>. Same fix already
          applied to WhyUs/FAQ after styled-jsx's head-injection turned out
          to be unreliable in this project's dev environment. */}
      <style>{`
        .footer-section {
          position: relative;
          width: 100%;
          padding: 140px 24px 0;
          background: #000;
          overflow: hidden;
        }

        .footer-section .footer-glow {
          position: absolute;
          left: 50%;
          bottom: -220px;
          transform: translateX(-50%);
          width: 1400px;
          max-width: 160vw;
          height: 420px;
          background: radial-gradient(ellipse at center, rgba(20, 60, 220, 0.28) 0%, rgba(20, 60, 220, 0.08) 45%, transparent 75%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }

        .footer-section .footer-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-section .footer-title {
          display: flex;
          flex-direction: column;
          margin: 0;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.08;
        }

        .footer-section .title-white {
          color: #ffffff;
        }

        .footer-section .title-muted {
          color: rgba(255, 255, 255, 0.4);
        }

        .footer-section .footer-subtext {
          max-width: 480px;
          margin: 24px auto 0;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.48);
        }

        .footer-section .footer-cta {
          margin-top: 36px;
        }

        .footer-section .footer-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 30px;
          border-radius: 14px;
          background: #ffffff;
          color: #000000;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .footer-section .footer-btn:hover {
          background: #e4e4e7;
          transform: translateY(-1px);
        }

        /* ============ DIVIDER ============ */
        .footer-section .footer-divider {
          display: flex;
          align-items: center;
          gap: 24px;
          margin: 120px 0 64px;
        }

        .footer-section .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
        }

        .footer-section .divider-mark {
          flex-shrink: 0;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.4);
        }

        /* ============ BOTTOM ROW ============ */
        .footer-section .footer-bottom {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 40px;
          padding-bottom: 64px;
          text-align: left;
        }

        .footer-section .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-section .footer-logo-video {
          width: 72px;
          height: 72px;
          border-radius: 14px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .footer-section .footer-columns {
          display: flex;
          gap: 64px;
        }

        .footer-section .footer-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-section .footer-col-title {
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 4px;
        }

        .footer-section .footer-link {
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
        }

        .footer-section .footer-link--active {
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .footer-section .footer-link--active:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .footer-section .footer-rights {
          flex-shrink: 0;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
          white-space: nowrap;
        }

        @media (max-width: 700px) {
          .footer-section {
            padding: 100px 16px 0;
          }

          .footer-section .footer-divider {
            margin: 80px 0 48px;
          }

          .footer-section .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 32px;
            padding-bottom: 48px;
          }

          .footer-section .footer-columns {
            gap: 40px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-section * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}