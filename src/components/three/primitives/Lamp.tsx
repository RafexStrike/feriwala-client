// "use client";

// import { memo, forwardRef, useState, useEffect } from "react";
// import { Canvas } from "@react-three/fiber";
// import { RoundedBox, OrbitControls } from "@react-three/drei";
// import * as THREE from "three";
// import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

// // ==========================================
// // 1. Lamp Component
// // ==========================================
// function LampComponent(
//   { scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps,
//   ref: React.ForwardedRef<THREE.Group>
// ) {
//   const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
//   const accent = usePrimitiveColor(accentColor, primitiveMaterials.glowHoney.color);
//   const detail = usePrimitiveColor(detailColor, "#9C8E80");

//   return (
//     <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
//       <group>
//         <mesh position={[0, -0.56, 0]}>
//           <cylinderGeometry args={[0.54, 0.6, 0.18, 28]} />
//           <meshStandardMaterial color={shellColor} roughness={0.68} metalness={0.02} envMapIntensity={0.48} />
//         </mesh>
//         <mesh position={[0.02, -0.18, 0]}>
//           <cylinderGeometry args={[0.06, 0.08, 0.82, 16]} />
//           <meshStandardMaterial color={detail} roughness={0.5} metalness={0.02} />
//         </mesh>
//         <mesh position={[0.24, 0.16, 0]} rotation={[0, 0, 0.34]}>
//           <cylinderGeometry args={[0.045, 0.06, 0.58, 16]} />
//           <meshStandardMaterial color={detail} roughness={0.5} metalness={0.02} />
//         </mesh>
//         <mesh position={[0.45, 0.42, 0]}>
//           <cylinderGeometry args={[0.26, 0.31, 0.12, 28]} />
//           <meshStandardMaterial color={accent} roughness={0.34} metalness={0.02} emissive={accent} emissiveIntensity={0.12} />
//         </mesh>
//         <mesh position={[0.45, 0.42, 0.03]}>
//           <sphereGeometry args={[0.2, 24, 24]} />
//           <meshStandardMaterial color="#F7E8DD" roughness={0.3} metalness={0.01} emissive={accent} emissiveIntensity={0.08} />
//         </mesh>
//         <RoundedBox args={[0.18, 0.1, 0.18]} radius={0.03} smoothness={4} position={[0.13, 0.02, 0]}>
//           <meshStandardMaterial color={detail} roughness={0.46} metalness={0.02} />
//         </RoundedBox>
//       </group>
//     </PrimitiveRig>
//   );
// }

// export const Lamp = memo(forwardRef(LampComponent));
// export type { PrimitiveProps as LampProps };

// // ==========================================
// // 2. Main Next.js Page Export
// // ==========================================
// export default function LampPage() {
//   const [isMounted, setIsMounted] = useState(false);

//   // Prevent SSR execution for Three.js WebGL canvas context
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) {
//     return <div style={{ width: "100vw", height: "100vh", backgroundColor: "#0a0a0c" }} />;
//   }

//   return (
//     <main style={{ width: "100vw", height: "100vh", backgroundColor: "#0a0a0c" }}>
//       <Canvas camera={{ position: [2.5, 1.8, 2.8], fov: 45 }}>
//         <ambientLight intensity={0.6} />
//         <directionalLight position={[4, 6, 5]} intensity={1.5} />

//         <Lamp position={[0, 0, 0]} />

//         <OrbitControls makeDefault minDistance={1} maxDistance={10} />
//       </Canvas>
//     </main>
//   );
// }