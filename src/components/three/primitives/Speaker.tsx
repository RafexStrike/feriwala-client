// "use client";

// import { memo } from "react";
// import { RoundedBox } from "@react-three/drei";
// import { forwardRef } from "react";
// import * as THREE from "three";
// import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

// function SpeakerComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
//   const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
//   const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentHoney.color);
//   const detail = usePrimitiveColor(detailColor, "#A79A8B");

//   return (
//     <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
//       <group>
//         <mesh>
//           <cylinderGeometry args={[0.56, 0.58, 1.56, 28]} />
//           <meshStandardMaterial color={shellColor} roughness={0.52} metalness={0.04} envMapIntensity={0.62} />
//         </mesh>
//         <mesh position={[0, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
//           <torusGeometry args={[0.48, 0.04, 12, 28]} />
//           <meshStandardMaterial color={detail} roughness={0.42} metalness={0.03} />
//         </mesh>
//         <mesh position={[0, 0.72, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
//           <torusGeometry args={[0.18, 0.03, 10, 24]} />
//           <meshStandardMaterial color={accent} roughness={0.32} metalness={0.03} emissive={accent} emissiveIntensity={0.05} />
//         </mesh>
//         <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
//           <torusGeometry args={[0.2, 0.03, 10, 24]} />
//           <meshStandardMaterial color={detail} roughness={0.48} metalness={0.02} />
//         </mesh>
//         <mesh position={[0, -0.23, 0.41]} rotation={[Math.PI / 2, 0, 0]}>
//           <torusGeometry args={[0.31, 0.03, 10, 24]} />
//           <meshStandardMaterial color={detail} roughness={0.48} metalness={0.02} />
//         </mesh>
//         <mesh position={[0, 0.42, 0.43]} rotation={[Math.PI / 2, 0, 0]}>
//           <torusGeometry args={[0.12, 0.026, 10, 24]} />
//           <meshStandardMaterial color={shellColor} roughness={0.56} metalness={0.03} />
//         </mesh>
//         <RoundedBox args={[0.24, 0.12, 0.14]} radius={0.03} smoothness={4} position={[0, -0.82, 0]}>
//           <meshStandardMaterial color={detail} roughness={0.45} metalness={0.02} />
//         </RoundedBox>
//       </group>
//     </PrimitiveRig>
//   );
// }

// export const Speaker = memo(forwardRef(SpeakerComponent));

// export type { PrimitiveProps as SpeakerProps };
