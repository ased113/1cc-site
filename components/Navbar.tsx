"use client";

import React, { useState } from "react";

export default function Navbar() {
  const [lang, setLang] = useState<"ru" | "ua">("ua");

  return (
    <header className="nb">
      <div className="nb-inner">

        <div className="nb-left">
          <a href="#" className="nb-logo">1CC</a>
        </div>

        <nav className="nb-links">
          <a href="#about" className="nb-link">Про нас</a>
          <a href="#pricing" className="nb-link">Тарифи</a>
          <a href="#tiers" className="nb-link">Рівні обсягу</a>
          <a href="#contacts" className="nb-link">Контакти</a>
        </nav>

        <div className="nb-right">

          <div className="nb-lang">
            <button
              className={`nb-lang-btn ${lang === "ru" ? "is-active" : ""}`}
              onClick={() => setLang("ru")}
            >
              RU
            </button>
            <button
              className={`nb-lang-btn ${lang === "ua" ? "is-active" : ""}`}
              onClick={() => setLang("ua")}
            >
              UA
            </button>
          </div>

          <a href="#start" className="nb-cta">
            Залишити заявку
          </a>

        </div>

      </div>

      <style jsx>{`
        .nb {
          position: sticky;
          top: 0;
          z-index: 50;

          width: 100%;

          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nb-inner {
          position: relative;

          max-width: 1400px;
          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 20px 24px;
        }

        .nb-left {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .nb-logo {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #ffffff;
        }

        .nb-links {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);

          display: flex;
          align-items: center;
          gap: 40px;
        }

        .nb-link {
          font-size: 16px;
          font-weight: 500;
          color: #d4d4d8;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .nb-link:hover {
          color: #ffffff;
        }

        .nb-right {
          flex-shrink: 0;

          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nb-lang {
          display: flex;
          align-items: center;

          padding: 4px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #18181b;
        }

        .nb-lang-btn {
          padding: 6px 13px;
          border-radius: 999px;
          border: none;
          background: transparent;
          cursor: pointer;

          font-size: 13px;
          font-weight: 500;
          color: #a1a1aa;

          transition: background 0.2s ease, color 0.2s ease;
        }

        .nb-lang-btn.is-active {
          background: #ffffff;
          color: #000000;
          font-weight: 700;
        }

        .nb-cta {
          padding: 10px 24px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #18181b;

          font-size: 16px;
          font-weight: 500;
          color: #ffffff;

          transition: background 0.2s ease;
          white-space: nowrap;
        }

        .nb-cta:hover {
          background: #27272a;
        }

        @media (max-width: 1024px) {
          .nb-links {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .nb-inner {
            padding: 16px;
          }

          .nb-cta {
            padding: 8px 16px;
            font-size: 14px;
          }

          .nb-logo {
            font-size: 20px;
          }
        }
      `}</style>
    </header>
  );
}