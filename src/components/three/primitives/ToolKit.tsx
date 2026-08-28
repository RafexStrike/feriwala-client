// "use client";

// import { memo } from "react";
// import { RoundedBox } from "@react-three/drei";
// import { forwardRef } from "react";
// import * as THREE from "three";
// import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

// function ToolKitComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
//   const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
//   const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentClay.color);
//   const detail = usePrimitiveColor(detailColor, "#9D8E81");

//   return (
//     <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
//       <group>
//         <RoundedBox args={[1.58, 0.16, 0.98]} radius={0.1} smoothness={6} position={[0, -0.48, 0]}>
//           <meshStandardMaterial color={shellColor} roughness={0.76} metalness={0.02} />
//         </RoundedBox>
//         <mesh position={[-0.35, 0.08, 0]} rotation={[0, 0, -0.12]}>
//           <capsuleGeometry args={[0.12, 0.64, 8, 14]} />
//           <meshStandardMaterial color={accent} roughness={0.46} metalness={0.02} />
//         </mesh>
//         <mesh position={[-0.35, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
//           <cylinderGeometry args={[0.12, 0.1, 0.22, 18]} />
//           <meshStandardMaterial color="#F1E4D7" roughness={0.38} metalness={0.02} />
//         </mesh>
//         <RoundedBox args={[0.56, 1.02, 0.42]} radius={0.14} smoothness={6} position={[0.45, 0.04, 0]}>
//           <meshStandardMaterial color={shellColor} roughness={0.72} metalness={0.02} />
//         </RoundedBox>
//         <RoundedBox args={[0.4, 0.2, 0.28]} radius={0.06} smoothness={4} position={[0.45, 0.56, 0]}>
//           <meshStandardMaterial color={accent} roughness={0.38} metalness={0.02} emissive={accent} emissiveIntensity={0.05} />
//         </RoundedBox>
//         <mesh position={[0.87, -0.14, 0.08]} rotation={[0, 0, 0.2]}>
//           <cylinderGeometry args={[0.04, 0.05, 0.72, 12]} />
//           <meshStandardMaterial color={detail} roughness={0.55} metalness={0.02} />
//         </mesh>
//         <mesh position={[0.87, -0.54, 0.08]} rotation={[0, 0, 0.1]}>
//           <boxGeometry args={[0.18, 0.08, 0.18]} />
//           <meshStandardMaterial color={detail} roughness={0.48} metalness={0.02} />
//         </mesh>
//       </group>
//     </PrimitiveRig>
//   );
// }

// export const ToolKit = memo(forwardRef(ToolKitComponent));

// export type { PrimitiveProps as ToolKitProps };
