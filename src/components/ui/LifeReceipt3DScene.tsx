/* eslint-disable react/no-unknown-property */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, Text, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Vinyl Record with Golden Center Label
function VinylRecord({ position = [0, 0, 0] as [number, number, number], rotation = [0.4, 0, 0] as [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.45;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Outer Vinyl Disc */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 2.8, 0.04, 64]} />
        <meshStandardMaterial
          color="#0d0c0b"
          roughness={0.25}
          metalness={0.9}
          bumpScale={0.05}
        />
      </mesh>

      {/* Grooves / Concentric Rings */}
      {[1.2, 1.6, 2.0, 2.4].map((radius, i) => (
        <mesh key={i} position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.05, radius, 64]} />
          <meshBasicMaterial color="#28241e" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Center Golden Label */}
      <mesh position={[0, 0.026, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.01, 64]} />
        <meshStandardMaterial
          color="#e8a849"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Center Spindle Hole */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
        <meshBasicMaterial color="#080706" />
      </mesh>

      {/* Text on Vinyl Label */}
      <Text
        position={[0, 0.032, 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.16}
        color="#0d0c0b"
        anchorX="center"
        anchorY="middle"
      >
        LIFE / RECEIPTS
      </Text>
      <Text
        position={[0, 0.032, -0.35]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        fontSize={0.12}
        color="#2a1f10"
        anchorX="center"
        anchorY="middle"
      >
        DIGITAL ARCHIVE
      </Text>
    </group>
  );
}

// Floating Titanium-Gold Smart Transaction Card
function FloatingBankCard({ position = [2.2, 0.4, 0.8] as [number, number, number], rotation = [-0.2, 0.6, 0.1] as [number, number, number] }) {
  const cardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cardRef.current) {
      const t = state.clock.getElapsedTime();
      cardRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.15;
      cardRef.current.rotation.y = rotation[1] + Math.sin(t * 0.6) * 0.12;
    }
  });

  return (
    <group ref={cardRef} position={position} rotation={rotation}>
      {/* Card Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.25, 0.03]} />
        <meshStandardMaterial
          color="#161412"
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Gold Edge Border */}
      <mesh position={[0, 0, 0.016]}>
        <boxGeometry args={[1.94, 1.19, 0.005]} />
        <meshStandardMaterial
          color="#e8a849"
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[0, 0, 0.019]}>
        <boxGeometry args={[1.88, 1.13, 0.005]} />
        <meshStandardMaterial
          color="#161412"
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Gold Smart EMV Chip */}
      <mesh position={[-0.55, 0.12, 0.025]}>
        <boxGeometry args={[0.35, 0.28, 0.01]} />
        <meshStandardMaterial color="#f0b45b" roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Card Typography */}
      <Text position={[-0.55, -0.32, 0.025]} fontSize={0.11} color="#f5f0e8" anchorX="left">
        LIFE PASS • 2026
      </Text>
      <Text position={[0.55, 0.38, 0.025]} fontSize={0.09} color="#e8a849" anchorX="right">
        UPI / TAP
      </Text>
    </group>
  );
}

// Glowing Orbital Data Rings & Floating Gold Coins
function OrbitalRings() {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.15;
      ringRef.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <group ref={ringRef}>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.8, 0.025, 16, 100]} />
        <meshStandardMaterial color="#e8a849" emissive="#e8a849" emissiveIntensity={0.6} metalness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[4.4, 0.02, 16, 100]} />
        <meshStandardMaterial color="#5b8af5" emissive="#5b8af5" emissiveIntensity={0.4} metalness={1} />
      </mesh>
    </group>
  );
}

// Interactive Camera & Mouse Parallax Rig
function SceneRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.8, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.5, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export interface LifeReceipt3DSceneProps {
  className?: string;
}

export function LifeReceipt3DScene({ className = '' }: LifeReceipt3DSceneProps) {
  return (
    <div className={`w-full h-full relative select-none ${className}`}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.8, 6.2], fov: 45 }}
        style={{ pointerEvents: 'none', background: 'transparent' }}
      >
        <SceneRig />

        {/* Studio & Ambient Gold Lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 6]} intensity={2.8} color="#fff6e8" castShadow />
        <directionalLight position={[-6, -2, 4]} intensity={1.5} color="#e8a849" />
        <directionalLight position={[0, -4, -3]} intensity={1.2} color="#5b8af5" />
        <pointLight position={[0, 2, 2]} intensity={2} color="#f5eedc" distance={8} />

        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
          <group position={[0.2, -0.1, 0]}>
            {/* The Central Iconic Vinyl Record */}
            <VinylRecord position={[-0.4, 0, -0.2]} rotation={[0.45, -0.3, 0.1]} />

            {/* The Floating Titanium Transaction Card */}
            <FloatingBankCard position={[1.9, 0.3, 0.6]} rotation={[-0.15, -0.4, 0.1]} />

            {/* Glowing Orbital Rings */}
            <OrbitalRings />
          </group>
        </Float>

        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.5}
          scale={12}
          blur={2.5}
          far={4}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}

export default LifeReceipt3DScene;
