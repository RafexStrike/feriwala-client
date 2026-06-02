export const animation = {
  reveal: {
    y: 28,
    duration: 0.9,
    stagger: 0.08,
  },
  scene: {
    scrubStart: "top bottom",
    scrubEnd: "bottom top",
    spreadStart: 1,
    spreadEnd: 0.38,
    drift: 0.035,
  },
  primitives: {
    floatAmplitude: {
      desktop: 0.12,
      mobile: 0.06,
    },
    floatSpeed: 0.72,
    orbitSpeed: 0.18,
    rotationSpeed: 0.14,
    wobbleAmplitude: 0.16,
    wobbleSpeed: 0.9,
    phaseStep: 0.38,
    reducedMotionMultiplier: 0.18,
  },
  assembly: {
    settleProgress: 0.64,
    driftScale: 0.22,
    lift: 0.08,
  },
  formation: {
    settleProgress: 0.72,
    bloomScale: 0.18,
    driftScale: 0.26,
  },
  easing: {
    soft: [0.22, 1, 0.36, 1] as const,
    cinematic: [0.16, 1, 0.3, 1] as const,
  },
};
