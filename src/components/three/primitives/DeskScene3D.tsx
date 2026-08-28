// "use client";

// import React, {
//   memo,
//   forwardRef,
//   useRef,
//   useState,
//   useEffect,
//   useMemo,
// } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { RoundedBox } from "@react-three/drei";
// import * as THREE from "three";

// // ==========================================
// // 1. Types
// // ==========================================

// export type PrimitiveScale = number | [number, number, number];

// export type PrimitiveVector3 = [number, number, number];

// export type PrimitiveAnimation = {
//   floatAmplitude?: number;
//   floatSpeed?: number;
//   rotationSpeed?: number;
//   phase?: number;
// };

// export type PrimitiveProps = {
//   scale?: PrimitiveScale;
//   position?: PrimitiveVector3;
//   rotation?: PrimitiveVector3;
//   animation?: PrimitiveAnimation;
//   bodyColor?: string;
//   accentColor?: string;
//   detailColor?: string;
// };

// type KeySpec = {
//   position: [number, number, number];
//   size: [number, number, number];
//   rotation?: [number, number, number];
//   color?: string;
//   isAccent?: boolean;
// };

// // ==========================================
// // 2. Scene Motion Rig
// // ==========================================

// const SceneRig = memo(
//   forwardRef<
//     THREE.Group,
//     {
//       children: React.ReactNode;
//       animation?: PrimitiveAnimation;
//     }
//   >(function SceneRig({ children, animation }, ref) {
//     const group = useRef<THREE.Group>(null!);

//     useFrame(({ clock, mouse }) => {
//       if (!group.current) return;

//       const time = clock.elapsedTime + (animation?.phase || 0);

//       const floatSpeed = animation?.floatSpeed ?? 1.2;
//       const floatAmp = animation?.floatAmplitude ?? 0.025;

//       // Very subtle vertical floating.
//       group.current.position.y =
//         Math.sin(time * floatSpeed) * floatAmp;

//       // Very subtle mouse interaction.
//       // This adds life without changing the composition.
//       const targetRotationY = mouse.x * 0.035;
//       const targetRotationX = -mouse.y * 0.02;

//       group.current.rotation.y = THREE.MathUtils.lerp(
//         group.current.rotation.y,
//         targetRotationY,
//         0.04
//       );

//       group.current.rotation.x = THREE.MathUtils.lerp(
//         group.current.rotation.x,
//         targetRotationX,
//         0.04
//       );
//     });

//     return (
//       <group
//         ref={(node) => {
//           group.current = node!;

//           if (typeof ref === "function") {
//             ref(node);
//           } else if (ref) {
//             ref.current = node;
//           }
//         }}
//       >
//         {children}
//       </group>
//     );
//   })
// );

// // ==========================================
// // 3. Desk / Table
// // ==========================================

// const Table = memo(
//   forwardRef<THREE.Group, PrimitiveProps>(function Table(
//     { position = [0, 0, 0] },
//     ref
//   ) {
//     return (
//       <group ref={ref} position={position}>
//         {/* Desktop surface */}
//         <RoundedBox
//           args={[4.2, 0.1, 2.2]}
//           radius={0.02}
//           smoothness={4}
//           position={[0, -0.05, 0]}
//         >
//           <meshStandardMaterial
//             color="#E8DFD8"
//             roughness={0.4}
//             metalness={0.05}
//           />
//         </RoundedBox>

//         {/* Desk legs */}
//         {[
//           [-1.9, -0.8, -0.9],
//           [1.9, -0.8, -0.9],
//           [-1.9, -0.8, 0.9],
//           [1.9, -0.8, 0.9],
//         ].map((legPos, idx) => (
//           <mesh key={idx} position={legPos as PrimitiveVector3}>
//             <cylinderGeometry args={[0.04, 0.04, 1.4, 16]} />
//             <meshStandardMaterial
//               color="#FFFFFF"
//               roughness={0.3}
//               metalness={0.2}
//             />
//           </mesh>
//         ))}

//         {/* Desk mat */}
//         <RoundedBox
//           args={[2.8, 0.008, 1.1]}
//           radius={0.01}
//           smoothness={2}
//           position={[0, 0.004, 0.1]}
//         >
//           <meshStandardMaterial
//             color="#D4D4D8"
//             roughness={0.8}
//           />
//         </RoundedBox>
//       </group>
//     );
//   })
// );

// // ==========================================
// // 4. Monitor
// // ==========================================

// const Monitor = memo(
//   forwardRef<THREE.Group, PrimitiveProps>(function Monitor(
//     {
//       scale = 1,
//       position = [0, 0, 0],
//       rotation = [0, 0, 0],
//       bodyColor = "#27272A",
//       accentColor = "#E4E4E7",
//       detailColor = "#3B82F6",
//     },
//     ref
//   ) {
//     return (
//       <group
//         ref={ref}
//         scale={scale}
//         position={position}
//         rotation={rotation}
//       >
//         {/* Display head */}
//         <group position={[0, 0.45, 0]}>
//           {/* Bezel */}
//           <RoundedBox
//             args={[1.8, 1.05, 0.04]}
//             radius={0.015}
//             smoothness={4}
//             position={[0, 0, 0]}
//           >
//             <meshStandardMaterial
//               color={bodyColor}
//               roughness={0.3}
//               metalness={0.4}
//             />
//           </RoundedBox>

//           {/* Back housing */}
//           <RoundedBox
//             args={[1.4, 0.75, 0.08]}
//             radius={0.03}
//             smoothness={4}
//             position={[0, 0, -0.05]}
//           >
//             <meshStandardMaterial
//               color={accentColor}
//               roughness={0.5}
//               metalness={0.2}
//             />
//           </RoundedBox>

//           {/* Screen glass */}
//           <mesh position={[0, 0.01, 0.021]}>
//             <planeGeometry args={[1.74, 0.98]} />
//             <meshStandardMaterial
//               color="#18181B"
//               roughness={0.1}
//               metalness={0.8}
//             />
//           </mesh>

//           {/* Screen */}
//           <mesh position={[0, 0.01, 0.022]}>
//             <planeGeometry args={[1.72, 0.96]} />
//             <meshStandardMaterial
//               color="#F8FAFC"
//               emissive="#E2E8F0"
//               emissiveIntensity={0.6}
//               roughness={0.2}
//             />
//           </mesh>

//           {/* Bottom chin */}
//           <mesh position={[0, -0.495, 0.018]}>
//             <boxGeometry args={[1.78, 0.05, 0.015]} />
//             <meshStandardMaterial
//               color={bodyColor}
//               roughness={0.4}
//               metalness={0.3}
//             />
//           </mesh>

//           {/* Power LED */}
//           <mesh position={[0.82, -0.495, 0.026]}>
//             <cylinderGeometry
//               args={[0.005, 0.005, 0.003, 12]}
//               rotation={[Math.PI / 2, 0, 0]}
//             />
//             <meshStandardMaterial
//               color={detailColor}
//               emissive={detailColor}
//               emissiveIntensity={1.2}
//             />
//           </mesh>
//         </group>

//         {/* Stand */}
//         <group position={[0, 0, 0]}>
//           <mesh
//             position={[0, 0.28, -0.12]}
//             rotation={[-0.08, 0, 0]}
//           >
//             <boxGeometry args={[0.12, 0.65, 0.06]} />
//             <meshStandardMaterial
//               color={accentColor}
//               roughness={0.3}
//               metalness={0.7}
//             />
//           </mesh>

//           <RoundedBox
//             args={[0.18, 0.18, 0.05]}
//             radius={0.01}
//             smoothness={3}
//             position={[0, 0.45, -0.08]}
//           >
//             <meshStandardMaterial
//               color="#94A3B8"
//               roughness={0.25}
//               metalness={0.85}
//             />
//           </RoundedBox>

//           {/* Base */}
//           <group position={[0, -0.06, -0.04]}>
//             <mesh position={[0, 0.01, 0]}>
//               <cylinderGeometry
//                 args={[0.38, 0.42, 0.02, 32]}
//               />
//               <meshStandardMaterial
//                 color={bodyColor}
//                 roughness={0.35}
//                 metalness={0.5}
//               />
//             </mesh>
//           </group>
//         </group>
//       </group>
//     );
//   })
// );

// // ==========================================
// // 5. Keyboard
// // ==========================================

// function Keycap({
//   position,
//   size,
//   rotation = [0, 0, 0],
//   color,
//   isAccent,
// }: KeySpec & { color: string }) {
//   return (
//     <group
//       position={position}
//       rotation={rotation}
//     >
//       <RoundedBox
//         args={size}
//         radius={0.012}
//         smoothness={4}
//         position={[0, 0, 0]}
//       >
//         <meshStandardMaterial
//           color={color}
//           roughness={isAccent ? 0.45 : 0.65}
//           metalness={0.05}
//         />
//       </RoundedBox>
//     </group>
//   );
// }

// const Keyboard = memo(
//   forwardRef<THREE.Group, PrimitiveProps>(function Keyboard(
//     {
//       scale = 1,
//       position = [0, 0, 0],
//       rotation = [0, 0, 0],
//       bodyColor = "#F1F5F9",
//       accentColor = "#3B82F6",
//       detailColor = "#FFFFFF",
//     },
//     ref
//   ) {
//     const defaultKeyColor = detailColor;
//     const modifierKeyColor = "#E2E8F0";
//     const accentKeyColor = accentColor;

//     const keys = useMemo<KeySpec[]>(() => {
//       const keyList: KeySpec[] = [];

//       const unit = 0.088;
//       const gap = 0.005;
//       const startX = -0.72;
//       const keyHeight = 0.042;

//       const layout: Array<
//         Array<{
//           u: number;
//           mod?: boolean;
//           accent?: boolean;
//         }>
//       > = [
//           [
//             { u: 1, accent: true },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1, mod: true },
//           ],
//           [
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 2, mod: true },
//           ],
//           [
//             { u: 1.5, mod: true },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1.5, mod: true },
//           ],
//           [
//             { u: 1.75, mod: true },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 1 },
//             { u: 2.25, accent: true },
//           ],
//           [
//             { u: 1.25, mod: true },
//             { u: 1.25, mod: true },
//             { u: 1.25, mod: true },
//             { u: 6.25 },
//             { u: 1.25, mod: true },
//             { u: 1.25, mod: true },
//             { u: 1.25, mod: true },
//           ],
//         ];

//       const rowZOffsets = [
//         -0.22,
//         -0.11,
//         0.0,
//         0.11,
//         0.22,
//       ];

//       layout.forEach((row, rowIndex) => {
//         let currentX = startX;
//         const zPos = rowZOffsets[rowIndex];

//         row.forEach((key) => {
//           const width =
//             key.u * unit +
//             (key.u - 1) * gap;

//           const xPos =
//             currentX + width / 2;

//           let color = defaultKeyColor;

//           if (key.accent) {
//             color = accentKeyColor;
//           } else if (key.mod) {
//             color = modifierKeyColor;
//           }

//           keyList.push({
//             position: [
//               xPos,
//               0.125,
//               zPos,
//             ],
//             size: [
//               width,
//               keyHeight,
//               unit,
//             ],
//             color,
//             isAccent: key.accent,
//           });

//           currentX += width + gap;
//         });
//       });

//       return keyList;
//     }, [
//       defaultKeyColor,
//       modifierKeyColor,
//       accentKeyColor,
//     ]);

//     return (
//       <group
//         ref={ref}
//         scale={scale}
//         position={position}
//         rotation={rotation}
//       >
//         <group rotation={[0.08, 0, 0]}>
//           {/* Keyboard body */}
//           <RoundedBox
//             args={[1.68, 0.12, 0.64]}
//             radius={0.02}
//             smoothness={6}
//             position={[0, 0.05, 0]}
//           >
//             <meshStandardMaterial
//               color={bodyColor}
//               roughness={0.3}
//               metalness={0.1}
//             />
//           </RoundedBox>

//           {/* Keys */}
//           {keys.map((keyProps, index) => (
//             <Keycap
//               key={index}
//               {...keyProps}
//               color={
//                 keyProps.color ||
//                 defaultKeyColor
//               }
//             />
//           ))}
//         </group>
//       </group>
//     );
//   })
// );

// // ==========================================
// // 6. Mouse
// // ==========================================

// const Mouse = memo(
//   forwardRef<THREE.Group, PrimitiveProps>(function Mouse(
//     {
//       scale = 1,
//       position = [0, 0, 0],
//       rotation = [0, 0, 0],
//       bodyColor = "#FFFFFF",
//       accentColor = "#E2E8F0",
//       detailColor = "#3B82F6",
//     },
//     ref
//   ) {
//     const shellGeometry = useMemo(() => {
//       const geo = new THREE.BoxGeometry(
//         0.64,
//         0.36,
//         1.1,
//         16,
//         16,
//         24
//       );

//       const pos = geo.attributes.position;

//       for (let i = 0; i < pos.count; i++) {
//         let x = pos.getX(i);
//         let y = pos.getY(i);
//         const z = pos.getZ(i);

//         const normZ =
//           (z + 0.55) / 1.1;

//         if (normZ < 0.35) {
//           y *=
//             0.3 +
//             normZ * 1.1;

//           x *=
//             0.75 +
//             normZ * 0.5;
//         } else {
//           y *=
//             1.12 -
//             Math.pow(
//               normZ - 0.65,
//               2
//             ) * 2.1;

//           x *=
//             1.05 -
//             Math.pow(
//               normZ - 0.5,
//               2
//             ) * 0.7;
//         }

//         if (
//           normZ > 0.25 &&
//           normZ < 0.75
//         ) {
//           const factor =
//             Math.sin(
//               ((normZ - 0.25) *
//                 Math.PI) /
//               0.5
//             );

//           x *=
//             1.0 -
//             factor * 0.08;
//         }

//         if (y < -0.11) {
//           y =
//             -0.11 +
//             (y + 0.11) * 0.05;
//         }

//         pos.setXYZ(
//           i,
//           x,
//           y,
//           z
//         );
//       }

//       geo.computeVertexNormals();

//       return geo;
//     }, []);

//     return (
//       <group
//         ref={ref}
//         scale={scale}
//         position={position}
//         rotation={rotation}
//       >
//         <group position={[0, 0.11, 0]}>
//           {/* Mouse body */}
//           <mesh geometry={shellGeometry}>
//             <meshStandardMaterial
//               color={bodyColor}
//               roughness={0.3}
//               metalness={0.05}
//             />
//           </mesh>

//           {/* Scroll wheel */}
//           <group
//             position={[0, 0.085, -0.3]}
//             rotation={[
//               0,
//               0,
//               Math.PI / 2,
//             ]}
//           >
//             <mesh>
//               <cylinderGeometry
//                 args={[
//                   0.062,
//                   0.062,
//                   0.045,
//                   32,
//                 ]}
//               />

//               <meshStandardMaterial
//                 color={accentColor}
//                 roughness={0.2}
//                 metalness={0.8}
//               />
//             </mesh>
//           </group>

//           {/* Accent LED */}
//           <mesh
//             position={[0, 0.12, 0.05]}
//           >
//             <cylinderGeometry
//               args={[
//                 0.004,
//                 0.004,
//                 0.003,
//                 12,
//               ]}
//             />

//             <meshStandardMaterial
//               color={detailColor}
//               emissive={detailColor}
//               emissiveIntensity={1.0}
//             />
//           </mesh>
//         </group>
//       </group>
//     );
//   })
// );

// // ==========================================
// // 7. Desk Lamp
// // ==========================================

// const Lamp = memo(
//   forwardRef<THREE.Group, PrimitiveProps>(function Lamp(
//     {
//       scale = 1,
//       position = [0, 0, 0],
//       rotation = [0, 0, 0],
//       bodyColor = "#FFFFFF",
//       accentColor = "#FDE047",
//       detailColor = "#CBD5E1",
//     },
//     ref
//   ) {
//     return (
//       <group
//         ref={ref}
//         scale={scale}
//         position={position}
//         rotation={rotation}
//       >
//         {/* Base */}
//         <mesh position={[0, -0.56, 0]}>
//           <cylinderGeometry
//             args={[
//               0.54,
//               0.6,
//               0.18,
//               28,
//             ]}
//           />

//           <meshStandardMaterial
//             color={bodyColor}
//             roughness={0.4}
//             metalness={0.1}
//           />
//         </mesh>

//         {/* Stem */}
//         <mesh position={[0.02, -0.18, 0]}>
//           <cylinderGeometry
//             args={[
//               0.06,
//               0.08,
//               0.82,
//               16,
//             ]}
//           />

//           <meshStandardMaterial
//             color={detailColor}
//             roughness={0.3}
//             metalness={0.7}
//           />
//         </mesh>

//         {/* Upper arm */}
//         <mesh
//           position={[0.24, 0.16, 0]}
//           rotation={[
//             0,
//             0,
//             0.34,
//           ]}
//         >
//           <cylinderGeometry
//             args={[
//               0.045,
//               0.06,
//               0.58,
//               16,
//             ]}
//           />

//           <meshStandardMaterial
//             color={detailColor}
//             roughness={0.3}
//             metalness={0.7}
//           />
//         </mesh>

//         {/* Lamp shade */}
//         <mesh
//           position={[0.45, 0.42, 0]}
//         >
//           <cylinderGeometry
//             args={[
//               0.26,
//               0.31,
//               0.12,
//               28,
//             ]}
//           />

//           <meshStandardMaterial
//             color={bodyColor}
//             roughness={0.3}
//           />
//         </mesh>

//         {/* Light diffuser */}
//         <mesh
//           position={[0.45, 0.42, 0.03]}
//         >
//           <sphereGeometry
//             args={[0.2, 24, 24]}
//           />

//           <meshStandardMaterial
//             color="#FFFBEB"
//             emissive={accentColor}
//             emissiveIntensity={0.6}
//           />
//         </mesh>
//       </group>
//     );
//   })
// );

// // ==========================================
// // 8. Scene Composition
// // ==========================================

// function SetupScene() {
//   return (
//     <SceneRig>
//       <group
//         position={[0, -0.28, 0]}
//         rotation={[0.08, -0.20, 0]}
//         scale={1.08}
//       >
//         {/* Desk */}
//         <Table position={[0, 0, 0]} />

//         {/* Primary monitor */}
//         <Monitor
//           position={[0, 0.1, -0.4]}
//           scale={1.1}
//         />

//         {/* Secondary monitor */}
//         <Monitor
//           position={[-1.45, 0.1, -0.05]}
//           rotation={[0, 0.28, 0]}
//           scale={0.98}
//         />

//         {/* Keyboard */}
//         <Keyboard
//           position={[0, 0.02, 0.32]}
//           scale={1.05}
//         />

//         {/* Mouse */}
//         <Mouse
//           position={[0.95, 0.02, 0.36]}
//           rotation={[0, -0.1, 0]}
//           scale={0.9}
//         />

//         {/* Lamp */}
//         <Lamp
//           position={[1.35, 0.62, -0.38]}
//           rotation={[0, -0.7, 0]}
//           scale={0.8}
//         />
//       </group>
//     </SceneRig>
//   );
// }

// // ==========================================
// // 9. Export Component
// // ==========================================

// export default function DeskScene3D() {
//   const [isMounted, setIsMounted] =
//     useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) {
//     return null;
//   }

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100%",
//         position: "relative",
//       }}
//     >
//       <Canvas
//         camera={{
//           position: [0, 1.45, 4.8],
//           fov: 40,
//         }}
//         style={{
//           width: "100%",
//           height: "100%",
//           background: "transparent",
//         }}
//         gl={{
//           antialias: true,
//           alpha: true,
//           powerPreference:
//             "high-performance",
//         }}
//       >
//         {/* Soft ambient illumination */}
//         <ambientLight
//           intensity={0.9}
//           color="#FFFFFF"
//         />

//         {/* Warm key light */}
//         <directionalLight
//           position={[5, 8, 5]}
//           intensity={1.7}
//           color="#FFFDF5"
//         />

//         {/* Cool fill */}
//         <directionalLight
//           position={[-5, 4, -3]}
//           intensity={0.55}
//           color="#E0F2FE"
//         />

//         {/* Soft overhead light */}
//         <pointLight
//           position={[0, 5, 0]}
//           intensity={0.45}
//           color="#FFFFFF"
//         />

//         {/* Main composition */}
//         <SetupScene />
//       </Canvas>
//     </div>
//   );
// }