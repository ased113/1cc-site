"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Скільки часу потрібно, щоб почати роботу з 1CC?",
    answer:
      "Зазвичай запуск займає від 2 до 5 робочих днів — залежно від вертикалі, GEO та обсягу лідів. Ми узгоджуємо скрипти, налаштовуємо передачу лідів і виводимо команду на потік без затримок.",
  },
  {
    question: "Як швидко ви обробляєте ліди?",
    answer:
      "Середній час реакції на новий лід — до 2 хвилин. Швидкість обробки напряму впливає на конверсію, тому Speed to Lead — один з ключових показників, який ми контролюємо щодня.",
  },
  {
    question: "Чи можна змінювати умови під наш обсяг?",
    answer:
      "Так. Умови співпраці, ставки та пріоритет обробки залежать від місячного обсягу лідів — ми адаптуємо схему роботи під ваші реальні цифри, а не пропонуємо один шаблон для всіх.",
  },
  {
    question: "Як контролюється якість апруву?",
    answer:
      "Кожен лід проходить через систему контролю — від першого контакту до підтвердженого результату. Ми відстежуємо конверсію по кожному closer'у та надаємо прозору аналітику в реальному часі.",
  },
  {
    question: "Які гарантії ви даєте по результату?",
    answer:
      "Ми не працюємо за принципом \"конвеєра\": процес адаптується під ваш GEO та вертикаль, а результати видно в цифрах — конкретні показники апруву та конверсії, а не презентації.",
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="faq-chevron"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <motion.h2
          className="faq-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          FAQ
        </motion.h2>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={item.question}
                className="faq-item"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronIcon open={isOpen} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-answer-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                    >
                      <p className="faq-answer">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="faq-cta"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        >
          <a
            href="https://t.me/onechanceg"
            target="_blank"
            rel="noopener noreferrer"
            className="faq-btn"
          >
            Написати в Telegram
          </a>
        </motion.div>
      </div>

      {/* Plain <style> tag, not <style jsx> — matches the fix already
          applied elsewhere in the project after styled-jsx's head
          injection turned out to be unreliable in this dev environment. */}
      <style>{`
        .faq-section {
          position: relative;
          width: 100%;
          padding: 120px 24px 140px;
          background: #000;
        }

        .faq-section .faq-container {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
        }

        .faq-section .faq-title {
          margin: 0 0 56px;
          text-align: center;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: clamp(32px, 4vw, 44px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .faq-section .faq-list {
          display: flex;
          flex-direction: column;
        }

        .faq-section .faq-item {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .faq-section .faq-item:last-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .faq-section .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          width: 100%;
          padding: 22px 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.82);
          transition: color 0.2s ease;
        }

        .faq-section .faq-question:hover {
          color: #ffffff;
        }

        .faq-section .faq-chevron {
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.45);
        }

        .faq-section .faq-question:hover .faq-chevron {
          color: rgba(163, 230, 53, 0.9);
        }

        .faq-section .faq-answer-wrap {
          overflow: hidden;
        }

        .faq-section .faq-answer {
          margin: 0;
          padding: 0 28px 22px 4px;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 14px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.5);
        }

        .faq-section .faq-cta {
          display: flex;
          justify-content: center;
          margin-top: 56px;
        }

        .faq-section .faq-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 28px;
          border-radius: 999px;
          background: #12294f;
          color: #ffffff;
          font-family: var(--font-jakarta), Inter, sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .faq-section .faq-btn:hover {
          background: #17335f;
          transform: translateY(-1px);
        }

        @media (max-width: 600px) {
          .faq-section {
            padding: 90px 16px 100px;
          }

          .faq-section .faq-title {
            margin-bottom: 40px;
          }

          .faq-section .faq-question {
            font-size: 14px;
            padding: 18px 2px;
          }

          .faq-section .faq-answer {
            font-size: 13px;
            padding: 0 20px 18px 2px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .faq-section * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}