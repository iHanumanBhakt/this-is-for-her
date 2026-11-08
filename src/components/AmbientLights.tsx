import { useEffect, useRef } from 'react';

export const AmbientLights = () => {
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

    // Warm, delicate golden light motes & drifting lanterns
    interface Particle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      targetOpacity: number;
      blur: number;
      hue: number;
    }

    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.35 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      targetOpacity: Math.random() * 0.6 + 0.2,
      blur: Math.random() > 0.7 ? 8 : 2,
      hue: Math.random() * 20 + 35, // 35 to 55 (warm gold/amber)
    }));

    let time = 0;

    let previous = performance.now();
    const render = (now: number) => {
      const step = Math.min(2, (now - previous) / (1000 / 60));
      previous = now;
      time += 0.005 * step;
      ctx.clearRect(0, 0, width, height);

      // Render delicate floating golden motes
      particles.forEach((p) => {
        p.y += p.speedY * step;
        p.x += (p.speedX + Math.sin(p.y * 0.008 + time) * 0.3) * step;

        // Softly oscillate opacity
        p.opacity += (p.targetOpacity - p.opacity) * 0.02;
        if (Math.abs(p.opacity - p.targetOpacity) < 0.05) {
          p.targetOpacity = Math.random() * 0.6 + 0.15;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.opacity})`;
        ctx.shadowBlur = p.blur;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ background: "radial-gradient(ellipse at 50% 68%, #271710, #140e13 40%, #09080b 82%)" }}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
