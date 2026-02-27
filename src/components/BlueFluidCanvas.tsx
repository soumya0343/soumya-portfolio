import { useEffect, useRef } from "react";
import "./BlueFluidCanvas.css";

const BlueFluidCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener("resize", resize);

    const noise2D = (x: number, y: number): number => {
      const s1 = Math.sin(x * 1.2) * Math.cos(y * 0.9);
      const s2 = Math.sin(x * 0.7 + y * 1.1) * Math.cos(x * 0.4 - y * 0.8);
      const s3 = Math.sin(x * 2.1 - y * 0.3) * Math.sin(y * 1.7 + x * 0.5);
      const s4 = Math.cos(x * 0.9 + y * 1.3) * Math.sin(x * 1.5 - y * 0.6);
      return (s1 + s2 + s3 + s4) * 0.25;
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (w === 0 || h === 0) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const imageData = ctx.createImageData(w, h);
      const pixels = imageData.data;
      const t = time;
      const step = 2;

      for (let py = 0; py < h; py += step) {
        for (let px = 0; px < w; px += step) {
          const nx = px / w;
          const ny = py / h;

          // Swirl distortion
          const cx = 0.5;
          const cy = 0.5;
          const dx = nx - cx;
          const dy = ny - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          const swirlAngle = angle + (1.0 - dist) * 3.0 + t * 0.12;
          const sx = cx + Math.cos(swirlAngle) * dist;
          const sy = cy + Math.sin(swirlAngle) * dist;

          // Layered noise
          const n1 = noise2D(sx * 3.0 + t * 0.25, sy * 3.0 - t * 0.2);
          const n2 = noise2D(sx * 5.0 - t * 0.12, sy * 4.0 + t * 0.2);
          const n3 = noise2D(sx * 2.0 + t * 0.08, sy * 2.5 + t * 0.15);
          const val = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
          const mapped = (val + 1) * 0.5;

          // Blue/purple color mapping
          let r: number, g: number, b: number;
          if (mapped < 0.25) {
            // Deep dark blue
            const f = mapped / 0.25;
            r = 5 + f * 10;
            g = 5 + f * 10;
            b = 30 + f * 40;
          } else if (mapped < 0.45) {
            // Dark blue to indigo
            const f = (mapped - 0.25) / 0.2;
            r = 15 + f * 25;
            g = 15 + f * 15;
            b = 70 + f * 50;
          } else if (mapped < 0.6) {
            // Indigo to blue-purple
            const f = (mapped - 0.45) / 0.15;
            r = 40 + f * 40;
            g = 30 + f * 20;
            b = 120 + f * 40;
          } else if (mapped < 0.75) {
            // Purple
            const f = (mapped - 0.6) / 0.15;
            r = 80 + f * 50;
            g = 50 + f * 30;
            b = 160 + f * 30;
          } else if (mapped < 0.9) {
            // Bright purple / lavender
            const f = (mapped - 0.75) / 0.15;
            r = 130 + f * 40;
            g = 80 + f * 40;
            b = 190 + f * 30;
          } else {
            // Light lavender highlight
            const f = (mapped - 0.9) / 0.1;
            r = 170 + f * 40;
            g = 120 + f * 50;
            b = 220 + f * 25;
          }

          // Write 2x2 block with per-pixel grain
          for (let oy = 0; oy < step && py + oy < h; oy++) {
            for (let ox = 0; ox < step && px + ox < w; ox++) {
              const idx = ((py + oy) * w + (px + ox)) * 4;
              const grain = (Math.random() - 0.5) * 50;
              pixels[idx] = Math.max(0, Math.min(255, (r + grain) | 0));
              pixels[idx + 1] = Math.max(0, Math.min(255, (g + grain) | 0));
              pixels[idx + 2] = Math.max(0, Math.min(255, (b + grain) | 0));
              pixels[idx + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Vignette
      const vignetteGrad = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        Math.min(w, h) * 0.1,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.85,
      );
      vignetteGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignetteGrad.addColorStop(1, "rgba(0, 0, 0, 0.3)");
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, w, h);

      time += 0.005;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="blue-fluid-canvas">
      <canvas ref={canvasRef} className="blue-fluid-canvas__el" />
    </div>
  );
};

export default BlueFluidCanvas;
