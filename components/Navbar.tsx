"use client";

import React, { useState } from "react";

export default function Navbar() {
  const [lang, setLang] = useState<"ru" | "ua">("ua");
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "#about", label: "Про нас" },
    { href: "#pricing", label: "Тарифи" },
    { href: "#tiers", label: "Рівні обсягу" },
    { href: "#contacts", label: "Контакти" },
  ];

  return (
    <header className="nb">
      <div className="nb-inner">

        <div className="nb-left">
          <a href="#" className="nb-logo">1CC</a>
        </div>

        <nav className="nb-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nb-link">
              {l.label}
            </a>
          ))}
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

          <a href="#start" className="nb-cta">Залишити заявку</a>

          <button
            className={`nb-burger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

      </div>

      <div className={`nb-mobile ${menuOpen ? "is-open" : ""}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className="nb-mobile-link" onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <a href="#start" className="nb-mobile-cta" onClick={() => setMenuOpen(false)}>Залишити заявку</a>
      </div>

      <style jsx>{`
        .nb {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          background: rgba(0, 0, 0, 0.85);
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
          padding: 18px 20px;
        }

        .nb-left {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .nb-logo {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 22px;
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
          gap: 14px;
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
          padding: 6px 12px;
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
          padding: 10px 22px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #18181b;
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
          transition: background 0.2s ease;
          white-space: nowrap;
        }

        .nb-cta:hover {
          background: #27272a;
        }

        .nb-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }

        .nb-burger span {
          display: block;
          width: 100%;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }

        .nb-burger.is-open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .nb-burger.is-open span:nth-child(2) {
          opacity: 0;
        }
        .nb-burger.is-open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .nb-mobile {
          display: none;
          flex-direction: column;
          max-height: 0;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.95);
          border-top: 1px solid transparent;
          transition: max-height 0.3s ease;
        }

        .nb-mobile.is-open {
          max-height: 400px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nb-mobile-link {
          padding: 16px 20px;
          font-size: 16px;
          font-weight: 500;
          color: #d4d4d8;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .nb-mobile-cta {
          margin: 16px 20px;
          padding: 12px;
          text-align: center;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #18181b;
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
        }

        @media (max-width: 1024px) {
          .nb-links {
            display: none;
          }
          .nb-cta {
            display: none;
          }
          .nb-burger {
            display: flex;
          }
          .nb-mobile {
            display: flex;
          }
        }

        @media (max-width: 640px) {
          .nb-inner {
            padding: 14px 16px;
          }
          .nb-logo {
            font-size: 20px;
          }
          .nb-lang-btn {
            padding: 5px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </header>
  );
}