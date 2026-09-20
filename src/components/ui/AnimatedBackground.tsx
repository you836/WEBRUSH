import { ModelViewer } from '@/components/ui/ModelViewer';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 3D Classroom Background */}
      <div className="absolute inset-0 w-full h-full opacity-90 pointer-events-none">
        <ModelViewer
          url="/models/classroom.glb"
          height="100vh"
          width="100vw"
          targetScale={4.4}
          defaultZoom={2.4}
          modelYOffset={-0.20}
          defaultRotationX={12}
          defaultRotationY={-22}
          hideCeiling={true}
          hideObstructingWalls={true}
          swayMode={true}
          autoRotateSpeed={0.20}
          ambientIntensity={5.0}
          keyLightIntensity={7.0}
          fillLightIntensity={5.5}
          rimLightIntensity={5.0}
          environmentPreset="sunset"
          enableHoverRotation={true}
          enableMouseParallax={true}
          className="w-full h-full"
        />
      </div>

      {/* Blurry Black Background Overlay */}
      <div className="absolute inset-0 bg-[#0a0806]/60 backdrop-blur-[8px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#0a0806]/40 to-[#0a0806]/85 pointer-events-none" />
    </div>
  );
}

export default AnimatedBackground;
