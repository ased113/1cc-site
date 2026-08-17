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
const FRAME_INTERVAL = 1000 / 30;

/* ============================================================
   DATA
============================================================ */

interface DayPoint {
  label: string;
  leads: number;
  approved: number;
  conversion: number;

  /*
   * Условный baseline "до 1CC".
   * Замени на реальные показатели,
   * когда они будут доступны.
   */
  beforeConversion: number;
}

const DATA: DayPoint[] = [
  {
    label: "TUE",
    leads: 120,
    approved: 82,
    conversion: 68.3,
    beforeConversion: 41.2,
  },
  {
    label: "WED",
    leads: 850,
    approved: 592,
    conversion: 69.6,
    beforeConversion: 43.7,
  },
  {
    label: "THU",
    leads: 1750,
    approved: 1232,
    conversion: 70.4,
    beforeConversion: 45.1,
  },
  {
    label: "FRI",
    leads: 2400,
    approved: 1716,
    conversion: 71.5,
    beforeConversion: 46.3,
  },
  {
    label: "SAT",
    leads: 1050,
    approved: 744,
    conversion: 70.9,
    beforeConversion: 44.8,
  },
  {
    label: "SUN",
    leads: 2050,
    approved: 1472,
    conversion: 71.8,
    beforeConversion: 47.0,
  },
  {
    label: "MON",
    leads: 2418,
    approved: 1742,
    conversion: 72.1,
    beforeConversion: 48.1,
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
     HOVER METRICS
  ========================================================== */

  const beforeConversion =
    hovered?.beforeConversion ??
    0;

  const afterConversion =
    hovered?.conversion ??
    0;

  const uplift =
    afterConversion -
    beforeConversion;

  const beforeApproved =
    hovered
      ? Math.round(
          hovered.leads *
            (beforeConversion /
              100)
        )
      : 0;

  const approvedDelta =
    hovered
      ? hovered.approved -
        beforeApproved
      : 0;

  /* ==========================================================
     30 FPS ANIMATION LOOP
  ========================================================== */

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let rafId = 0;
    let stopped = false;

    const startTime =
      performance.now();

    let lastFrame =
      startTime;

    function render(
      now: number
    ) {
      if (stopped) {
        return;
      }

      const delta =
        now -
        lastFrame;

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

      const points =
        getCurrentPoints(
          elapsed
        );

      const path =
        smoothPath(
          points
        );

      const area =
        makeAreaPath(
          points
        );

      /* ======================================================
         PATHS
      ====================================================== */

      areaRef.current?.setAttribute(
        "d",
        area
      );

      deepShadowRef.current?.setAttribute(
        "d",
        path
      );

      mediumShadowRef.current?.setAttribute(
        "d",
        path
      );

      closeShadowRef.current?.setAttribute(
        "d",
        path
      );

      coreRef.current?.setAttribute(
        "d",
        path
      );

      hotRef.current?.setAttribute(
        "d",
        path
      );

      /* ======================================================
         POINTS
      ====================================================== */

      const pulse =
        1 +
        Math.sin(
          elapsed *
            0.0024
        ) *
          0.045;

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
                  points.length - 1
                    ? 8.2
                    : 6.8
                ) * pulse
              )
            );
          }

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

    rafId =
      requestAnimationFrame(
        render
      );

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

      <div className="pr-chart-outer">
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
              {/* AREA */}

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

              {/* POINT GLOW */}

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

            {/* GRID */}

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

            {/* Y LABELS */}

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

            {/* AREA */}

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

            {/* DEEP SHADOW */}

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

            {/* MEDIUM SHADOW */}

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

            {/* CLOSE SHADOW */}

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

            {/* CORE */}

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

            {/* HOT CORE */}

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

            {/* POINTS */}

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
              COMPACT PREMIUM TOOLTIP
          ==================================================== */}

          {hovered && (
            <motion.div
              key={
                hovered.label
              }
              initial={{
                opacity: 0,
                y: 7,
                scale: 0.975,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration:
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
                    ? "translate(-100%, calc(-100% - 22px))"
                    : isFirstHovered
                    ? "translate(0%, calc(-100% - 22px))"
                    : "translate(-50%, calc(-100% - 22px))",

                width:
                  258,

                padding:
                  "13px 14px 12px",

                background:
                  "radial-gradient(circle at 88% 8%, rgba(185,255,70,0.045), transparent 35%), linear-gradient(145deg, rgba(15,18,14,0.975), rgba(5,7,6,0.985))",

                border:
                  "1px solid rgba(200,255,0,0.14)",

                borderRadius:
                  12,

                boxShadow:
                  "0 22px 58px rgba(0,0,0,0.76), 0 0 26px rgba(150,205,30,0.055), inset 0 1px 0 rgba(255,255,255,0.055)",

                backdropFilter:
                  "blur(16px)",

                WebkitBackdropFilter:
                  "blur(16px)",

                pointerEvents:
                  "none",

                zIndex:
                  20,

                textAlign:
                  "left",

                color:
                  "#fff",
              }}
            >
              {/* TOP MICRO HEADER */}

              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  marginBottom:
                    12,
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      7,
                  }}
                >
                  <span
                    style={{
                      width:
                        5,

                      height:
                        5,

                      borderRadius:
                        "50%",

                      background:
                        "rgba(200,255,0,0.78)",

                      boxShadow:
                        "0 0 9px rgba(200,255,0,0.3)",
                    }}
                  />

                  <span
                    style={{
                      fontFamily:
                        "'Courier New', monospace",

                      fontSize:
                        10,

                      letterSpacing:
                        "0.16em",

                      color:
                        "rgba(255,255,255,0.42)",

                      textTransform:
                        "uppercase",
                    }}
                  >
                    {hovered.label}
                  </span>
                </div>

                <span
                  style={{
                    fontFamily:
                      "'Courier New', monospace",

                    fontSize:
                      10,

                    color:
                      "#dfff8a",

                    letterSpacing:
                      "0.02em",
                  }}
                >
                  ↑ +
                  {uplift.toFixed(
                    1
                  )}
                  pp
                </span>
              </div>

              {/* COMPARISON */}

              <div
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "1fr 28px 1fr",

                  alignItems:
                    "center",

                  gap:
                    7,

                  padding:
                    "10px 0 11px",

                  borderTop:
                    "1px solid rgba(255,255,255,0.055)",

                  borderBottom:
                    "1px solid rgba(255,255,255,0.055)",
                }}
              >
                {/* BEFORE */}

                <div>
                  <div
                    style={{
                      fontFamily:
                        "'Courier New', monospace",

                      fontSize:
                        8,

                      letterSpacing:
                        "0.11em",

                      color:
                        "rgba(255,255,255,0.30)",

                      textTransform:
                        "uppercase",

                      marginBottom:
                        5,
                    }}
                  >
                    ДО 1CC
                  </div>

                  <div
                    style={{
                      fontFamily:
                        "var(--font-jakarta), Inter, sans-serif",

                      fontSize:
                        26,

                      lineHeight:
                        1,

                      fontWeight:
                        700,

                      letterSpacing:
                        "-0.04em",

                      color:
                        "rgba(255,255,255,0.54)",
                    }}
                  >
                    {beforeConversion.toFixed(
                      1
                    )}
                    %
                  </div>

                  <div
                    style={{
                      marginTop:
                        4,

                      fontSize:
                        9,

                      color:
                        "rgba(255,255,255,0.25)",
                    }}
                  >
                    conversion
                  </div>
                </div>

                {/* ARROW */}

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    color:
                      "rgba(255,255,255,0.19)",

                    fontSize:
                      16,
                  }}
                >
                  →
                </div>

                {/* AFTER */}

                <div
                  style={{
                    textAlign:
                      "right",
                  }}
                >
                  <div
                    style={{
                      fontFamily:
                        "'Courier New', monospace",

                      fontSize:
                        8,

                      letterSpacing:
                        "0.11em",

                      color:
                        "rgba(220,245,175,0.54)",

                      textTransform:
                        "uppercase",

                      marginBottom:
                        5,
                    }}
                  >
                    З 1CC
                  </div>

                  <div
                    style={{
                      fontFamily:
                        "var(--font-jakarta), Inter, sans-serif",

                      fontSize:
                        26,

                      lineHeight:
                        1,

                      fontWeight:
                        800,

                      letterSpacing:
                        "-0.04em",

                      color:
                        "#fff",

                      textShadow:
                        "0 0 18px rgba(200,255,0,0.09)",
                    }}
                  >
                    {afterConversion.toFixed(
                      1
                    )}
                    %
                  </div>

                  <div
                    style={{
                      marginTop:
                        4,

                      fontSize:
                        9,

                      color:
                        "rgba(210,240,160,0.48)",
                    }}
                  >
                    conversion
                  </div>
                </div>
              </div>

              {/* LEADS / APPROVED */}

              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  padding:
                    "10px 0 8px",

                  borderBottom:
                    "1px solid rgba(255,255,255,0.045)",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "baseline",

                    gap:
                      7,
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "'Courier New', monospace",

                      fontSize:
                        8,

                      letterSpacing:
                        "0.11em",

                      color:
                        "rgba(255,255,255,0.28)",

                      textTransform:
                        "uppercase",
                    }}
                  >
                    leads
                  </span>

                  <span
                    style={{
                      fontSize:
                        13,

                      fontWeight:
                        700,

                      color:
                        "rgba(255,255,255,0.82)",
                    }}
                  >
                    {(
                      hovered.leads /
                      1000
                    ).toFixed(
                      hovered.leads >=
                        1000
                        ? 1
                        : 0
                    )}
                    K
                  </span>
                </div>

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "baseline",

                    gap:
                      7,
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "'Courier New', monospace",

                      fontSize:
                        8,

                      letterSpacing:
                        "0.11em",

                      color:
                        "rgba(210,240,160,0.34)",

                      textTransform:
                        "uppercase",
                    }}
                  >
                    approved
                  </span>

                  <span
                    style={{
                      fontSize:
                        13,

                      fontWeight:
                        700,

                      color:
                        "#dfff8a",
                    }}
                  >
                    {(
                      hovered.approved /
                      1000
                    ).toFixed(
                      hovered.approved >=
                        1000
                        ? 1
                        : 0
                    )}
                    K
                  </span>
                </div>
              </div>

              {/* APPROVED DELTA */}

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                  paddingTop:
                    9,
                }}
              >
                <span
                  style={{
                    fontSize:
                      9,

                    color:
                      "rgba(255,255,255,0.26)",
                  }}
                >
                  Approved
                </span>

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      7,
                  }}
                >
                  <span
                    style={{
                      fontSize:
                        10,

                      color:
                        "rgba(255,255,255,0.34)",
                    }}
                  >
                    {beforeApproved.toLocaleString(
                      "en-US"
                    )}
                    {" → "}
                    {hovered.approved.toLocaleString(
                      "en-US"
                    )}
                  </span>

                  <span
                    style={{
                      fontSize:
                        10,

                      fontWeight:
                        700,

                      color:
                        "rgba(200,255,0,0.72)",
                    }}
                  >
                    +
                    {approvedDelta.toLocaleString(
                      "en-US"
                    )}
                  </span>
                </div>
              </div>

              {/* CONNECTOR */}

              <div
                style={{
                  position:
                    "absolute",

                  left:
                    isLastHovered
                      ? "auto"
                      : isFirstHovered
                      ? 24
                      : "50%",

                  right:
                    isLastHovered
                      ? 24
                      : "auto",

                  bottom:
                    -16,

                  width:
                    1,

                  height:
                    16,

                  background:
                    "linear-gradient(to bottom, rgba(200,255,0,0.30), rgba(200,255,0,0))",

                  transform:
                    isLastHovered
                      ? "none"
                      : "translateX(-50%)",
                }}
              />
            </motion.div>
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
      ====================================================== */}

      <style jsx>{`
        .pr-chart-outer {
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

          contain:
            layout
            style;
        }

        .pr-chart-outer svg {
          overflow:
            visible;

          contain:
            layout
            style;
        }

        @media (max-width: 700px) {
          .pr-chart-outer {
            margin-top:
              56px;
          }

          .pr-y-axis {
            display:
              none;
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