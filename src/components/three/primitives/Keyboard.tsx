// "use client";

// import { memo, useMemo, forwardRef } from "react";
// import { RoundedBox } from "@react-three/drei";
// import * as THREE from "three";
// import { primitiveMaterials, PrimitiveRig, type PrimitiveProps, usePrimitiveColor } from "./shared";

// type KeySpec = {
//   position: [number, number, number];
//   size: [number, number, number];
//   rotation?: [number, number, number];
//   color?: string;
//   isAccent?: boolean;
// };

// // Realistic OEM Keycap with slight top sculpt & subtle bevel
// function Keycap({ position, size, rotation = [0, 0, 0], color, isAccent }: KeySpec & { color: string }) {
//   return (
//     <group position={position} rotation={rotation}>
//       {/* Switch Stem Base (Subtle realism under keycaps) */}
//       <mesh position={[0, -size[1] / 2 + 0.005, 0]}>
//         <boxGeometry args={[0.04, 0.015, 0.04]} />
//         <meshStandardMaterial color="#111111" roughness={0.3} />
//       </mesh>
//       {/* Main Keycap Shell */}
//       <RoundedBox args={size} radius={0.012} smoothness={4} position={[0, 0, 0]}>
//         <meshStandardMaterial
//           color={color}
//           roughness={isAccent ? 0.45 : 0.65} // Matte PBT texture
//           metalness={0.05}
//           envMapIntensity={0.8}
//         />
//       </RoundedBox>
//     </group>
//   );
// }

// function KeyboardComponent(
//   { scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps,
//   ref: React.ForwardedRef<THREE.Group>
// ) {
//   // Color palette defaults for a premium matte black keyboard (e.g., Keychron / Drop)
//   const caseColor = usePrimitiveColor(bodyColor, "#121214"); // Dark Anodized Aluminum
//   const defaultKeyColor = usePrimitiveColor(detailColor, "#1A1A1E"); // Matte Charcoal/Black PBT
//   const modifierKeyColor = "#26262B"; // Slightly lighter dark gray for mods
//   const accentKeyColor = usePrimitiveColor(accentColor, "#D0382B"); // Red Escape key or accent accent

//   const keys = useMemo<KeySpec[]>(() => {
//     const keyList: KeySpec[] = [];
//     const unit = 0.088; // 1U key dimension step
//     const gap = 0.005; // Gap between keys
//     const step = unit + gap;
//     const startX = -0.72;
//     const keyHeight = 0.042;

//     // Row definitions [keyUnits, isModifier, customColor]
//     const layout: Array<Array<{ u: number; mod?: boolean; accent?: boolean }>> = [
//       // Row 1: Function / Top Row (F1-F12 + Esc + Del)
//       [
//         { u: 1, accent: true }, // Esc
//         { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 },
//         { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 },
//         { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 },
//         { u: 1, mod: true }, // Del
//       ],
//       // Row 2: Numbers (tilde to Backspace)
//       [
//         { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 },
//         { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 },
//         { u: 2, mod: true }, // Backspace
//       ],
//       // Row 3: QWERTY + Tab
//       [
//         { u: 1.5, mod: true }, // Tab
//         { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 },
//         { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 },
//         { u: 1.5, mod: true }, // Pipe/Slash
//       ],
//       // Row 4: Home row + Caps Lock + Enter
//       [
//         { u: 1.75, mod: true }, // Caps Lock
//         { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 },
//         { u: 1 }, { u: 1 }, { u: 1 }, { u: 1 },
//         { u: 2.25, accent: true }, // Enter
//       ],
//       // Row 5: Bottom row with Spacebar
//       [
//         { u: 1.25, mod: true }, // Ctrl
//         { u: 1.25, mod: true }, // Win
//         { u: 1.25, mod: true }, // Alt
//         { u: 6.25 },            // Spacebar
//         { u: 1.25, mod: true }, // Alt
//         { u: 1.25, mod: true }, // Fn
//         { u: 1.25, mod: true }, // Ctrl
//       ],
//     ];

//     const rowZOffsets = [-0.22, -0.11, 0.0, 0.11, 0.22];
//     const rowAngles = [0.08, 0.05, 0.02, -0.01, -0.04]; // OEM profile angle sculpting per row

//     layout.forEach((row, rowIndex) => {
//       let currentX = startX;
//       const zPos = rowZOffsets[rowIndex];
//       const rowRotation = rowAngles[rowIndex];

//       row.forEach((k) => {
//         const width = k.u * unit + (k.u - 1) * gap;
//         const xPos = currentX + width / 2;

//         let color = defaultKeyColor;
//         if (k.accent) color = accentKeyColor;
//         else if (k.mod) color = modifierKeyColor;

//         keyList.push({
//           position: [xPos, 0.125, zPos],
//           size: [width, keyHeight, unit],
//           rotation: [rowRotation, 0, 0],
//           color,
//           isAccent: k.accent,
//         });

//         currentX += width + gap;
//       });
//     });

//     return keyList;
//   }, [defaultKeyColor, modifierKeyColor, accentKeyColor]);

//   return (
//     <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
//       {/* Entire Keyboard tilted forward 6 degrees for standard ergonomic incline */}
//       <group rotation={[0.1, 0, 0]}>
        
//         {/* Main Base Chassis (Anodized Aluminum Case) */}
//         <RoundedBox args={[1.68, 0.12, 0.64]} radius={0.02} smoothness={6} position={[0, 0.05, 0]}>
//           <meshStandardMaterial
//             color={caseColor}
//             roughness={0.4}
//             metalness={0.82}
//             envMapIntensity={1.2}
//           />
//         </RoundedBox>

//         {/* Recessed Switch Mounting Plate (Brass / Dark Steel) */}
//         <RoundedBox args={[1.58, 0.02, 0.54]} radius={0.005} smoothness={4} position={[0, 0.102, 0]}>
//           <meshStandardMaterial color="#1A1817" roughness={0.3} metalness={0.6} />
//         </RoundedBox>

//         {/* Status Indicator LED lights (Num Lock / Caps Lock) */}
//         <mesh position={[0.72, 0.115, -0.22]}>
//           <cylinderGeometry args={[0.006, 0.006, 0.005, 12]} />
//           <meshStandardMaterial color="#33FF66" emissive="#33FF66" emissiveIntensity={0.8} />
//         </mesh>
//         <mesh position={[0.74, 0.115, -0.22]}>
//           <cylinderGeometry args={[0.006, 0.006, 0.005, 12]} />
//           <meshStandardMaterial color="#111111" roughness={0.5} />
//         </mesh>

//         {/* Rubber Feet (Bottom Case Realism) */}
//         {[-0.75, 0.75].map((x, i) =>
//           [-0.26, 0.26].map((z, j) => (
//             <mesh key={`${i}-${j}`} position={[x, -0.012, z]}>
//               <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
//               <meshStandardMaterial color="#080808" roughness={0.9} />
//             </mesh>
//           ))
//         )}

//         {/* Render Keycaps */}
//         {keys.map((keyProps, index) => (
//           <Keycap key={index} {...keyProps} color={keyProps.color || defaultKeyColor} />
//         ))}
//       </group>
//     </PrimitiveRig>
//   );
// }

// export const Keyboard = memo(forwardRef(KeyboardComponent));

// export type { PrimitiveProps as KeyboardProps };