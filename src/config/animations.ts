export const animation = {
  reveal: {
    y: 28,
    duration: 0.9,
    stagger: 0.08,
  },
  scene: {
    scrubStart: "top bottom",
    scrubEnd: "bottom top",
  },
  easing: {
    soft: [0.22, 1, 0.36, 1] as const,
    cinematic: [0.16, 1, 0.3, 1] as const,
  },
};
