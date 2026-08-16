"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  useInView,
} from "framer-motion";

/* ============================================================
   1CC — PROOF / RESULTS
============================================================ */

const LIME = "#c8ff00";
const LIME_BRIGHT = "#d8ff00";
const LIME_HOT = "#efffa0";

const SECTION_PAD_X = 24;

/*
  The chart is intentionally rendered at approximately 30 FPS.
  This keeps the organic motion while reducing the amount of
  SVG/filter work performed by the browser during scrolling.
*/
const FRAME_INTERVAL = 1000 / 30;

/* ============================================================
   DATA
============================================================ */

interface DayPoint {
  label: string;
  leads: number;
  approved: number;
  conversion: number;
}

const DATA: DayPoint[] = [
  {
    label: "TUE",
    leads: 120,
    approved: 82,
    conversion: 68.3,
  },
  {
    label: "WED",
    leads: 850,
    approved: 592,
    conversion: 69.6,
  },
  {
    label: "THU",
    leads: 1750,
    approved: 1232,
    conversion: 70.4,
  },
  {
    label: "FRI",
    leads: 2400,
    approved: 1716,
    conversion: 71.5,
  },
  {
    label: "SAT",
    leads: 1050,
    approved: 744,
    conversion: 70.9,
  },
  {
    label: "SUN",
    leads: 2050,
    approved: 1472,
    conversion: 71.8,
  },
  {
    label: "MON",
    leads: 2418,
    approved: 1742,
    conversion: 72.1,
  },
];

/* ============================================================
   CHART GEOMETRY
============================================================ */

const CHART_W = 1900;
const CHART_H = 560;

const PAD_LEFT = 64;
const PAD_RIGHT = 0;

const PAD_TOP = 40;
const PAD_BOTTOM = 60;

const Y_MAX = 2500;
const Y_MIN = 0;

const Y_TICKS = [
  0,
  500,
  1000,
  1500,
  2000,
  2500,
];

/* ============================================================
   Y SCALE
============================================================ */

function yFor(value: number) {
  const usableH =
    CHART_H -
    PAD_TOP -
    PAD_BOTTOM;

  const ratio =
    (value - Y_MIN) /
    (Y_MAX - Y_MIN);

  return (
    PAD_TOP +
    usableH -
    ratio * usableH
  );
}

/* ============================================================
   POINT TYPES
============================================================ */

interface PositionedPoint
  extends DayPoint {
  x: number;
  y: number;
}

/* ============================================================
   BASE POINTS
============================================================ */

function layout(
  data: DayPoint[]
): PositionedPoint[] {
  const usableW =
    CHART_W -
    PAD_LEFT -
    PAD_RIGHT;

  return data.map(
    (item, index) => ({
      ...item,

      x:
        PAD_LEFT +
        (usableW /
          (data.length - 1)) *
          index,

      y:
        yFor(item.leads),
    })
  );
}

const BASE_POINTS =
  layout(DATA);

/* ============================================================
   MORPH POSES
============================================================ */

function makePose(
  offsets: number[]
): PositionedPoint[] {
  return BASE_POINTS.map(
    (point, index) => ({
      ...point,

      x:
        point.x +
        (
          index === 0 ||
          index ===
            BASE_POINTS.length - 1
            ? 0
            : offsets[index] *
              0.35
        ),

      y:
        point.y +
        offsets[index],
    })
  );
}

const POSES =
  [
    makePose([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]),

    makePose([
      -5,
      -14,
      10,
      -20,
      24,
      -11,
      -5,
    ]),

    makePose([
      8,
      16,
      -13,
      16,
      -25,
      14,
      7,
    ]),

    makePose([
      -8,
      7,
      20,
      -14,
      17,
      -21,
      -4,
    ]),

    makePose([
      4,
      -9,
      -6,
      11,
      -9,
      7,
      -3,
    ]),
  ] as PositionedPoint[][];

/* ============================================================
   EASING
============================================================ */

function smoothStep(
  value: number
) {
  const x =
    Math.max(
      0,
      Math.min(1, value)
    );

  return (
    x *
    x *
    (3 - 2 * x)
  );
}

function organicEase(
  value: number
) {
  const s =
    smoothStep(value);

  return (
    s +
    Math.sin(
      s * Math.PI
    ) *
      0.035
  );
}

/* ============================================================
   GET CURRENT MORPHED POINTS
============================================================ */

function getCurrentPoints(
  time: number
): PositionedPoint[] {
  const cycle = 11000;

  const normalized =
    (time % cycle) /
    cycle;

  const segments =
    POSES.length - 1;

  const raw =
    normalized *
    segments;

  const index =
    Math.min(
      segments - 1,
      Math.floor(raw)
    );

  const local =
    raw - index;

  const eased =
    organicEase(local);

  const a =
    POSES[index];

  const b =
    POSES[index + 1];

  return a.map(
    (point, i) => ({
      ...point,

      x:
        point.x +
        (
          b[i].x -
          point.x
        ) *
          eased,

      y:
        point.y +
        (
          b[i].y -
          point.y
        ) *
          eased,
    })
  );
}

/* ============================================================
   SVG PATH
============================================================ */

function smoothPath(
  points: {
    x: number;
    y: number;
  }[]
) {
  if (
    points.length < 2
  ) {
    return "";
  }

  let d =
    `M ${points[0].x} ${points[0].y}`;

  for (
    let i = 0;
    i <
    points.length - 1;
    i++
  ) {
    const a =
      points[i];

    const b =
      points[i + 1];

    const midX =
      (a.x + b.x) / 2;

    d +=
      ` C ${midX} ${a.y},` +
      ` ${midX} ${b.y},` +
      ` ${b.x} ${b.y}`;
  }

  return d;
}

function makeAreaPath(
  points: {
    x: number;
    y: number;
  }[]
) {
  const line =
    smoothPath(points);

  const last =
    points[
      points.length - 1
    ];

  const first =
    points[0];

  return (
    `${line}` +
    ` L ${last.x} ${
      CHART_H -
      PAD_BOTTOM
    }` +
    ` L ${first.x} ${
      CHART_H -
      PAD_BOTTOM
    } Z`
  );
}

/* ============================================================
   FORMAT
============================================================ */

function formatK(
  value: number
) {
  if (value === 0) {
    return "0";
  }

  return value >= 1000
    ? `${(
        value / 1000
      ).toFixed(1)}K`
    : `${value}`;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function ProofResults() {
  const sectionRef =
    useRef<HTMLDivElement>(
      null
    );

  /*
    IMPORTANT:
    "once: true" has intentionally been removed.

    The chart animation now stops when the section leaves
    the viewport and starts again when the section comes back.
  */
  const isInView =
    useInView(
      sectionRef,
      {
        amount: 0.1,
      }
    );

  /* ==========================================================
     SVG REFS
  ========================================================== */

  const areaRef =
    useRef<SVGPathElement | null>(
      null
    );

  const deepShadowRef =
    useRef<SVGPathElement | null>(
      null
    );

  const mediumShadowRef =
    useRef<SVGPathElement | null>(
      null
    );

  const closeShadowRef =
    useRef<SVGPathElement | null>(
      null
    );

  const coreRef =
    useRef<SVGPathElement | null>(
      null
    );

  const hotRef =
    useRef<SVGPathElement | null>(
      null
    );

  const pointRefs =
    useRef<
      Array<
        SVGCircleElement | null
      >
    >([]);

  const pointCoreRefs =
    useRef<
      Array<
        SVGCircleElement | null
      >
    >([]);

  const pointGlowRefs =
    useRef<
      Array<
        SVGCircleElement | null
      >
    >([]);

  /* ==========================================================
     HOVER
  ========================================================== */

  const [
    hoveredLabel,
    setHoveredLabel,
  ] = useState<
    string | null
  >(null);

  const hoveredIndex =
    hoveredLabel
      ? BASE_POINTS.findIndex(
          (point) =>
            point.label ===
            hoveredLabel
        )
      : -1;

  const hovered =
    hoveredIndex >= 0
      ? BASE_POINTS[
          hoveredIndex
        ]
      : null;

  const isFirstHovered =
    hoveredIndex === 0;

  const isLastHovered =
    hoveredIndex ===
    BASE_POINTS.length - 1;

  /* ==========================================================
     OPTIMIZED ANIMATION LOOP
  ========================================================== */

  useEffect(() => {
    /*
      When the section isn't visible, do absolutely nothing.

      This is one of the biggest performance improvements:
      the graph no longer keeps animating in the background
      while the user is looking at another page/section.
    */
    if (!isInView) {
      return;
    }

    let rafId = 0;
    let stopped = false;

    const startTime =
      performance.now();

    let lastFrame =
      startTime;

    /*
      This is intentionally ~30 FPS.

      requestAnimationFrame itself can fire around 60 times
      per second, but we only perform the expensive SVG/path
      calculations every ~33ms.
    */
    function render(
      now: number
    ) {
      if (stopped) {
        return;
      }

      const delta =
        now -
        lastFrame;

      /*
        Skip the expensive work on the extra RAF frames.

        The browser can still synchronize the loop with the
        display, but the heavy path/filter updates happen
        only around 30 times per second.
      */
      if (
        delta <
        FRAME_INTERVAL
      ) {
        rafId =
          requestAnimationFrame(
            render
          );

        return;
      }

      lastFrame = now;

      const elapsed =
        now -
        startTime;

      /*
        Calculate the animated points once.
      */
      const points =
        getCurrentPoints(
          elapsed
        );

      /*
        Build the two paths once and reuse them for all
        corresponding SVG elements.
      */
      const path =
        smoothPath(
          points
        );

      const area =
        makeAreaPath(
          points
        );

      /* ======================================================
         UPDATE AREA
      ====================================================== */

      if (
        areaRef.current
      ) {
        areaRef.current.setAttribute(
          "d",
          area
        );
      }

      /* ======================================================
         UPDATE SHADOW PATHS
      ====================================================== */

      if (
        deepShadowRef.current
      ) {
        deepShadowRef.current.setAttribute(
          "d",
          path
        );
      }

      if (
        mediumShadowRef.current
      ) {
        mediumShadowRef.current.setAttribute(
          "d",
          path
        );
      }

      if (
        closeShadowRef.current
      ) {
        closeShadowRef.current.setAttribute(
          "d",
          path
        );
      }

      if (
        coreRef.current
      ) {
        coreRef.current.setAttribute(
          "d",
          path
        );
      }

      if (
        hotRef.current
      ) {
        hotRef.current.setAttribute(
          "d",
          path
        );
      }

      /* ======================================================
         POINT PULSE
      ====================================================== */

      const pulse =
        1 +
        Math.sin(
          elapsed *
            0.0024
        ) *
          0.045;

      /* ======================================================
         UPDATE POINTS
      ====================================================== */

      points.forEach(
        (
          point,
          index
        ) => {
          const glow =
            pointGlowRefs
              .current[index];

          const core =
            pointCoreRefs
              .current[index];

          const hit =
            pointRefs
              .current[index];

          /* -----------------------------------------------
             GLOW
          ------------------------------------------------ */

          if (glow) {
            glow.setAttribute(
              "cx",
              String(
                point.x
              )
            );

            glow.setAttribute(
              "cy",
              String(
                point.y
              )
            );

            glow.setAttribute(
              "r",
              String(
                (
                  index ===
                  points.length -
                    1
                    ? 8.2
                    : 6.8
                ) *
                  pulse
              )
            );
          }

          /* -----------------------------------------------
             CORE
          ------------------------------------------------ */

          if (core) {
            core.setAttribute(
              "cx",
              String(
                point.x
              )
            );

            core.setAttribute(
              "cy",
              String(
                point.y
              )
            );
          }

          /* -----------------------------------------------
             HIT AREA
          ------------------------------------------------ */

          if (hit) {
            hit.setAttribute(
              "cx",
              String(
                point.x
              )
            );

            hit.setAttribute(
              "cy",
              String(
                point.y
              )
            );
          }
        }
      );

      rafId =
        requestAnimationFrame(
          render
        );
    }

    /*
      Start the animation.
    */
    rafId =
      requestAnimationFrame(
        render
      );

    /*
      Cleanup is important:
      whenever isInView becomes false, this effect is destroyed
      and the animation loop is cancelled immediately.
    */
    return () => {
      stopped = true;

      if (rafId) {
        cancelAnimationFrame(
          rafId
        );
      }
    };
  }, [isInView]);

  /* ==========================================================
     JSX
  ========================================================== */

  return (
    <section
      ref={sectionRef}
      className="proof-section"
      style={{
        position:
          "relative",

        width:
          "100%",

        background:
          "#000",

        color:
          "#fff",

        padding:
          `180px ${SECTION_PAD_X}px`,

        overflow:
          "hidden",
      }}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        style={{
          maxWidth:
            1120,

          margin:
            "0 auto",

          textAlign:
            "center",
        }}
      >
        {/* ==================================================
            PROOF / RESULTS
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration:
              0.6,

            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
          style={{
            display:
              "flex",

            justifyContent:
              "center",

            marginBottom:
              28,
          }}
        >
          <span
            style={{
              fontFamily:
                "'Courier New', monospace",

              fontSize:
                11,

              letterSpacing:
                "0.16em",

              fontWeight:
                600,

              color:
                "rgba(255,255,255,0.55)",

              textTransform:
                "uppercase",
            }}
          >
            Proof / Results
          </span>
        </motion.div>

        {/* ==================================================
            HEADLINE
        ================================================== */}

        <motion.h2
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration:
              0.7,

            delay:
              0.05,

            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
          style={{
            fontSize:
              "clamp(32px, 4.4vw, 56px)",

            lineHeight:
              1.08,

            fontWeight:
              600,

            letterSpacing:
              "-0.02em",

            margin:
              "0 auto",

            maxWidth:
              720,
          }}
        >
          <span
            style={{
              color:
                "rgba(255,255,255,0.4)",
            }}
          >
            Результат видно не в презентації.
          </span>

          <br />

          <span
            style={{
              color:
                "#fff",
            }}
          >
            Його видно в цифрах.
          </span>
        </motion.h2>

        {/* ==================================================
            SUBTEXT
        ================================================== */}

        <motion.p
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration:
              0.6,

            delay:
              0.15,

            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
          style={{
            margin:
              "20px auto 0",

            maxWidth:
              560,

            fontSize:
              17,

            lineHeight:
              1.6,

            color:
              "rgba(255,255,255,0.55)",
          }}
        >
          Ми не просто передаємо ліди. Ми
          контролюємо, що відбувається з ними
          після передачі.
        </motion.p>
      </div>

      {/* ======================================================
          CHART
      ====================================================== */}

      <div
        className="pr-chart-outer"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration:
              0.8,

            delay:
              0.2,

            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
          style={{
            position:
              "relative",

            overflow:
              "visible",
          }}
        >
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="none"
            style={{
              width:
                "100%",

              height:
                "auto",

              display:
                "block",

              overflow:
                "visible",
            }}
          >
            <defs>
              {/* ==================================================
                  AREA GRADIENT
              ================================================== */}

              <linearGradient
                id="chartGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="rgba(140,220,0,0.30)"
                />

                <stop
                  offset="10%"
                  stopColor="rgba(120,195,0,0.19)"
                />

                <stop
                  offset="24%"
                  stopColor="rgba(95,160,0,0.10)"
                />

                <stop
                  offset="42%"
                  stopColor="rgba(70,125,0,0.052)"
                />

                <stop
                  offset="62%"
                  stopColor="rgba(45,85,0,0.024)"
                />

                <stop
                  offset="80%"
                  stopColor="rgba(20,45,0,0.009)"
                />

                <stop
                  offset="100%"
                  stopColor="rgba(0,0,0,0)"
                />
              </linearGradient>

              {/* ==================================================
                  POINT GLOW
                  KEPT EXACTLY AS BEFORE
              ================================================== */}

              <filter
                id="pointGlow"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur
                  stdDeviation="3.5"
                  result="blur"
                />

                <feMerge>
                  <feMergeNode
                    in="blur"
                  />

                  <feMergeNode
                    in="SourceGraphic"
                  />
                </feMerge>
              </filter>
            </defs>

            {/* ==================================================
                GRID
            ================================================== */}

            {Y_TICKS.map(
              (value) => (
                <line
                  key={value}
                  x1={
                    PAD_LEFT
                  }
                  x2={
                    CHART_W
                  }
                  y1={yFor(
                    value
                  )}
                  y2={yFor(
                    value
                  )}
                  stroke="rgba(255,255,255,0.014)"
                  strokeWidth={
                    1
                  }
                />
              )
            )}

            {/* ==================================================
                Y LABELS
                Wrapped in a group so it can be hidden on mobile —
                at narrow viewport widths the SVG scales down
                enough that fontSize 14 (in a 1900-unit viewBox)
                would render as a couple of illegible pixels.
            ================================================== */}

            <g className="pr-y-axis">
              {Y_TICKS.map(
                (value) => (
                  <text
                    key={value}
                    x={
                      PAD_LEFT -
                      14
                    }
                    y={yFor(
                      value
                    )}
                    dy="0.32em"
                    textAnchor="end"
                    fontSize={14}
                    fill="rgba(255,255,255,0.3)"
                  >
                    {formatK(
                      value
                    )}
                  </text>
                )
              )}
            </g>

            {/* ==================================================
                AREA
            ================================================== */}

            <path
              ref={
                areaRef
              }
              d={makeAreaPath(
                BASE_POINTS
              )}
              fill="url(#chartGradient)"
              opacity={
                isInView
                  ? 1
                  : 0
              }
            />

            {/* ==================================================
                DEEP SHADOW

                BLUR INTENTIONALLY PRESERVED:
                48px
            ================================================== */}

            <path
              ref={
                deepShadowRef
              }
              d={smoothPath(
                BASE_POINTS
              )}
              fill="none"
              stroke="#425500"
              strokeWidth={
                130
              }
              strokeLinecap="round"
              opacity={
                isInView
                  ? 0.18
                  : 0
              }
              style={{
                filter:
                  "blur(48px)",

                transform:
                  "translateY(70px)",

                transformBox:
                  "fill-box",

                transformOrigin:
                  "center",
              }}
            />

            {/* ==================================================
                MEDIUM SHADOW

                BLUR INTENTIONALLY PRESERVED:
                30px
            ================================================== */}

            <path
              ref={
                mediumShadowRef
              }
              d={smoothPath(
                BASE_POINTS
              )}
              fill="none"
              stroke="#678300"
              strokeWidth={
                82
              }
              strokeLinecap="round"
              opacity={
                isInView
                  ? 0.22
                  : 0
              }
              style={{
                filter:
                  "blur(30px)",

                transform:
                  "translateY(42px)",

                transformBox:
                  "fill-box",

                transformOrigin:
                  "center",
              }}
            />

            {/* ==================================================
                CLOSE SHADOW

                BLUR INTENTIONALLY PRESERVED:
                13px
            ================================================== */}

            <path
              ref={
                closeShadowRef
              }
              d={smoothPath(
                BASE_POINTS
              )}
              fill="none"
              stroke="#9fc700"
              strokeWidth={
                34
              }
              strokeLinecap="round"
              opacity={
                isInView
                  ? 0.30
                  : 0
              }
              style={{
                filter:
                  "blur(13px)",

                transform:
                  "translateY(15px)",

                transformBox:
                  "fill-box",

                transformOrigin:
                  "center",
              }}
            />

            {/* ==================================================
                CORE
            ================================================== */}

            <path
              ref={
                coreRef
              }
              d={smoothPath(
                BASE_POINTS
              )}
              fill="none"
              stroke={
                LIME
              }
              strokeWidth={
                2.25
              }
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={
                isInView
                  ? 1
                  : 0
              }
            />

            {/* ==================================================
                HOT CORE
            ================================================== */}

            <path
              ref={
                hotRef
              }
              d={smoothPath(
                BASE_POINTS
              )}
              fill="none"
              stroke={
                LIME_HOT
              }
              strokeWidth={
                0.65
              }
              strokeLinecap="round"
              opacity={
                isInView
                  ? 0.7
                  : 0
              }
            />

            {/* ==================================================
                POINTS
            ================================================== */}

            {BASE_POINTS.map(
              (
                point,
                index
              ) => {
                const isHovered =
                  hoveredLabel ===
                  point.label;

                const isLast =
                  index ===
                  BASE_POINTS.length -
                    1;

                return (
                  <g
                    key={
                      point.label
                    }
                    style={{
                      cursor:
                        "pointer",
                    }}
                    onMouseEnter={() =>
                      setHoveredLabel(
                        point.label
                      )
                    }
                    onMouseLeave={() =>
                      setHoveredLabel(
                        (
                          current
                        ) =>
                          current ===
                          point.label
                            ? null
                            : current
                      )
                    }
                  >
                    {/* HIT AREA */}

                    <circle
                      ref={(
                        element
                      ) => {
                        pointRefs.current[
                          index
                        ] =
                          element;
                      }}
                      cx={
                        point.x
                      }
                      cy={
                        point.y
                      }
                      r={22}
                      fill="transparent"
                    />

                    {/* GLOW */}

                    <circle
                      ref={(
                        element
                      ) => {
                        pointGlowRefs.current[
                          index
                        ] =
                          element;
                      }}
                      cx={
                        point.x
                      }
                      cy={
                        point.y
                      }
                      r={
                        isHovered
                          ? 10
                          : isLast
                          ? 8
                          : 7
                      }
                      fill={
                        LIME
                      }
                      opacity={
                        isInView
                          ? isHovered
                            ? 0.9
                            : 0.45
                          : 0
                      }
                      filter="url(#pointGlow)"
                    />

                    {/* DARK CENTER */}

                    <circle
                      ref={(
                        element
                      ) => {
                        pointCoreRefs.current[
                          index
                        ] =
                          element;
                      }}
                      cx={
                        point.x
                      }
                      cy={
                        point.y
                      }
                      r={
                        isHovered
                          ? 5
                          : 3.7
                      }
                      fill="#020400"
                      stroke={
                        LIME_BRIGHT
                      }
                      strokeWidth={
                        1.8
                      }
                      opacity={
                        isInView
                          ? 1
                          : 0
                      }
                    />
                  </g>
                );
              }
            )}
          </svg>

          {/* ====================================================
              TOOLTIP
          ==================================================== */}

          {hovered && (
            <div
              style={{
                position:
                  "absolute",

                left: `${
                  (hovered.x /
                    CHART_W) *
                  100
                }%`,

                top: `${
                  (hovered.y /
                    CHART_H) *
                  100
                }%`,

                transform:
                  isLastHovered
                    ? "translate(-100%, -122%)"
                    : isFirstHovered
                    ? "translate(0%, -122%)"
                    : "translate(-50%, -128%)",

                background:
                  "#0a0c08",

                border:
                  "1px solid rgba(163,230,53,0.3)",

                borderRadius:
                  10,

                padding:
                  "10px 13px",

                whiteSpace:
                  "nowrap",

                pointerEvents:
                  "none",

                boxShadow:
                  "0 14px 34px rgba(0,0,0,0.6), 0 0 22px rgba(120,170,0,0.13)",

                zIndex:
                  10,

                textAlign:
                  "left",
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap: 5,
                }}
              >
                {/* LEADS */}

                <div>
                  <div
                    style={{
                      fontSize:
                        14,

                      fontWeight:
                        700,

                      color:
                        "#fff",

                      lineHeight:
                        1.2,
                    }}
                  >
                    {hovered.leads.toLocaleString(
                      "en-US"
                    )}
                  </div>

                  <div
                    style={{
                      fontSize:
                        10,

                      color:
                        "rgba(255,255,255,0.45)",
                    }}
                  >
                    leads
                  </div>
                </div>

                {/* APPROVED */}

                <div>
                  <div
                    style={{
                      fontSize:
                        14,

                      fontWeight:
                        700,

                      color:
                        "#fff",

                      lineHeight:
                        1.2,
                    }}
                  >
                    {hovered.approved.toLocaleString(
                      "en-US"
                    )}
                  </div>

                  <div
                    style={{
                      fontSize:
                        10,

                      color:
                        "rgba(255,255,255,0.45)",
                    }}
                  >
                    approved
                  </div>
                </div>

                {/* CONVERSION */}

                <div>
                  <div
                    style={{
                      fontSize:
                        14,

                      fontWeight:
                        700,

                      color:
                        "#fff",

                      lineHeight:
                        1.2,
                    }}
                  >
                    {
                      hovered.conversion
                    }
                    %
                  </div>

                  <div
                    style={{
                      fontSize:
                        10,

                      color:
                        "rgba(255,255,255,0.45)",
                    }}
                  >
                    conversion
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ======================================================
          BOTTOM TEXT
      ====================================================== */}

      <div
        style={{
          maxWidth:
            1120,

          margin:
            "0 auto",

          textAlign:
            "center",
        }}
      >
        <motion.p
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration:
              0.6,

            delay:
              1.8,

            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
          style={{
            margin:
              "56px auto 0",

            maxWidth:
              560,

            fontFamily:
              "var(--font-jakarta), Inter, sans-serif",

            fontSize:
              18,

            fontWeight:
              400,

            letterSpacing:
              "-0.01em",

            lineHeight:
              1.55,

            color:
              "rgba(255,255,255,0.52)",
          }}
        >
          Кожен лід проходить через нашу
          систему контролю,
          <br />
          від першого контакту до
          підтвердженого результату.
        </motion.p>
      </div>

      {/* ======================================================
          CSS
          Plain <style> tag (not <style jsx>) — matches the fix
          already applied elsewhere in the project after
          styled-jsx's head-injection turned out unreliable in
          this dev environment. Mobile: hide the Y-axis labels
          (they'd shrink to illegible pixels) and trim the
          vertical padding/margins.
      ====================================================== */}

      <style>{`
        .proof-section .pr-chart-outer {
          width: calc(
            100% +
              ${SECTION_PAD_X * 2}px
          );

          margin:
            96px
            -${SECTION_PAD_X}px
            0;

          position:
            relative;

          overflow:
            visible;

          /*
            Helps the browser isolate the chart area as a
            separate rendering region without changing the
            actual visual design.
          */
          contain:
            layout
            style;
        }

        .proof-section .pr-chart-outer svg {
          overflow:
            visible;

          /*
            Keep the SVG itself isolated from unrelated
            page rendering where possible.
          */
          contain:
            layout
            style;
        }

        @media (max-width: 700px) {
          .proof-section {
            padding: 110px 20px 90px !important;
          }

          .proof-section .pr-chart-outer {
            margin-top: 56px;
          }

          .proof-section .pr-y-axis {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .proof-section * {
            animation:
              none !important;

            transition:
              none !important;
          }
        }
      `}</style>
    </section>
  );
}