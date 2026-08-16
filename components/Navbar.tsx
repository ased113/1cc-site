"use client";

import React, { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#about", label: "Про нас" },
  { href: "#tiers", label: "Рівні обсягу" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Контакти" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.replace("#", ""));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="st-header">
      <div className="st-island">
        {/* ============ glass material — decorative, non-interactive ============
            Everything below is position:absolute and removed from flow, so
            it changes nothing about size/shape/spacing/layout. It exists
            purely to give the island real optical depth instead of flat
            transparency. Order matters: these paint first, the actual nav
            content (logo/links/buttons) paints after, so text stays
            perfectly sharp — backdrop-filter only blurs what's already
            behind the element, never its own children. */}
        <div className="st-glass-base" aria-hidden="true" />
        <div className="st-glass-diffuse" aria-hidden="true" />
        <div className="st-glass-rim" aria-hidden="true" />
        <div className="st-glass-specular" aria-hidden="true" />

        <div className="st-island-left">
          <span className="st-logo">1CC</span>
        </div>

        <nav className="st-island-nav">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={isActive ? "is-active" : ""}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="st-island-right">
          <a
            href="http://t.me/onechanceg"
            target="_blank"
            rel="noopener noreferrer"
            className="st-btn-primary"
          >
            Залишити заявку
          </a>

          <button
            className="st-burger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="st-mobile-menu">
          <div className="st-glass-base" aria-hidden="true" />
          <div className="st-glass-diffuse" aria-hidden="true" />
          <div className="st-glass-rim" aria-hidden="true" />
          <div className="st-glass-specular" aria-hidden="true" />

          <nav className="st-mobile-nav">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={isActive ? "is-active" : ""}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <a
            href="http://t.me/onechanceg"
            target="_blank"
            rel="noopener noreferrer"
            className="st-mobile-btn"
          >
            Залишити заявку
          </a>
        </div>
      ) : null}

      <style jsx>{`
        .st-header {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 0 20px;
          background: transparent;
        }

        .st-island :global(.st-glass-base),
        .st-mobile-menu :global(.st-glass-base) {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: rgba(8, 8, 11, 0.34);
          pointer-events: none;
        }

        .st-island :global(.st-glass-diffuse),
        .st-mobile-menu :global(.st-glass-diffuse) {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          backdrop-filter: blur(52px) saturate(240%) brightness(1.08) contrast(1.05);
          -webkit-backdrop-filter: blur(52px) saturate(240%) brightness(1.08) contrast(1.05);
          mask-image: radial-gradient(ellipse 75% 130% at 50% 50%, #000 45%, rgba(0, 0, 0, 0.5) 78%, transparent 100%);
          -webkit-mask-image: radial-gradient(
            ellipse 75% 130% at 50% 50%,
            #000 45%,
            rgba(0, 0, 0, 0.5) 78%,
            transparent 100%
          );
        }

        .st-island :global(.st-glass-rim),
        .st-mobile-menu :global(.st-glass-rim) {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          backdrop-filter: blur(18px) saturate(170%) brightness(1.03);
          -webkit-backdrop-filter: blur(18px) saturate(170%) brightness(1.03);
          mask-image: radial-gradient(ellipse 75% 130% at 50% 50%, transparent 42%, #000 100%);
          -webkit-mask-image: radial-gradient(ellipse 75% 130% at 50% 50%, transparent 42%, #000 100%);
        }

        .st-island :global(.st-glass-specular),
        .st-mobile-menu :global(.st-glass-specular) {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0.14) 0%,
            rgba(255, 255, 255, 0.03) 20%,
            transparent 38%,
            transparent 62%,
            rgba(255, 255, 255, 0.02) 80%,
            rgba(255, 255, 255, 0.09) 100%
          );
          mix-blend-mode: screen;
          opacity: 0.7;
        }

        .st-island {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 32px;
          width: max-content;
          max-width: calc(100vw - 40px);
          margin: 0 auto;
          padding: 14px 14px 14px 20px;

          border-radius: 22px;
          border: 1px solid transparent;
          background:
            linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)) padding-box,
            linear-gradient(
                120deg,
                rgba(196, 214, 255, 0.32) 0%,
                rgba(255, 255, 255, 0.06) 35%,
                rgba(255, 255, 255, 0.04) 65%,
                rgba(204, 255, 140, 0.16) 100%
              )
              border-box;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06),
            inset 0 -14px 26px rgba(0, 0, 0, 0.32);
        }

        .st-island-left {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .st-logo {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .st-island-nav {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .st-island-nav a {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #a1a1aa;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .st-island-nav a:hover {
          color: #e4e4e7;
        }

        .st-island-nav a.is-active {
          color: #ffffff;
          font-weight: 600;
        }

        .st-island-right {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .st-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          font-family: var(--font-jakarta), sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          background: #ffffff;
          border: none;
          border-radius: 14px;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .st-btn-primary:hover {
          background: #e4e4e7;
          transform: translateY(-1px);
        }

        .st-burger {
          position: relative;
          z-index: 1;
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }

        .st-burger span {
          display: block;
          width: 16px;
          height: 2px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 2px;
        }

        .st-mobile-menu {
          position: fixed;
          top: 84px;
          right: 20px;
          left: 20px;
          z-index: 49;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 20px;

          border-radius: 24px;
          border: 1px solid transparent;
          background:
            linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)) padding-box,
            linear-gradient(
                135deg,
                rgba(196, 214, 255, 0.3) 0%,
                rgba(255, 255, 255, 0.05) 40%,
                rgba(204, 255, 140, 0.14) 100%
              )
              border-box;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06),
            inset 0 -14px 26px rgba(0, 0, 0, 0.32);
        }

        .st-mobile-nav {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .st-mobile-nav a {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #a1a1aa;
          text-decoration: none;
        }

        .st-mobile-nav a.is-active {
          color: #ffffff;
          font-weight: 600;
        }

        .st-mobile-btn {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 20px;
          font-family: var(--font-jakarta), sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          background: #ffffff;
          border-radius: 14px;
          text-decoration: none;
        }

        @media (max-width: 860px) {
          .st-island-nav {
            display: none;
          }

          .st-island {
            width: calc(100vw - 40px);
            max-width: calc(100vw - 40px);
            padding: 10px 10px 10px 20px;
            gap: 12px;
          }

          .st-island-right :global(.st-btn-primary) {
            display: none;
          }

          .st-burger {
            display: flex;
          }
        }

        @media (min-width: 861px) {
          .st-mobile-menu {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}