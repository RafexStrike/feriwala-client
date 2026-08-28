// "use client";

// import { ContactShadows, Environment, Sparkles } from "@react-three/drei";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import * as THREE from "three";
// import { animation } from "@/config/animations";
// import { palette, sceneSurfaces } from "@/config/materials";
// import { useEffect, useRef } from "react";

// function CameraFraming({ children }: { children: React.ReactNode }) {
//   const { camera } = useThree();
//   const groupRef = useRef<THREE.Group>(null);

//   useFrame(() => {
//     if (!groupRef.current) return;

//     const box = new THREE.Box3().setFromObject(groupRef.current);
//     const center = box.getCenter(new THREE.Vector3());
//     const size = box.getSize(new THREE.Vector3());
//     const maxDim = Math.max(size.x, size.y, size.z);
//     const fov = (camera as THREE.PerspectiveCamera).fov;
    
//     const distance = (maxDim / 2) / Math.tan((fov * Math.PI) / 360) / 0.7;
    
//     camera.position.lerp(new THREE.Vector3(center.x, center.y, distance), 0.1);
//     camera.lookAt(center);
//   });

//   return <group ref={groupRef}>{children}</group>;
// }

// export function SceneFrame({
//   children,
//   progress,
//   background = sceneSurfaces.canvas,
//   reducedMotion,
//   lowCost,
// }: {
//   children: React.ReactNode;
//   progress: number;
//   background?: string;
//   reducedMotion: boolean;
//   lowCost: boolean;
// }) {
//   const spreadRotation = THREE.MathUtils.lerp(0.12, 0.04, progress);

//   return (
//     <Canvas
//       camera={{ position: [0, 0, 7.4], fov: 38 }}
//       dpr={lowCost ? [1, 1.15] : [1, 1.65]}
//       gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
//       shadows={false}
//     >
//       <color attach="background" args={[background]} />
//       <fog attach="fog" args={[background, 9, 18]} />
//       <ambientLight intensity={1.15} />
//       <directionalLight position={[5, 6, 5]} intensity={2.4} color="#FFF1E4" />
//       <directionalLight position={[-4, -2, 4]} intensity={0.82} color={palette.sky} />
//       <directionalLight position={[0, 4, -3]} intensity={0.55} color={palette.clay} />
//       <group position={[0, 0, 0]} rotation={[0.05, spreadRotation, 0]}>
//         <CameraFraming>
//           {children}
//         </CameraFraming>
//       </group>
//       <ContactShadows opacity={0.22} scale={9} blur={2.5} far={5.5} resolution={lowCost ? 128 : 256} color={palette.shadow} />
//       {lowCost || reducedMotion ? null : <Environment preset="studio" />}
//       {lowCost || reducedMotion ? null : <Sparkles count={18} size={1.8} scale={6} speed={0.26} color={palette.honey} />}
//     </Canvas>
//   );
// }
