"use client";

import React, {
  Suspense,
  useEffect,
  useRef,
} from "react";

import Navbar from "./Navbar";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Environment,
  useGLTF,
} from "@react-three/drei";

import * as THREE from "three";

/*
  LOGO SIZE

  Было примерно 4.2.
  Немного увеличиваем.
*/
const LOGO_TARGET_SIZE = 4.8;

/* =========================================================
   3D LOGO
========================================================= */

function Logo3D() {
  const groupRef =
    useRef<THREE.Group>(null);

  const { scene } =
    useGLTF("/1cc-logo.glb");

  const shaderMaterialsRef =
    useRef<
      Array<{
        // THREE.Shader is no longer exported from this
        // version of @types/three — the runtime code only
        // ever reads/writes shader.uniforms, so a permissive
        // type here is safe and avoids depending on an
        // internal three.js type name that keeps moving
        // between versions.
        shader: {
          uniforms: Record<string, { value: unknown }>;
          vertexShader: string;
          fragmentShader: string;
        };
        material: THREE.Material;
      }>
    >([]);

  /* =======================================================
     PREPARE MATERIALS
  ======================================================= */

  useEffect(() => {
    shaderMaterialsRef.current = [];

    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      const mesh =
        object as THREE.Mesh;

      const materials = Array.isArray(
        mesh.material
      )
        ? mesh.material
        : [mesh.material];

      materials.forEach((material) => {
        /*
          Работаем только с PBR.
        */

        if (
          !(
            material instanceof
              THREE.MeshStandardMaterial ||
            material instanceof
              THREE.MeshPhysicalMaterial
          )
        ) {
          return;
        }

        material.onBeforeCompile = (
          shader
        ) => {
          /* =================================================
             UNIFORMS
          ================================================= */

          shader.uniforms.uGradientTime = {
            value: 0,
          };

          /* =================================================
             VERTEX POSITION
          ================================================= */

          shader.vertexShader = `
            varying vec3 vLogoLocalPosition;
          ` + shader.vertexShader;

          shader.vertexShader =
            shader.vertexShader.replace(
              "#include <begin_vertex>",
              `
                #include <begin_vertex>

                vLogoLocalPosition = transformed;
              `
            );

          /* =================================================
             FRAGMENT HEADER
          ================================================= */

          shader.fragmentShader = `
            uniform float uGradientTime;

            varying vec3 vLogoLocalPosition;
          ` + shader.fragmentShader;

          /* =================================================
             MAIN SURFACE EFFECT

             ВАЖНО:

             Мы НЕ рисуем полосы.

             Вместо этого создаём несколько
             огромных мягких световых пятен.

             Это должно выглядеть как отражение
             цветного света на металлическом/глянцевом
             логотипе.
          ================================================= */

          shader.fragmentShader =
            shader.fragmentShader.replace(
              "#include <color_fragment>",
              `
                #include <color_fragment>

                /* =========================================
                   TIME
                ========================================= */

                float logoTime =
                  uGradientTime;

                /* =========================================
                   LOCAL POSITION
                ========================================= */

                vec3 logoPos =
                  vLogoLocalPosition;

                float lx =
                  logoPos.x;

                float ly =
                  logoPos.y;

                /* =========================================
                   PRIMARY LIGHT BLOB
                   
                   Это НЕ линия.

                   Это большое эллиптическое пятно,
                   которое медленно путешествует
                   по поверхности.
                ========================================= */

                float primaryX =
                  sin(
                    logoTime * 0.34
                  ) * 2.25;

                float primaryY =
                  sin(
                    logoTime * 0.23 + 1.8
                  ) * 0.55;

                float primaryZ =
                  cos(
                    logoTime * 0.19
                  ) * 0.15;

                vec3 primaryCenter =
                  vec3(
                    primaryX,
                    primaryY,
                    primaryZ
                  );

                vec3 primaryDelta =
                  logoPos -
                  primaryCenter;

                /*
                  Растягиваем пятно по горизонтали.

                  Поэтому оно выглядит как большой
                  мягкий свет, а не круг.
                */

                primaryDelta.x *= 0.52;
                primaryDelta.y *= 1.20;
                primaryDelta.z *= 0.85;

                float primaryDistance =
                  length(
                    primaryDelta
                  );

                /*
                  Очень мягкие края.
                */

                float primaryMask =
                  1.0 -
                  smoothstep(
                    0.20,
                    2.15,
                    primaryDistance
                  );

                /*
                  Дополнительное размытие.
                */

                primaryMask =
                  pow(
                    primaryMask,
                    1.55
                  );

                /* =========================================
                   ORGANIC DISTORTION
                   
                   Немного двигаем границу пятна,
                   чтобы оно не выглядело как идеально
                   нарисованный CSS-градиент.
                ========================================= */

                float organicWave =
                  sin(
                    lx * 1.35 +
                    logoTime * 0.55
                  ) * 0.08 +
                  sin(
                    ly * 2.10 -
                    logoTime * 0.38
                  ) * 0.06 +
                  sin(
                    (lx + ly) * 1.7 +
                    logoTime * 0.22
                  ) * 0.045;

                primaryMask =
                  clamp(
                    primaryMask +
                    organicWave,
                    0.0,
                    1.0
                  );

                /* =========================================
                   SECONDARY LIGHT BLOB

                   Второе пятно намного слабее.

                   Оно появляется с другой стороны,
                   поэтому композиция постоянно меняется.
                ========================================= */

                float secondaryX =
                  cos(
                    logoTime * 0.27 + 2.5
                  ) * 2.35;

                float secondaryY =
                  sin(
                    logoTime * 0.31
                  ) * 0.72;

                vec3 secondaryCenter =
                  vec3(
                    secondaryX,
                    secondaryY,
                    0.0
                  );

                vec3 secondaryDelta =
                  logoPos -
                  secondaryCenter;

                secondaryDelta.x *= 0.68;
                secondaryDelta.y *= 1.45;

                float secondaryDistance =
                  length(
                    secondaryDelta
                  );

                float secondaryMask =
                  1.0 -
                  smoothstep(
                    0.15,
                    1.65,
                    secondaryDistance
                  );

                secondaryMask =
                  pow(
                    secondaryMask,
                    2.1
                  );

                /*
                  Второй блик существенно слабее.
                */

                secondaryMask *= 0.32;

                /* =========================================
                   DEEP BLUE
                ========================================= */

                vec3 gradientDeepBlue =
                  vec3(
                    0.005,
                    0.018,
                    0.095
                  );

                /* =========================================
                   DEEP ELECTRIC BLUE
                ========================================= */

                vec3 gradientBlue =
                  vec3(
                    0.008,
                    0.055,
                    0.34
                  );

                /* =========================================
                   SOFT BLUE
                ========================================= */

                vec3 gradientSoftBlue =
                  vec3(
                    0.025,
                    0.14,
                    0.58
                  );

                /* =========================================
                   PREMIUM LIME

                   Не кислотный.

                   Более зелёный и спокойный,
                   похожий на референс.
                ========================================= */

                vec3 gradientLime =
                  vec3(
                    0.28,
                    0.56,
                    0.075
                  );

                /* =========================================
                   BRIGHT LIME CORE
                   
                   Используется только в самом центре
                   светового отражения.
                ========================================= */

                vec3 gradientBrightLime =
                  vec3(
                    0.42,
                    0.76,
                    0.10
                  );

                /* =========================================
                   PRIMARY COLOR GRADIENT
                   
                   Цвет зависит от положения внутри
                   светового пятна.

                   НЕ просто один цвет на весь blob.
                ========================================= */

                float primaryGradient =
                  clamp(
                    (
                      primaryDelta.x /
                      1.75
                    ) * 0.5 +
                    0.5,
                    0.0,
                    1.0
                  );

                vec3 primaryColor =
                  mix(
                    gradientDeepBlue,
                    gradientBlue,
                    smoothstep(
                      0.05,
                      0.32,
                      primaryGradient
                    )
                  );

                primaryColor =
                  mix(
                    primaryColor,
                    gradientSoftBlue,
                    smoothstep(
                      0.28,
                      0.55,
                      primaryGradient
                    )
                  );

                primaryColor =
                  mix(
                    primaryColor,
                    gradientLime,
                    smoothstep(
                      0.52,
                      0.78,
                      primaryGradient
                    )
                  );

                primaryColor =
                  mix(
                    primaryColor,
                    gradientBrightLime,
                    smoothstep(
                      0.72,
                      0.94,
                      primaryGradient
                    )
                  );

                /* =========================================
                   SECONDARY COLOR
                ========================================= */

                float secondaryGradient =
                  clamp(
                    (
                      secondaryDelta.x /
                      1.5
                    ) * 0.5 +
                    0.5,
                    0.0,
                    1.0
                  );

                vec3 secondaryColor =
                  mix(
                    gradientDeepBlue,
                    gradientSoftBlue,
                    smoothstep(
                      0.15,
                      0.60,
                      secondaryGradient
                    )
                  );

                secondaryColor =
                  mix(
                    secondaryColor,
                    gradientLime,
                    smoothstep(
                      0.58,
                      0.88,
                      secondaryGradient
                    )
                  );

                /* =========================================
                   COLOR AMOUNT
                   
                   Здесь главное отличие от прошлой версии.

                   Мы НЕ заменяем оригинальный материал.

                   Мы только слегка подкрашиваем его.
                ========================================= */

                float primaryAmount =
                  primaryMask * 0.62;

                float secondaryAmount =
                  secondaryMask * 0.48;

                float totalAmount =
                  clamp(
                    primaryAmount +
                    secondaryAmount,
                    0.0,
                    0.76
                  );

                /*
                  Смешиваем цвет с оригинальным
                  diffuseColor.

                  Благодаря этому хром/чёрный материал
                  продолжает просвечивать.
                */

                vec3 animatedSurfaceColor =
                  primaryColor *
                  primaryAmount;

                animatedSurfaceColor +=
                  secondaryColor *
                  secondaryAmount;

                /*
                  Если есть оба эффекта,
                  нормализуем их.
                */

                if (
                  totalAmount > 0.001
                ) {
                  animatedSurfaceColor /=
                    totalAmount;
                }

                diffuseColor.rgb =
                  mix(
                    diffuseColor.rgb,
                    animatedSurfaceColor,
                    totalAmount
                  );

                /* =========================================
                   SOFT SPECULAR LIGHT

                   Очень слабый дополнительный свет.

                   Он нужен, чтобы цвет выглядел
                   как отражение, а не как краска.
                ========================================= */

                float softHighlight =
                  pow(
                    primaryMask,
                    3.0
                  ) * 0.13;

                totalEmissiveRadiance +=
                  primaryColor *
                  softHighlight;

                totalEmissiveRadiance +=
                  secondaryColor *
                  secondaryMask *
                  0.055;
              `
            );

          /* =================================================
             SAVE SHADER
          ================================================= */

          shaderMaterialsRef.current.push({
            shader,
            material,
          });

          material.customProgramCacheKey =
            () =>
              "animated-logo-soft-reflection-v7";
        };

        material.needsUpdate = true;
      });
    });

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      shaderMaterialsRef.current = [];
    };
  }, [scene]);

  /* =======================================================
     CENTER + SCALE
  ======================================================= */

  useEffect(() => {
    if (!groupRef.current) {
      return;
    }

    const box =
      new THREE.Box3().setFromObject(
        scene
      );

    const size =
      new THREE.Vector3();

    const center =
      new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    const maxDimension =
      Math.max(
        size.x,
        size.y,
        size.z
      );

    if (maxDimension <= 0) {
      return;
    }

    const scale =
      LOGO_TARGET_SIZE /
      maxDimension;

    groupRef.current.scale.setScalar(
      scale
    );

    groupRef.current.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );
  }, [scene]);

  /* =======================================================
     LOGO MOTION
  ======================================================= */

  useFrame(({ clock }) => {
    const time =
      clock.getElapsedTime();

    /* =====================================================
       SHADER TIME
    ===================================================== */

    shaderMaterialsRef.current.forEach(
      ({ shader }) => {
        if (
          shader.uniforms
            .uGradientTime
        ) {
          shader.uniforms.uGradientTime.value =
            time;
        }
      }
    );

    /* =====================================================
       PHYSICAL LOGO MOVEMENT

       Немного быстрее и живее.

       Но движение остаётся премиальным,
       без бешеного вращения.
    ===================================================== */

    if (groupRef.current) {
      /*
        Y — основное плавное вращение.
      */

      groupRef.current.rotation.y =
        Math.sin(
          time * 0.32
        ) *
        THREE.MathUtils.degToRad(
          5.5
        );

      /*
        X — лёгкое качание.
      */

      groupRef.current.rotation.x =
        Math.sin(
          time * 0.25
        ) *
        THREE.MathUtils.degToRad(
          1.8
        );

      /*
        Z — совсем небольшое движение.
      */

      groupRef.current.rotation.z =
        Math.sin(
          time * 0.19
        ) *
        THREE.MathUtils.degToRad(
          0.9
        );

      /*
        Очень лёгкое вертикальное
        floating движение.
      */

      groupRef.current.position.y +=
        Math.sin(
          time * 0.38
        ) *
        0.0008;
    }
  });

  return (
    <>
      {/* =================================================
          ENVIRONMENT
      ================================================= */}

      <Environment
        preset="studio"
        background={false}
      />

      {/* =================================================
          WHITE LIGHTING

          Цветные лампы НЕ используем.
      ================================================= */}

      <directionalLight
        position={[
          3,
          5,
          6,
        ]}
        intensity={1.8}
        color="#ffffff"
      />

      <directionalLight
        position={[
          -4,
          1,
          3,
        ]}
        intensity={0.55}
        color="#ffffff"
      />

      <ambientLight
        intensity={0.12}
      />

      {/* =================================================
          LOGO
      ================================================= */}

      <group ref={groupRef}>
        <primitive
          object={scene}
        />
      </group>
    </>
  );
}

useGLTF.preload(
  "/1cc-logo.glb"
);

/* =========================================================
   HERO
========================================================= */

export default function Hero() {
  const heroRef =
    useRef<HTMLElement>(null);

  /* =======================================================
     JSX
  ======================================================= */

  return (
    <>
      <Navbar />

      <main>
        <section
          ref={heroRef}
          className="hero"
          id="hero"
        >
          {/* =================================================
              3D LOGO
          ================================================= */}

          <div className="hero-logo">
            <Canvas
              camera={{
                position: [
                  0,
                  0,
                  8,
                ],
                fov: 40,
              }}
              dpr={[1, 2]}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference:
                  "high-performance",
              }}
              onCreated={({
                gl,
              }) => {
                gl.toneMapping =
                  THREE.ACESFilmicToneMapping;

                gl.toneMappingExposure =
                  1.1;
              }}
            >
              <Suspense
                fallback={null}
              >
                <Logo3D />
              </Suspense>
            </Canvas>
          </div>
        </section>
      </main>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`
        #hero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          background: #000;
        }

        #hero .hero-logo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
        }

        #hero .hero-logo canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        @media (max-width: 760px) {
          #hero {
            min-height: 480px;
          }

          #hero .hero-logo {
            transform: scale(0.72);
          }
        }

        @media (max-width: 400px) {
          #hero .hero-logo {
            transform: scale(0.58);
          }
        }
      `}</style>
    </>
  );
}