"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

/* =========================================================
   WORD SWAPPER
========================================================= */

const DYNAMIC_WORDS = [
  "Closing machine.",
  "ROI booster.",
  "Revenue engine.",
  "Traffic converters.",
];

function WordSwapper() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(
        (prev) =>
          (prev + 1) %
          DYNAMIC_WORDS.length
      );
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <span className="word-swap-wrap">
      <AnimatePresence mode="wait">
        <motion.span
          key={
            DYNAMIC_WORDS[index]
          }
          className="word-swap-item"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -12,
          }}
          transition={{
            duration: 0.4,
            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
        >
          {
            DYNAMIC_WORDS[index]
          }
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* =========================================================
   CARDS DATA
========================================================= */

const CARDS = [
  {
    num: "01",
    isFeatured: false,
    metric: "100%",
    metricLabel:
      "FOCUS",
    text: "No fluff — тільки конверсія і закриті угоди.",
    position: "left" as const,
  },
  {
    num: "02",
    isFeatured: true,
    metric: "100+",
    metricLabel:
      "COLD KILLERS",
    text: "Top-tier closing team — жорсткий відбір операторів.",
    position: "center" as const,
  },
  {
    num: "03",
    isFeatured: false,
    metric: "0%",
    metricLabel:
      "ZERO LEAKS",
    text: "Full control — прозора аналітика в реальному часі.",
    position: "right" as const,
  },
];

/* =========================================================
   STAGE CARD
========================================================= */

function StageCard({
  card,
  progress,
  spread,
  restOffset,
  isMobileLayout,
}: {
  card: (typeof CARDS)[number];
  progress: ReturnType<
    typeof useMotionValue<number>
  >;
  spread: number;
  restOffset: number;
  isMobileLayout: boolean;
}) {
  /* =======================================================
     SCROLL MOVEMENT — distance is now derived from the
     actual container width (see CardsScrollStep) instead of
     fixed pixel values, so the cards can't fly off-screen on
     narrow phones.
  ======================================================= */

  const leftX = useTransform(
    progress,
    [0, 1],
    [restOffset, -spread]
  );

  const leftY = useTransform(
    progress,
    [0, 1],
    [10, 0]
  );

  const rightX = useTransform(
    progress,
    [0, 1],
    [-restOffset, spread]
  );

  const rightY = useTransform(
    progress,
    [0, 1],
    [10, 0]
  );

  const centerY = useTransform(
    progress,
    [0, 1],
    [20, -20]
  );

  const centerX =
    useMotionValue(0);

  /* =======================================================
     EXISTING HOVER
  ======================================================= */

  const hoverLift =
    useMotionValue(0);

  const hoverScale =
    useMotionValue(1);

  const [isTouch, setIsTouch] =
    useState(false);

  useEffect(() => {
    setIsTouch(
      typeof window !== "undefined" &&
        window.matchMedia(
          "(pointer: coarse)"
        ).matches
    );
  }, []);

  function handleEnter() {
    if (isTouch) return;

    animate(
      hoverLift,
      -6,
      {
        duration: 0.35,
        ease: [
          0.16,
          1,
          0.3,
          1,
        ],
      }
    );

    animate(
      hoverScale,
      1.01,
      {
        duration: 0.35,
        ease: [
          0.16,
          1,
          0.3,
          1,
        ],
      }
    );
  }

  function handleLeave() {
    if (isTouch) return;

    animate(
      hoverLift,
      0,
      {
        duration: 0.35,
        ease: [
          0.16,
          1,
          0.3,
          1,
        ],
      }
    );

    animate(
      hoverScale,
      1,
      {
        duration: 0.35,
        ease: [
          0.16,
          1,
          0.3,
          1,
        ],
      }
    );
  }

  /* =======================================================
     CARD POSITION
  ======================================================= */

  let baseX;
  let baseY;
  let zIndex;

  if (
    card.position ===
    "left"
  ) {
    baseX = leftX;
    baseY = leftY;
    zIndex = 2;
  } else if (
    card.position ===
    "right"
  ) {
    baseX = rightX;
    baseY = rightY;
    zIndex = 2;
  } else {
    baseX = centerX;
    baseY = centerY;
    zIndex = 3;
  }

  const combinedY =
    useTransform(
      [baseY, hoverLift],
      ([b, h]: number[]) =>
        b + h
    );

  return (
    <motion.div
      className={`stage-card ${
        card.isFeatured
          ? "card-featured"
          : ""
      } ${
        isMobileLayout
          ? "stage-card-mobile"
          : ""
      }`}
      style={
        isMobileLayout
          ? { position: "relative" }
          : {
              x: baseX,
              y: combinedY,
              scale: hoverScale,
              zIndex,
            }
      }
      onHoverStart={
        handleEnter
      }
      onHoverEnd={
        handleLeave
      }
    >
      {/* ==================================================
          GLOSSY LIGHTING
      ================================================== */}

      <div className="card-light card-light-blue" />

      <div className="card-light card-light-green" />

      <div className="card-light card-light-white" />

      <div className="card-reflection" />

      <div className="card-vignette" />

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="card-top">
        <span className="card-num">
          {card.num}
        </span>
      </div>

      <div className="card-content">
        <div className="card-metric">
          {card.metric}
        </div>

        <div className="card-metric-label">
          {card.metricLabel}
        </div>

        <div className="card-footer">
          <p className="card-text">
            {card.text}
          </p>

          <span
            className={`card-arrow ${
              card.isFeatured
                ? "card-arrow-accent"
                : ""
            }`}
          >
            {parseInt(card.num, 10)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   SCROLL STEP
========================================================= */

function CardsScrollStep() {
  const sectionRef =
    useRef<HTMLDivElement>(
      null
    );

  const progress =
    useMotionValue(0);

  const targetRef =
    useRef(0);

  const isActiveRef =
    useRef(false);

  const rafRef =
    useRef<number | null>(
      null
    );

  /* =======================================================
     RESPONSIVE SPREAD DISTANCE

     The original design used fixed pixel offsets (±320px /
     ±65px) tuned for a ~1150px-wide desktop container. On a
     narrow phone that would push the left/right cards mostly
     off-screen. Instead, derive the spread from the actual
     measured width of the container and keep the same visual
     proportions (320/1150 ≈ 0.278, 65/1150 ≈ 0.057), clamped
     so a card never travels far enough to clear the viewport.
  ======================================================= */

  const [containerWidth, setContainerWidth] =
    useState(1150);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const update = () => {
      setContainerWidth(el.clientWidth || 1150);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const spread = Math.min(
    320,
    containerWidth * 0.278
  );

  const restOffset = Math.min(
    65,
    containerWidth * 0.057
  );

  /* =======================================================
     INTERSECTION OBSERVER
  ======================================================= */

  useEffect(() => {
    const el =
      sectionRef.current;

    if (!el) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          isActiveRef.current =
            entry.isIntersecting &&
            entry.intersectionRatio >
              0.5;
        },
        {
          threshold: [
            0,
            0.5,
            1,
          ],
        }
      );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =======================================================
     SMOOTH PROGRESS
  ======================================================= */

  useEffect(() => {
    function tick() {
      const current =
        progress.get();

      const next =
        current +
        (
          targetRef.current -
          current
        ) *
          0.18;

      progress.set(
        Math.abs(
          next -
            targetRef.current
        ) < 0.0005
          ? targetRef.current
          : next
      );

      rafRef.current =
        requestAnimationFrame(
          tick
        );
    }

    rafRef.current =
      requestAnimationFrame(
        tick
      );

    return () => {
      if (
        rafRef.current !==
        null
      ) {
        cancelAnimationFrame(
          rafRef.current
        );
      }
    };
  }, [progress]);

  /* =======================================================
     TOUCH DETECTION

     On touch devices there is no wheel event to hijack, so
     the "scroll-driven spread" animation would otherwise
     never run and the three cards would sit stacked near
     their starting (progress = 0) position forever, mostly
     overlapping. As soon as we know we're on a touch device,
     jump the target straight to the fully-spread state so
     the cards render in their final left/center/right
     layout immediately — no broken half-stacked state.
  ======================================================= */

  const [
    isTouch,
    setIsTouch,
  ] = useState(false);

  useEffect(() => {
    const touch =
      typeof window !== "undefined" &&
      window.matchMedia(
        "(pointer: coarse)"
      ).matches;

    setIsTouch(touch);

    if (touch) {
      targetRef.current = 1;
      progress.set(1);
    }
  }, [progress]);

  /* =======================================================
     MOBILE STACKED LAYOUT

     Below ~640px three ~300px-wide cards physically cannot
     spread apart without overlapping (the math simply doesn't
     fit: 3 × 300px > 400px viewport). Rather than fighting
     that with ever-smaller offsets, switch to a plain vertical
     stack — the standard, reliable mobile pattern.
  ======================================================= */

  const [
    isMobileLayout,
    setIsMobileLayout,
  ] = useState(false);

  useEffect(() => {
    const mql =
      window.matchMedia(
        "(max-width: 640px)"
      );

    const update = () =>
      setIsMobileLayout(
        mql.matches
      );

    update();

    mql.addEventListener(
      "change",
      update
    );

    return () =>
      mql.removeEventListener(
        "change",
        update
      );
  }, []);

  /* =======================================================
     WHEEL HIJACK
  ======================================================= */

  useEffect(() => {
    if (isTouch) return;

    const SENSITIVITY =
      0.0016;

    function handleWheel(
      e: WheelEvent
    ) {
      if (
        !isActiveRef.current
      ) {
        return;
      }

      const goingDown =
        e.deltaY > 0;

      const atEnd =
        targetRef.current >=
        1;

      const atStart =
        targetRef.current <=
        0;

      if (
        (goingDown &&
          atEnd) ||
        (!goingDown &&
          atStart)
      ) {
        return;
      }

      e.preventDefault();

      targetRef.current =
        Math.min(
          1,
          Math.max(
            0,
            targetRef.current +
              e.deltaY *
                SENSITIVITY
          )
        );
    }

    window.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      }
    );

    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel
      );
    };
  }, [isTouch]);

  return (
    <div
      className={`cards-section ${
        isMobileLayout
          ? "cards-section-mobile"
          : ""
      }`}
      ref={sectionRef}
    >
      <div
        className={`cards-container ${
          isMobileLayout
            ? "cards-container-mobile"
            : ""
        }`}
      >
        {CARDS.map(
          (card) => (
            <StageCard
              key={
                card.num
              }
              card={
                card
              }
              progress={
                progress
              }
              spread={spread}
              restOffset={restOffset}
              isMobileLayout={
                isMobileLayout
              }
            />
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ABOUT
========================================================= */

export default function About() {
  return (
    <section
      id="about"
      className="about"
    >
      <div className="about-inner">

        {/* =================================================
            INTRO
        ================================================= */}

        <div className="about-intro">

          {/* =================================================
              WHO WE ARE

              IMPORTANT:
              TEXT ONLY.
              NO BORDER.
              NO BACKGROUND.
              NO PILL.
              NO DOT.
          ================================================= */}

          <span className="about-label">
            WHO WE ARE
          </span>

          <h2 className="about-title">

            <div className="about-title-line about-title-muted">
              Ми не call-центр.
            </div>

            <div className="about-title-line about-title-white">
              Ми —{" "}
              <WordSwapper />
            </div>

          </h2>

          <p className="about-text">
            Не обробляємо ліди.
            Забираємо гроші з бази.
            Без довгих скриптів і
            формальних дзвінків
            «для звіту». Наші
            closer&apos;и пробивають
            відмови, працюють із
            запереченнями та
            дотискають угоди там,
            де інші списали
            трафік у брак.
          </p>

        </div>

        {/* =================================================
            CARDS
        ================================================= */}

        <CardsScrollStep />

      </div>

      {/* ===================================================
          STYLES
      =================================================== */}

      <style jsx>{`

        /* ===================================================
           PAGE
        =================================================== */

        .about {
          position: relative;

          width: 100%;

          background: #000000;

          color: #f5f5f5;

          padding:
            100px 24px 100px;

          scroll-margin-top: 110px;
        }

        .about-inner {
          position: relative;

          width: 100%;

          max-width: 1220px;

          margin: 0 auto;
        }

        /* ===================================================
           INTRO
        =================================================== */

        .about-intro {
          display: flex;

          flex-direction: column;

          align-items: center;

          text-align: center;

          max-width: 900px;

          margin: 0 auto;
        }

        /* ===================================================
           WHO WE ARE

           NO BORDER
           NO BACKGROUND
           NO PADDING
           NO RADIUS
        =================================================== */

        .about-label {
          display: inline-flex;

          margin-bottom: 12px;

          font-family:
            "Courier New",
            monospace;

          font-size: 12px;

          font-weight: 700;

          letter-spacing:
            0.15em;

          text-transform:
            uppercase;

          color:
            rgba(
              255,
              255,
              255,
              0.55
            );
        }

        /* ===================================================
           TITLE
        =================================================== */

        .about-title {
          display: flex;

          flex-direction:
            column;

          align-items:
            center;

          margin-top:
            16px;

          margin-bottom:
            32px;
        }

        .about-title-line {
          font-family:
            var(--font-jakarta),
            sans-serif;

          font-size:
            58px;

          font-weight:
            700;

          letter-spacing:
            -0.02em;

          line-height:
            1.15;
        }

        .about-title-muted {
          color:
            #6b6b6b;
        }

        .about-title-white {
          color:
            #ffffff;

          font-weight:
            800;
        }

        .word-swap-wrap {
          display:
            inline-block;

          position:
            relative;

          vertical-align:
            top;
        }

        :global(.word-swap-item) {
          display:
            inline-block;

          color:
            #ffffff;
        }

        /* ===================================================
           TEXT
        =================================================== */

        .about-text {
          max-width:
            680px;

          font-size:
            16px;

          font-weight:
            400;

          line-height:
            1.6;

          color:
            rgba(
              255,
              255,
              255,
              0.6
            );

          margin-bottom:
            48px;
        }

        /* ===================================================
           CARDS SECTION
        =================================================== */

        :global(.cards-section) {
          position:
            relative;

          width:
            100%;

          max-width:
            1150px;

          margin:
            0 auto;

          height:
            460px;

          overflow:
            hidden;
        }

        :global(.cards-container) {
          position:
            relative;

          width:
            100%;

          height:
            100%;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;
        }

        /* ===================================================
           BASE CARD
        =================================================== */

        :global(.stage-card) {
          box-sizing:
            border-box;

          position:
            absolute;

          display:
            flex;

          flex-direction:
            column;

          width:
            min(
              340px,
              88vw
            );

          min-height:
            320px;

          padding:
            26px;

          overflow:
            hidden;

          border-radius:
            18px;

          background:

            radial-gradient(
              ellipse 75% 70%
                at 88% 5%,
              rgba(
                245,
                250,
                255,
                0.22
              ) 0%,
              rgba(
                220,
                232,
                240,
                0.11
              ) 18%,
              rgba(
                160,
                180,
                195,
                0.035
              ) 38%,
              transparent 62%
            ),

            radial-gradient(
              ellipse 70% 80%
                at 8% 92%,
              rgba(
                25,
                75,
                255,
                0.18
              ) 0%,
              rgba(
                20,
                65,
                255,
                0.075
              ) 25%,
              transparent 62%
            ),

            linear-gradient(
              145deg,
              #010101 0%,
              #080808 32%,
              #020202 63%,
              #0a0a0a 100%
            );

          border:
            1px solid
            rgba(
              220,
              235,
              245,
              0.18
            );

          box-shadow:
            0 30px 75px
              rgba(
                0,
                0,
                0,
                0.78
              ),

            0 12px 28px
              rgba(
                0,
                0,
                0,
                0.52
              ),

            inset 0 1px 0
              rgba(
                255,
                255,
                255,
                0.12
              ),

            inset 0 -1px 0
              rgba(
                255,
                255,
                255,
                0.025
              );

          transition:
            border-color
              0.35s ease,

            box-shadow
              0.35s ease;
        }

        /* ===================================================
           TOP CURVED REFLECTION
        =================================================== */

        :global(.stage-card)::before {
          content:
            "";

          position:
            absolute;

          width:
            170%;

          height:
            95%;

          top:
            -42%;

          right:
            -35%;

          pointer-events:
            none;

          background:
            radial-gradient(
              ellipse at center,
              rgba(
                255,
                255,
                255,
                0.13
              ) 0%,
              rgba(
                255,
                255,
                255,
                0.065
              ) 20%,
              rgba(
                255,
                255,
                255,
                0.02
              ) 42%,
              transparent 70%
            );

          filter:
            blur(18px);

          transform:
            rotate(-15deg);

          opacity:
            0.9;

          z-index:
            1;

          animation:
            chrome-drift
            15s
            ease-in-out
            infinite;
        }

        /* ===================================================
           LOWER REFLECTION
        =================================================== */

        :global(.stage-card)::after {
          content:
            "";

          position:
            absolute;

          width:
            140%;

          height:
            65%;

          left:
            -45%;

          bottom:
            -35%;

          pointer-events:
            none;

          background:
            radial-gradient(
              ellipse at center,
              rgba(
                30,
                75,
                255,
                0.12
              ) 0%,
              rgba(
                30,
                75,
                255,
                0.05
              ) 28%,
              transparent 68%
            );

          filter:
            blur(24px);

          transform:
            rotate(8deg);

          opacity:
            0.85;

          z-index:
            1;

          animation:
            smoke-drift
            18s
            ease-in-out
            infinite;
        }

        /* ===================================================
           LIGHT SOURCES
        =================================================== */

        :global(.card-light) {
          position:
            absolute;

          pointer-events:
            none;

          border-radius:
            50%;

          mix-blend-mode:
            screen;

          z-index:
            2;
        }

        /* ===================================================
           BLUE
        =================================================== */

        :global(.card-light-blue) {
          width:
            250px;

          height:
            280px;

          left:
            35px;

          bottom:
            -125px;

          background:
            radial-gradient(
              ellipse at center,
              rgba(
                25,
                75,
                255,
                0.40
              ) 0%,
              rgba(
                25,
                75,
                255,
                0.20
              ) 25%,
              rgba(
                20,
                55,
                220,
                0.07
              ) 48%,
              transparent 72%
            );

          filter:
            blur(32px);

          transform:
            rotate(-18deg);

          animation:
            blue-smoke
            17s
            ease-in-out
            infinite;
        }

        /* ===================================================
           GREEN
        =================================================== */

        :global(.card-light-green) {
          width:
            230px;

          height:
            270px;

          right:
            -65px;

          top:
            65px;

          background:
            radial-gradient(
              ellipse at center,
              rgba(
                145,
                230,
                55,
                0.28
              ) 0%,
              rgba(
                130,
                220,
                50,
                0.13
              ) 25%,
              rgba(
                100,
                185,
                40,
                0.04
              ) 48%,
              transparent 72%
            );

          filter:
            blur(36px);

          transform:
            rotate(20deg);

          animation:
            green-smoke
            19s
            ease-in-out
            infinite;
        }

        /* ===================================================
           WHITE / SILVER
        =================================================== */

        :global(.card-light-white) {
          width:
            290px;

          height:
            230px;

          right:
            -85px;

          top:
            -90px;

          background:
            radial-gradient(
              ellipse at center,
              rgba(
                250,
                253,
                255,
                0.42
              ) 0%,
              rgba(
                225,
                235,
                242,
                0.20
              ) 22%,
              rgba(
                195,
                210,
                220,
                0.065
              ) 44%,
              transparent 72%
            );

          filter:
            blur(30px);

          transform:
            rotate(-12deg);

          animation:
            white-smoke
            21s
            ease-in-out
            infinite;
        }

        /* ===================================================
           CARD 01 — BLUE
        =================================================== */

        :global(
          .cards-container
          > .stage-card:nth-child(1)
        ) {
          background:

            radial-gradient(
              ellipse 72% 68%
                at 88% 7%,
              rgba(
                245,
                250,
                255,
                0.22
              ) 0%,
              rgba(
                215,
                228,
                238,
                0.10
              ) 22%,
              transparent 62%
            ),

            radial-gradient(
              ellipse 82% 88%
                at 8% 96%,
              rgba(
                28,
                78,
                255,
                0.25
              ) 0%,
              rgba(
                25,
                70,
                255,
                0.12
              ) 28%,
              rgba(
                20,
                55,
                220,
                0.035
              ) 52%,
              transparent 72%
            ),

            linear-gradient(
              150deg,
              #010101 0%,
              #080808 42%,
              #020203 70%,
              #080a12 100%
            );
        }

        :global(
          .cards-container
          > .stage-card:nth-child(1)
          .card-light-blue
        ) {
          left:
            5px;

          bottom:
            -135px;

          width:
            280px;

          height:
            300px;

          opacity:
            1;

          animation:
            blue-smoke-left
            18s
            ease-in-out
            infinite;
        }

        :global(
          .cards-container
          > .stage-card:nth-child(1)
          .card-light-green
        ) {
          opacity:
            0.04;
        }

        :global(
          .cards-container
          > .stage-card:nth-child(1)
          .card-light-white
        ) {
          right:
            -105px;

          top:
            -95px;

          opacity:
            0.85;

          animation-delay:
            -5s;
        }

        /* ===================================================
           CARD 02 — LIME
        =================================================== */

        :global(
          .cards-container
          > .stage-card:nth-child(2)
        ) {
          border-color:
            rgba(
              210,
              230,
              205,
              0.23
            );

          background:

            radial-gradient(
              ellipse 80% 70%
                at 18% 5%,
              rgba(
                250,
                253,
                255,
                0.22
              ) 0%,
              rgba(
                220,
                232,
                224,
                0.10
              ) 20%,
              transparent 62%
            ),

            radial-gradient(
              ellipse 85% 90%
                at 88% 88%,
              rgba(
                150,
                230,
                55,
                0.25
              ) 0%,
              rgba(
                125,
                210,
                45,
                0.13
              ) 28%,
              rgba(
                90,
                170,
                35,
                0.045
              ) 52%,
              transparent 74%
            ),

            linear-gradient(
              145deg,
              #010101 0%,
              #080908 36%,
              #030403 67%,
              #080c06 100%
            );

          box-shadow:
            0 34px 82px
              rgba(
                0,
                0,
                0,
                0.82
              ),

            0 12px 30px
              rgba(
                0,
                0,
                0,
                0.55
              ),

            inset 0 1px 0
              rgba(
                255,
                255,
                255,
                0.15
              ),

            inset 0 -1px 0
              rgba(
                255,
                255,
                255,
                0.03
              );
        }

        :global(
          .cards-container
          > .stage-card:nth-child(2)
          .card-light-blue
        ) {
          opacity:
            0 !important;
        }

        :global(
          .cards-container
          > .stage-card:nth-child(2)::after
        ) {
          background:
            radial-gradient(
              ellipse at center,
              rgba(
                145,
                225,
                55,
                0.18
              ) 0%,
              rgba(
                125,
                205,
                45,
                0.09
              ) 28%,
              transparent 70%
            );

          left:
            -15%;

          bottom:
            -38%;

          width:
            150%;

          height:
            70%;

          transform:
            rotate(-10deg);

          animation:
            green-smoke-center
            20s
            ease-in-out
            infinite;
        }

        :global(
          .cards-container
          > .stage-card:nth-child(2)
          .card-light-green
        ) {
          width:
            300px;

          height:
            300px;

          right:
            -95px;

          top:
            100px;

          background:
            radial-gradient(
              ellipse at center,
              rgba(
                165,
                235,
                65,
                0.34
              ) 0%,
              rgba(
                145,
                225,
                55,
                0.19
              ) 25%,
              rgba(
                105,
                190,
                40,
                0.07
              ) 48%,
              transparent 74%
            );

          filter:
            blur(38px);

          transform:
            rotate(12deg);

          opacity:
            1;

          animation:
            lime-smoke
            16s
            ease-in-out
            infinite;
        }

        :global(
          .cards-container
          > .stage-card:nth-child(2)
          .card-light-white
        ) {
          width:
            250px;

          height:
            210px;

          left:
            -90px;

          right:
            auto;

          top:
            -75px;

          opacity:
            0.75;

          animation:
            white-smoke-center
            23s
            ease-in-out
            infinite;
        }

        :global(
          .cards-container
          > .stage-card:nth-child(2)
          .card-reflection
        ) {
          left:
            10px;

          right:
            auto;

          width:
            58%;

          background:
            linear-gradient(
              90deg,
              transparent 0%,
              rgba(
                255,
                255,
                255,
                0.04
              ) 10%,
              rgba(
                235,
                250,
                230,
                0.30
              ) 48%,
              rgba(
                255,
                255,
                255,
                0.08
              ) 76%,
              transparent 100%
            );
        }

        /* ===================================================
           CARD 03 — BLUE
        =================================================== */

        :global(
          .cards-container
          > .stage-card:nth-child(3)
        ) {
          background:

            radial-gradient(
              ellipse 70% 65%
                at 12% 8%,
              rgba(
                245,
                250,
                255,
                0.20
              ) 0%,
              rgba(
                215,
                228,
                238,
                0.09
              ) 22%,
              transparent 60%
            ),

            radial-gradient(
              ellipse 88% 85%
                at 94% 82%,
              rgba(
                30,
                80,
                255,
                0.24
              ) 0%,
              rgba(
                25,
                65,
                245,
                0.115
              ) 28%,
              rgba(
                20,
                50,
                210,
                0.035
              ) 52%,
              transparent 74%
            ),

            linear-gradient(
              125deg,
              #070707 0%,
              #020202 38%,
              #050608 67%,
              #02040b 100%
            );
        }

        :global(
          .cards-container
          > .stage-card:nth-child(3)
          .card-light-blue
        ) {
          width:
            285px;

          height:
            305px;

          left:
            auto;

          right:
            -110px;

          bottom:
            -135px;

          transform:
            rotate(22deg);

          animation:
            blue-smoke-right
            21s
            ease-in-out
            infinite;
        }

        :global(
          .cards-container
          > .stage-card:nth-child(3)
          .card-light-green
        ) {
          opacity:
            0.025;

          left:
            -85px;

          right:
            auto;

          top:
            80px;
        }

        :global(
          .cards-container
          > .stage-card:nth-child(3)
          .card-light-white
        ) {
          width:
            255px;

          height:
            215px;

          left:
            -90px;

          right:
            auto;

          top:
            -85px;

          opacity:
            0.78;

          animation:
            white-smoke-right
            18s
            ease-in-out
            infinite;
        }

        :global(
          .cards-container
          > .stage-card:nth-child(3)::after
        ) {
          left:
            15%;

          right:
            auto;

          bottom:
            -42%;

          width:
            145%;

          height:
            68%;

          transform:
            rotate(-18deg);

          background:
            radial-gradient(
              ellipse at center,
              rgba(
                30,
                75,
                255,
                0.11
              ) 0%,
              rgba(
                30,
                70,
                240,
                0.045
              ) 30%,
              transparent 70%
            );

          animation:
            blue-haze-right
            24s
            ease-in-out
            infinite;
        }

        /* ===================================================
           ANIMATIONS
        =================================================== */

        @keyframes
          blue-smoke-left {
          0% {
            transform:
              translate3d(
                -8px,
                4px,
                0
              )
              rotate(-18deg)
              scale(1);
          }

          25% {
            transform:
              translate3d(
                18px,
                -10px,
                0
              )
              rotate(-12deg)
              scale(1.05);
          }

          50% {
            transform:
              translate3d(
                32px,
                8px,
                0
              )
              rotate(-20deg)
              scale(1.1);
          }

          75% {
            transform:
              translate3d(
                5px,
                -15px,
                0
              )
              rotate(-14deg)
              scale(1.04);
          }

          100% {
            transform:
              translate3d(
                -8px,
                4px,
                0
              )
              rotate(-18deg)
              scale(1);
          }
        }

        @keyframes
          blue-smoke-right {
          0% {
            transform:
              translate3d(
                8px,
                5px,
                0
              )
              rotate(22deg)
              scale(1);
          }

          25% {
            transform:
              translate3d(
                -18px,
                -12px,
                0
              )
              rotate(28deg)
              scale(1.06);
          }

          50% {
            transform:
              translate3d(
                -30px,
                7px,
                0
              )
              rotate(16deg)
              scale(1.1);
          }

          75% {
            transform:
              translate3d(
                -5px,
                -18px,
                0
              )
              rotate(25deg)
              scale(1.04);
          }

          100% {
            transform:
              translate3d(
                8px,
                5px,
                0
              )
              rotate(22deg)
              scale(1);
          }
        }

        @keyframes
          lime-smoke {
          0% {
            transform:
              translate3d(
                5px,
                8px,
                0
              )
              rotate(12deg)
              scale(1);
          }

          20% {
            transform:
              translate3d(
                -18px,
                -8px,
                0
              )
              rotate(20deg)
              scale(1.06);
          }

          45% {
            transform:
              translate3d(
                -32px,
                14px,
                0
              )
              rotate(7deg)
              scale(1.12);
          }

          70% {
            transform:
              translate3d(
                -8px,
                -15px,
                0
              )
              rotate(16deg)
              scale(1.05);
          }

          100% {
            transform:
              translate3d(
                5px,
                8px,
                0
              )
              rotate(12deg)
              scale(1);
          }
        }

        @keyframes
          green-smoke-center {
          0% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-10deg)
              scale(1);
          }

          30% {
            transform:
              translate3d(
                20px,
                -8px,
                0
              )
              rotate(-3deg)
              scale(1.06);
          }

          60% {
            transform:
              translate3d(
                -12px,
                -16px,
                0
              )
              rotate(-15deg)
              scale(1.1);
          }

          100% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-10deg)
              scale(1);
          }
        }

        @keyframes
          white-smoke {
          0% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-12deg)
              scale(1);
          }

          30% {
            transform:
              translate3d(
                -16px,
                9px,
                0
              )
              rotate(-8deg)
              scale(1.04);
          }

          60% {
            transform:
              translate3d(
                12px,
                16px,
                0
              )
              rotate(-17deg)
              scale(1.08);
          }

          100% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-12deg)
              scale(1);
          }
        }

        @keyframes
          white-smoke-center {
          0% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-10deg)
              scale(1);
          }

          35% {
            transform:
              translate3d(
                18px,
                12px,
                0
              )
              rotate(-16deg)
              scale(1.06);
          }

          70% {
            transform:
              translate3d(
                -10px,
                18px,
                0
              )
              rotate(-5deg)
              scale(1.08);
          }

          100% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-10deg)
              scale(1);
          }
        }

        @keyframes
          white-smoke-right {
          0% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-12deg)
              scale(1);
          }

          30% {
            transform:
              translate3d(
                15px,
                -8px,
                0
              )
              rotate(-4deg)
              scale(1.05);
          }

          65% {
            transform:
              translate3d(
                -12px,
                15px,
                0
              )
              rotate(-18deg)
              scale(1.08);
          }

          100% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-12deg)
              scale(1);
          }
        }

        @keyframes
          smoke-drift {
          0% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(8deg)
              scale(1);
          }

          25% {
            transform:
              translate3d(
                20px,
                -8px,
                0
              )
              rotate(14deg)
              scale(1.05);
          }

          50% {
            transform:
              translate3d(
                -15px,
                -15px,
                0
              )
              rotate(2deg)
              scale(1.09);
          }

          75% {
            transform:
              translate3d(
                -8px,
                12px,
                0
              )
              rotate(10deg)
              scale(1.04);
          }

          100% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(8deg)
              scale(1);
          }
        }

        @keyframes
          chrome-drift {
          0% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-15deg)
              scale(1);
          }

          35% {
            transform:
              translate3d(
                -12px,
                8px,
                0
              )
              rotate(-10deg)
              scale(1.04);
          }

          70% {
            transform:
              translate3d(
                10px,
                15px,
                0
              )
              rotate(-18deg)
              scale(1.07);
          }

          100% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-15deg)
              scale(1);
          }
        }

        @keyframes
          blue-haze-right {
          0% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-18deg)
              scale(1);
          }

          30% {
            transform:
              translate3d(
                -15px,
                -10px,
                0
              )
              rotate(-10deg)
              scale(1.05);
          }

          65% {
            transform:
              translate3d(
                18px,
                -5px,
                0
              )
              rotate(-23deg)
              scale(1.08);
          }

          100% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              rotate(-18deg)
              scale(1);
          }
        }

        /* ===================================================
           CHROME REFLECTION
        =================================================== */

        :global(
          .card-reflection
        ) {
          position:
            absolute;

          top:
            1px;

          right:
            10px;

          width:
            62%;

          height:
            1px;

          pointer-events:
            none;

          border-radius:
            999px;

          background:
            linear-gradient(
              90deg,
              transparent 0%,
              rgba(
                255,
                255,
                255,
                0.04
              ) 10%,
              rgba(
                255,
                255,
                255,
                0.35
              ) 48%,
              rgba(
                255,
                255,
                255,
                0.10
              ) 76%,
              transparent 100%
            );

          filter:
            blur(0.4px);

          opacity:
            0.9;

          z-index:
            4;
        }

        /* ===================================================
           INNER VIGNETTE
        =================================================== */

        :global(
          .card-vignette
        ) {
          position:
            absolute;

          inset:
            0;

          pointer-events:
            none;

          border-radius:
            inherit;

          background:
            radial-gradient(
              ellipse 82% 78%
                at 50% 42%,
              transparent 40%,
              rgba(
                0,
                0,
                0,
                0.08
              ) 62%,
              rgba(
                0,
                0,
                0,
                0.40
              ) 100%
            );

          box-shadow:
            inset 0 0 45px
              rgba(
                0,
                0,
                0,
                0.38
              ),

            inset 0 0 0 1px
              rgba(
                255,
                255,
                255,
                0.025
              );

          z-index:
            4;
        }

        /* ===================================================
           CONTENT
        =================================================== */

        :global(
          .card-top
        ) {
          position:
            relative;

          flex-shrink:
            0;

          z-index:
            10;
        }

        :global(
          .card-num
        ) {
          font-family:
            "Courier New",
            monospace;

          font-size:
            12px;

          font-weight:
            600;

          letter-spacing:
            0.15em;

          color:
            rgba(
              255,
              255,
              255,
              0.48
            );
        }

        :global(
          .card-content
        ) {
          position:
            relative;

          margin-top:
            auto;

          z-index:
            10;
        }

        /* ===================================================
           METRIC
        =================================================== */

        :global(
          .card-metric
        ) {
          font-family:
            var(
              --font-jakarta
            ),
            sans-serif;

          font-size:
            40px;

          font-weight:
            800;

          letter-spacing:
            -0.02em;

          line-height:
            1;

          color:
            #f5f5f5;

          text-shadow:
            0 1px 10px
              rgba(
                255,
                255,
                255,
                0.09
              );
        }

        :global(
          .card-metric-label
        ) {
          margin-top:
            8px;

          font-family:
            var(
              --font-jakarta
            ),
            sans-serif;

          font-size:
            16px;

          font-weight:
            700;

          letter-spacing:
            0.02em;

          text-transform:
            uppercase;

          color:
            rgba(
              255,
              255,
              255,
              0.94
            );
        }

        /* ===================================================
           FOOTER
        =================================================== */

        :global(
          .card-footer
        ) {
          display:
            flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap:
            12px;

          margin-top:
            20px;

          padding-top:
            16px;

          border-top:
            1px solid
            rgba(
              255,
              255,
              255,
              0.09
            );
        }

        :global(
          .card-text
        ) {
          font-size:
            13px;

          line-height:
            1.5;

          color:
            rgba(
              255,
              255,
              255,
              0.52
            );
        }

        /* ===================================================
           ARROW
        =================================================== */

        :global(
          .card-arrow
        ) {
          flex-shrink:
            0;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          width:
            28px;

          height:
            28px;

          border-radius:
            50%;

          background:
            radial-gradient(
              circle at 35% 25%,
              rgba(
                255,
                255,
                255,
                0.14
              ),
              rgba(
                255,
                255,
                255,
                0.035
              ) 55%,
              rgba(
                0,
                0,
                0,
                0.18
              )
            );

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.13
            );

          color:
            rgba(
              255,
              255,
              255,
              0.58
            );

          font-family:
            var(--font-jakarta),
            sans-serif;

          font-size:
            13px;

          font-weight:
            700;

          box-shadow:
            inset 0 1px 0
              rgba(
                255,
                255,
                255,
                0.10
              ),

            0 4px 14px
              rgba(
                0,
                0,
                0,
                0.40
              );
        }

        /* ===================================================
           FEATURED CARD
        =================================================== */

        :global(
          .card-featured
        ) {
          border-color:
            rgba(
              210,
              230,
              205,
              0.25
            );

          background:

            radial-gradient(
              ellipse 80% 68%
                at 18% 5%,
              rgba(
                250,
                253,
                255,
                0.25
              ) 0%,
              rgba(
                220,
                232,
                224,
                0.11
              ) 20%,
              transparent 60%
            ),

            radial-gradient(
              ellipse 85% 90%
                at 90% 88%,
              rgba(
                150,
                230,
                60,
                0.24
              ) 0%,
              rgba(
                130,
                220,
                50,
                0.11
              ) 30%,
              transparent 66%
            ),

            linear-gradient(
              145deg,
              #010101 0%,
              #090909 34%,
              #030403 68%,
              #0a0d08 100%
            );

          box-shadow:
            0 34px 82px
              rgba(
                0,
                0,
                0,
                0.82
              ),

            0 12px 30px
              rgba(
                0,
                0,
                0,
                0.55
              ),

            inset 0 1px 0
              rgba(
                255,
                255,
                255,
                0.15
              ),

            inset 0 -1px 0
              rgba(
                255,
                255,
                255,
                0.03
              );
        }

        /* ===================================================
           FEATURED ARROW
        =================================================== */

        :global(
          .card-arrow-accent
        ) {
          background:
            radial-gradient(
              circle at 35% 25%,
              rgba(
                255,
                255,
                255,
                0.18
              ),
              rgba(
                155,
                225,
                70,
                0.12
              ) 45%,
              rgba(
                120,
                190,
                60,
                0.06
              ) 70%,
              rgba(
                0,
                0,
                0,
                0.14
              )
            );

          border-color:
            rgba(
              205,
              230,
              195,
              0.26
            );

          color:
            rgba(
              240,
              248,
              232,
              0.90
            );

          box-shadow:
            inset 0 1px 0
              rgba(
                255,
                255,
                255,
                0.13
              ),

            0 4px 16px
              rgba(
                0,
                0,
                0,
                0.46
              );
        }

        /* ===================================================
           HOVER
        =================================================== */

        :global(
          .stage-card:hover
        ) {
          border-color:
            rgba(
              235,
              245,
              250,
              0.28
            );

          box-shadow:
            0 36px 82px
              rgba(
                0,
                0,
                0,
                0.82
              ),

            0 12px 32px
              rgba(
                0,
                0,
                0,
                0.55
              ),

            inset 0 1px 0
              rgba(
                255,
                255,
                255,
                0.14
              ),

            inset 0 -1px 0
              rgba(
                255,
                255,
                255,
                0.03
              );
        }

        :global(
          .card-featured:hover
        ) {
          border-color:
            rgba(
              215,
              240,
              205,
              0.34
            );
        }

        /* ===================================================
           RESPONSIVE
        =================================================== */

        @media (
          max-width: 1300px
        ) {
          .about-inner {
            max-width:
              100%;
          }

          .about-title-line {
            font-size:
              48px;
          }
        }

        @media (
          max-width: 900px
        ) {
          :global(
            .cards-section
          ) {
            height:
              400px;
          }

          :global(
            .stage-card
          ) {
            width:
              min(
                300px,
                80vw
              );
          }
        }

        @media (
          max-width: 640px
        ) {
          .about {
            padding:
              60px 16px 60px;
          }

          .about-title-line {
            font-size:
              32px;
          }

          :global(
            .cards-section
          ) {
            height:
              340px;
          }

          :global(
            .stage-card
          ) {
            min-height:
              260px;

            padding:
              22px;
          }

          :global(
            .card-metric
          ) {
            font-size:
              34px;
          }
        }

        /* ===================================================
           MOBILE STACKED CARD LAYOUT
           Driven by JS (isMobileLayout), matching the 640px
           breakpoint above. Three ~300px-wide cards cannot
           spread apart on a ~360-400px screen without
           overlapping — no offset math fixes that, so below
           this width the cards render in normal document flow
           as a simple vertical stack instead of the desktop
           scroll-driven spread.
        =================================================== */

        :global(.cards-section-mobile) {
          height: auto !important;
          padding: 24px 0;
        }

        :global(.cards-container-mobile) {
          flex-direction: column !important;
          align-items: center;
          height: auto !important;
          gap: 20px;
        }

        :global(.stage-card-mobile) {
          position: relative !important;
          left: auto !important;
          right: auto !important;
          top: auto !important;
          bottom: auto !important;
          width: min(360px, 92vw) !important;
          margin: 0 auto;
        }
      `}</style>
    </section>
  );
}