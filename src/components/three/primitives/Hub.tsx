// "use client";

// import { memo } from "react";
// import { RoundedBox } from "@react-three/drei";
// import { forwardRef } from "react";
// import * as THREE from "three";
// import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

// function HubComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
//   const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
//   const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentHoney.color);
//   const detail = usePrimitiveColor(detailColor, "#968879");

//   return (
//     <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
//       <group>
//         <RoundedBox args={[1.9, 0.42, 0.96]} radius={0.16} smoothness={8}>
//           <meshStandardMaterial color={shellColor} roughness={0.68} metalness={0.03} envMapIntensity={0.56} />
//         </RoundedBox>
//         <RoundedBox args={[1.48, 0.08, 0.5]} radius={0.05} smoothness={4} position={[0, 0.12, -0.02]}>
//           <meshStandardMaterial color={accent} roughness={0.34} metalness={0.03} emissive={accent} emissiveIntensity={0.04} />
//         </RoundedBox>
//         <RoundedBox args={[0.18, 0.1, 0.1]} radius={0.03} smoothness={4} position={[-0.62, -0.03, 0.46]}>
//           <meshStandardMaterial color={detail} roughness={0.44} metalness={0.02} />
//         </RoundedBox>
//         <RoundedBox args={[0.18, 0.1, 0.1]} radius={0.03} smoothness={4} position={[-0.32, -0.03, 0.46]}>
//           <meshStandardMaterial color={detail} roughness={0.44} metalness={0.02} />
//         </RoundedBox>
//         <RoundedBox args={[0.18, 0.1, 0.1]} radius={0.03} smoothness={4} position={[-0.02, -0.03, 0.46]}>
//           <meshStandardMaterial color={detail} roughness={0.44} metalness={0.02} />
//         </RoundedBox>
//         <RoundedBox args={[0.18, 0.1, 0.1]} radius={0.03} smoothness={4} position={[0.28, -0.03, 0.46]}>
//           <meshStandardMaterial color={detail} roughness={0.44} metalness={0.02} />
//         </RoundedBox>
//         <RoundedBox args={[0.18, 0.1, 0.1]} radius={0.03} smoothness={4} position={[0.62, 0.16, 0.05]}>
//           <meshStandardMaterial color={primitiveMaterials.glowSky.color} roughness={0.3} metalness={0.02} emissive={primitiveMaterials.glowSky.color} emissiveIntensity={0.14} />
//         </RoundedBox>
//       </group>
//     </PrimitiveRig>
//   );
// }

// export const Hub = memo(forwardRef(HubComponent));

// export type { PrimitiveProps as HubProps };
