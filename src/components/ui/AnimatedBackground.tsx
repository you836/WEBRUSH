import { useEffect, useRef } from 'react';
import { ModelViewer } from '@/components/ui/ModelViewer';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palette matching theme
    const colors = [
      'rgba(232, 168, 73, ', // Amber
      'rgba(91, 138, 245, ', // Blue
      'rgba(167, 139, 250, ', // Purple/Music
    ];

    // Ambient floating particles
    const particleCount = Math.min(Math.floor((width * height) / 45000), 16);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        alpha: Math.random() * 0.12 + 0.03,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 3D High-Res Interior Classroom - Crisp, bright, full opacity */}
      <div className="absolute inset-0 w-full h-full opacity-100 pointer-events-none">
        <ModelViewer
          url="/models/classroom.glb"
          height="100vh"
          width="100vw"
          targetScale={5.0}
          defaultZoom={2.0}
          modelYOffset={-0.28}
          defaultRotationX={-14}
          defaultRotationY={20}
          hideCeiling={true}
          hideObstructingWalls={true}
          swayMode={true}
          autoRotateSpeed={0.22}
          ambientIntensity={4.2}
          keyLightIntensity={6.0}
          fillLightIntensity={4.8}
          rimLightIntensity={4.5}
          environmentPreset="sunset"
          enableHoverRotation={true}
          enableMouseParallax={true}
          className="w-full h-full"
        />
      </div>

      {/* Subtle ambient particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" />
    </div>
  );
}

export default AnimatedBackground;
