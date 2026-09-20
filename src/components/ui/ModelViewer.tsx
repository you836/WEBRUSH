/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
import { Suspense, useRef, useLayoutEffect, useEffect, useMemo, type CSSProperties } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useGLTF, useFBX, useProgress, Html, Environment, ContactShadows } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';

const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const deg2rad = (d: number) => (d * Math.PI) / 180;
const ROTATE_SPEED = 0.005;
const INERTIA = 0.925;
const PARALLAX_MAG = 0.08;
const PARALLAX_EASE = 0.12;

const Loader = ({ placeholderSrc }: { placeholderSrc?: string }) => {
  const { progress, active } = useProgress();
  if (!active && placeholderSrc) return null;
  return (
    <Html center>
      {placeholderSrc ? (
        <img
          src={placeholderSrc}
          width={128}
          height={128}
          alt="Loading 3D model"
          style={{ borderRadius: 8 }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 bg-[#121110]/95 backdrop-blur-md px-5 py-3 rounded-full border border-[#e8a849]/50 text-[#e8a849] font-mono text-xs shadow-2xl">
          <div className="w-3.5 h-3.5 border-2 border-[#e8a849] border-t-transparent rounded-full animate-spin" />
          <span>Rendering High-Res 3D Interior ({Math.round(progress)}%)</span>
        </div>
      )}
    </Html>
  );
};

interface ModelInnerProps {
  url: string;
  xOff: number;
  yOff: number;
  initYaw: number;
  initPitch: number;
  targetScale?: number;
  enableMouseParallax: boolean;
  enableManualRotation: boolean;
  enableHoverRotation: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  hideCeiling?: boolean;
  hideObstructingWalls?: boolean;
  swayMode?: boolean;
  onLoaded?: () => void;
}

const ModelInner = ({
  url,
  xOff,
  yOff,
  initYaw,
  initPitch,
  targetScale = 3.8,
  enableMouseParallax,
  enableManualRotation,
  enableHoverRotation,
  autoRotate,
  autoRotateSpeed,
  hideCeiling = true,
  hideObstructingWalls = true,
  swayMode = true,
  onLoaded
}: ModelInnerProps) => {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { gl } = useThree();

  const vel = useRef({ x: 0, y: 0 });
  const tPar = useRef({ x: 0, y: 0 });
  const cPar = useRef({ x: 0, y: 0 });
  const tHov = useRef({ x: 0, y: 0 });
  const cHov = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  const ext = useMemo(() => url.split('?')[0].split('.').pop()?.toLowerCase() || 'glb', [url]);

  const content = useMemo(() => {
    try {
      if (ext === 'glb' || ext === 'gltf') {
        const gltf = useGLTF(url);
        return gltf.scene.clone();
      }
      if (ext === 'fbx') {
        const fbx = useFBX(url);
        return fbx.clone();
      }
      if (ext === 'obj') {
        const obj = useLoader(OBJLoader, url);
        return obj.clone();
      }
    } catch (e) {
      console.error('Failed to load 3D model format:', ext, e);
    }
    return null;
  }, [url, ext]);

  useLayoutEffect(() => {
    if (!content || !inner.current || !outer.current) return;

    // Accurately compute bounding box and center the model geometry
    content.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(content);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDim > 0 ? targetScale / maxDim : 1;

    // Center content geometry at origin
    content.position.set(-center.x, -center.y, -center.z);

    // Apply scale to inner group
    inner.current.scale.setScalar(scaleFactor);
    inner.current.position.set(xOff, yOff, 0);

    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

    content.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;

        // Double-side all interior materials and boost texture sharpness (anisotropy)
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m: any) => {
            m.side = THREE.DoubleSide;
            m.roughness = Math.min(m.roughness ?? 0.5, 0.7);
            
            // Texture quality enhancements - eliminate blur
            if (m.map) {
              m.map.anisotropy = maxAnisotropy;
              m.map.minFilter = THREE.LinearMipmapLinearFilter;
              m.map.magFilter = THREE.LinearFilter;
              m.map.generateMipmaps = true;
              m.map.needsUpdate = true;
            }
          });
        }

        const name = (o.name || '').toLowerCase();
        // Hide godrays that appear as dark/opaque blocks
        if (name.includes('godray')) {
          o.visible = false;
        }

        // Hide ceiling to open up the room interior
        if (hideCeiling && (name.includes('ceilling') || name.includes('ceiling') || name.includes('roof'))) {
          o.visible = false;
        }

        // Hide obstructing exterior walls so interior is always 100% visible
        if (hideObstructingWalls && (name.includes('wall.004') || name.includes('wall.001') || name.includes('wall.002'))) {
          o.visible = false;
        }
      }
    });

    outer.current.rotation.set(initPitch, initYaw, 0);
    onLoaded?.();
  }, [content, gl, hideCeiling, hideObstructingWalls, initPitch, initYaw, onLoaded, targetScale, xOff, yOff]);

  useEffect(() => {
    if (!enableManualRotation || isTouch) return;
    const el = gl.domElement;
    let drag = false;
    let lx = 0, ly = 0;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      drag = true;
      lx = e.clientX;
      ly = e.clientY;
      window.addEventListener('pointerup', up);
    };
    const move = (e: PointerEvent) => {
      if (!drag || !outer.current) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      outer.current.rotation.y += dx * ROTATE_SPEED;
      outer.current.rotation.x += dy * ROTATE_SPEED;
      vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
    };
    const up = () => (drag = false);
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl, enableManualRotation]);

  useEffect(() => {
    if (isTouch) return;
    const mm = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (enableMouseParallax) tPar.current = { x: -nx * PARALLAX_MAG, y: -ny * PARALLAX_MAG };
      if (enableHoverRotation) tHov.current = { x: ny * 0.08, y: nx * 0.08 };
    };
    window.addEventListener('pointermove', mm);
    return () => window.removeEventListener('pointermove', mm);
  }, [enableMouseParallax, enableHoverRotation]);

  useFrame((_, dt) => {
    if (!outer.current) return;
    timeRef.current += dt;

    cPar.current.x += (tPar.current.x - cPar.current.x) * PARALLAX_EASE;
    cPar.current.y += (tPar.current.y - cPar.current.y) * PARALLAX_EASE;

    const phx = cHov.current.x;
    const phy = cHov.current.y;
    cHov.current.x += (tHov.current.x - cHov.current.x) * 0.1;
    cHov.current.y += (tHov.current.y - cHov.current.y) * 0.1;

    outer.current.position.x = cPar.current.x;
    outer.current.position.y = cPar.current.y;

    if (swayMode) {
      // Smooth cinematic interior sway - reveals all interior desks & blackboard without spinning into black back walls
      const sway = Math.sin(timeRef.current * autoRotateSpeed) * 0.38;
      outer.current.rotation.y = initYaw + sway + (cHov.current.y - phy);
      outer.current.rotation.x = initPitch + Math.cos(timeRef.current * (autoRotateSpeed * 0.7)) * 0.06 + (cHov.current.x - phx);
    } else if (autoRotate) {
      outer.current.rotation.y += autoRotateSpeed * dt;
      outer.current.rotation.x += cHov.current.x - phx;
    } else {
      outer.current.rotation.x += cHov.current.x - phx;
      outer.current.rotation.y += cHov.current.y - phy;
    }

    outer.current.rotation.y += vel.current.x;
    outer.current.rotation.x += vel.current.y;
    vel.current.x *= INERTIA;
    vel.current.y *= INERTIA;
  });

  if (!content) return null;
  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={content} />
      </group>
    </group>
  );
};

export interface ModelViewerProps {
  url: string;
  width?: string | number;
  height?: string | number;
  modelXOffset?: number;
  modelYOffset?: number;
  defaultRotationX?: number;
  defaultRotationY?: number;
  defaultZoom?: number;
  targetScale?: number;
  minZoomDistance?: number;
  maxZoomDistance?: number;
  enableMouseParallax?: boolean;
  enableManualRotation?: boolean;
  enableHoverRotation?: boolean;
  enableManualZoom?: boolean;
  hideCeiling?: boolean;
  hideObstructingWalls?: boolean;
  swayMode?: boolean;
  ambientIntensity?: number;
  keyLightIntensity?: number;
  fillLightIntensity?: number;
  rimLightIntensity?: number;
  environmentPreset?: 'apartment' | 'city' | 'dawn' | 'forest' | 'lobby' | 'night' | 'park' | 'studio' | 'sunset' | 'warehouse' | 'none';
  placeholderSrc?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
  style?: CSSProperties;
  onModelLoaded?: () => void;
}

export const ModelViewer = ({
  url,
  width = '100%',
  height = '100%',
  modelXOffset = 0,
  modelYOffset = -0.15,
  defaultRotationX = -32,
  defaultRotationY = 22,
  defaultZoom = 2.5,
  targetScale = 3.9,
  minZoomDistance = 0.5,
  maxZoomDistance = 15,
  enableMouseParallax = true,
  enableManualRotation = false,
  enableHoverRotation = true,
  hideCeiling = true,
  hideObstructingWalls = true,
  swayMode = true,
  ambientIntensity = 1.8,
  keyLightIntensity = 3.4,
  fillLightIntensity = 2.2,
  rimLightIntensity = 2.4,
  environmentPreset = 'sunset',
  placeholderSrc,
  autoRotate = true,
  autoRotateSpeed = 0.35,
  className = '',
  style,
  onModelLoaded
}: ModelViewerProps) => {
  useEffect(() => {
    if (url && (url.endsWith('.glb') || url.endsWith('.gltf'))) {
      try {
        useGLTF.preload(url);
      } catch {
        // Safe preload
      }
    }
  }, [url]);

  const initPitch = deg2rad(defaultRotationX);
  const initYaw = deg2rad(defaultRotationY);
  const camZ = Math.min(Math.max(defaultZoom, minZoomDistance), maxZoomDistance);

  return (
    <div
      className={`relative select-none overflow-hidden ${className}`}
      style={{
        width,
        height,
        ...style
      }}
    >
      <Canvas
        shadows
        frameloop="always"
        dpr={[1, 2]} // High-DPI crystal clear resolution
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 2.0; // Radiant, crystal-clear exposure
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        camera={{ fov: 52, position: [0, 0.9, camZ], near: 0.01, far: 100 }}
        style={{ pointerEvents: 'none', background: 'transparent' }}
      >
        {environmentPreset !== 'none' && <Environment preset={environmentPreset} background={false} />}

        {/* 360-degree High-Vibrancy Studio & Classroom Lighting */}
        <ambientLight intensity={ambientIntensity} color="#fffcf5" />
        <hemisphereLight intensity={2.4} color="#ffe8cc" groundColor="#4a3f35" />
        
        {/* Cardinal Directional Lights */}
        <directionalLight position={[8, 14, 8]} intensity={keyLightIntensity} color="#fff8f0" castShadow />
        <directionalLight position={[-8, 10, -8]} intensity={fillLightIntensity} color="#ffe2b8" />
        <directionalLight position={[8, 10, -8]} intensity={fillLightIntensity} color="#ffe2b8" />
        <directionalLight position={[-8, 8, 8]} intensity={rimLightIntensity} color="#e8a849" />
        
        {/* Warm Classroom Center Fill Lights */}
        <pointLight position={[0, 2.5, 0]} intensity={5.5} color="#fff6e8" distance={16} decay={1.2} />
        <pointLight position={[2, 1.8, 1]} intensity={3.5} color="#ffeacc" distance={10} decay={1.2} />

        <Suspense fallback={<Loader placeholderSrc={placeholderSrc} />}>
          <ModelInner
            url={url}
            xOff={modelXOffset}
            yOff={modelYOffset}
            initYaw={initYaw}
            initPitch={initPitch}
            targetScale={targetScale}
            enableMouseParallax={enableMouseParallax}
            enableManualRotation={enableManualRotation}
            enableHoverRotation={enableHoverRotation}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            hideCeiling={hideCeiling}
            hideObstructingWalls={hideObstructingWalls}
            swayMode={swayMode}
            onLoaded={onModelLoaded}
          />
        </Suspense>

        <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={14} blur={2} far={5} color="#000000" />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
