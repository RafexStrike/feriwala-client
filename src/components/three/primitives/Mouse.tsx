"use client";

import { memo, useMemo, forwardRef } from "react";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function MouseComponent(
  { scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps,
  ref: React.ForwardedRef<THREE.Group>
) {
  // Color setup
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shellDeep?.color || "#18181B");
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentClay?.color || "#27272A");
  const detail = usePrimitiveColor(detailColor, "#E04836");

  // Main Palm Shell Mesh (Symmetric ergonomic curve)
  const shellGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.64, 0.36, 1.1, 16, 16, 24);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Normalized Z from front (-0.55) to back (+0.55)
      const normZ = (z + 0.55) / 1.1;

      // Ergonomic hump back profile
      if (normZ < 0.35) {
        // Nose slope down towards click area
        y *= 0.3 + normZ * 1.1;
        x *= 0.75 + normZ * 0.5;
      } else {
        // High arch over palm area
        y *= 1.12 - Math.pow(normZ - 0.65, 2) * 2.1;
        // Taper back of mouse
        x *= 1.05 - Math.pow(normZ - 0.5, 2) * 0.7;
      }

      // Waist pinch on both sides
      if (normZ > 0.25 && normZ < 0.75) {
        const factor = Math.sin((normZ - 0.25) * Math.PI / 0.5);
        x *= 1.0 - factor * 0.08;
      }

      // Flat base truncation
      if (y < -0.11) {
        y = -0.11 + (y + 0.11) * 0.05;
      }

      pos.setXYZ(i, x, y, z);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  // Left & Right Primary Click Buttons (Sculpted Finger Comfort Curves)
  const buttonGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.27, 0.04, 0.46, 10, 6, 12);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Slight finger scoop depression down the middle
      const distFromCenterX = Math.abs(x);
      if (y > 0) {
        y -= (0.015 - distFromCenterX * 0.04);
      }

      // Slope downward towards the front tip
      const normZ = (z + 0.23) / 0.46;
      y -= normZ * 0.02;

      pos.setXYZ(i, x, y, z);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group position={[0, 0.11, 0]}>

        {/* Main Body / Palm Rest */}
        <mesh geometry={shellGeometry} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={shellColor}
            roughness={0.4}
            metalness={0.05}
            envMapIntensity={1.0}
          />
        </mesh>

        {/* Recessed Scroll Wheel Channel / Cavity */}
        <mesh position={[0, 0.07, -0.28]}>
          <boxGeometry args={[0.07, 0.08, 0.44]} />
          <meshStandardMaterial color="#09090B" roughness={0.9} />
        </mesh>

        {/* Left Primary Clicker */}
        <mesh geometry={buttonGeometry} position={[-0.15, 0.075, -0.29]} rotation={[0.08, 0.01, -0.02]}>
          <meshStandardMaterial color={shellColor} roughness={0.35} metalness={0.05} />
        </mesh>

        {/* Right Primary Clicker */}
        <mesh geometry={buttonGeometry} position={[0.15, 0.075, -0.29]} rotation={[0.08, -0.01, 0.02]}>
          <meshStandardMaterial color={shellColor} roughness={0.35} metalness={0.05} />
        </mesh>

        {/* Textured Scroll Wheel */}
        <group position={[0, 0.085, -0.3]} rotation={[0, 0, Math.PI / 2]}>
          {/* Wheel Core */}
          <mesh>
            <cylinderGeometry args={[0.062, 0.062, 0.045, 32]} />
            <meshStandardMaterial color="#A1A1AA" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Ribbed Rubber Grip Ring */}
          <mesh>
            <cylinderGeometry args={[0.065, 0.065, 0.035, 24]} />
            <meshStandardMaterial color="#27272A" roughness={0.85} metalness={0.05} />
          </mesh>
        </group>

        {/* Left Side Grip Accent Panel */}
        <mesh position={[-0.29, -0.01, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.02, 0.12, 0.52]} />
          <meshStandardMaterial color={accent} roughness={0.8} metalness={0.05} />
        </mesh>

        {/* Right Side Grip Accent Panel */}
        <mesh position={[0.29, -0.01, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.02, 0.12, 0.52]} />
          <meshStandardMaterial color={accent} roughness={0.8} metalness={0.05} />
        </mesh>

        {/* DPI / Utility Button */}
        <mesh position={[0, 0.118, -0.02]}>
          <boxGeometry args={[0.04, 0.015, 0.06]} />
          <meshStandardMaterial color={accent} roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Subtle LED Sensor / Indicator Light */}
        <mesh position={[0, 0.12, 0.05]}>
          <cylinderGeometry args={[0.004, 0.004, 0.003, 12]} />
          <meshStandardMaterial color={detail} emissive={detail} emissiveIntensity={1.0} />
        </mesh>

        {/* Bottom Base Plate & Glides */}
        <group position={[0, -0.11, 0]}>
          {/* Chassis Plate */}
          <mesh>
            <boxGeometry args={[0.52, 0.008, 0.98]} />
            <meshStandardMaterial color="#09090B" roughness={0.8} />
          </mesh>

          {/* Optical Sensor Eye */}
          <mesh position={[0, -0.002, -0.02]}>
            <cylinderGeometry args={[0.022, 0.022, 0.01, 16]} />
            <meshStandardMaterial color={detail} emissive={detail} emissiveIntensity={0.6} />
          </mesh>

          {/* Front PTFE Skate Pad */}
          <mesh position={[0, -0.005, -0.42]}>
            <boxGeometry args={[0.38, 0.004, 0.07]} />
            <meshStandardMaterial color="#18181B" roughness={0.15} />
          </mesh>

          {/* Rear PTFE Skate Pad */}
          <mesh position={[0, -0.005, 0.38]}>
            <boxGeometry args={[0.42, 0.004, 0.09]} />
            <meshStandardMaterial color="#18181B" roughness={0.15} />
          </mesh>
        </group>

      </group>
    </PrimitiveRig>
  );
}

export const Mouse = memo(forwardRef(MouseComponent));

export type { PrimitiveProps as MouseProps };