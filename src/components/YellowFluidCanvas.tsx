import { useEffect, useRef } from "react";
import "./YellowFluidCanvas.css";

const YellowFluidCanvas = () => {
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

          // Slower, wider swirl for the yellow canvas
          const swirlAngle = angle + (1.0 - dist) * 2.0 - t * 0.08;
          const sx = cx + Math.cos(swirlAngle) * dist;
          const sy = cy + Math.sin(swirlAngle) * dist;

          // Layered noise
          const n1 = noise2D(sx * 2.5 + t * 0.15, sy * 2.5 - t * 0.1);
          const n2 = noise2D(sx * 4.0 - t * 0.1, sy * 3.5 + t * 0.15);
          const n3 = noise2D(sx * 1.8 + t * 0.05, sy * 2.0 + t * 0.12);
          const val = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
          const mapped = (val + 1) * 0.5;

          // Yellow/green color mapping (dark moss → olive → goldenrod → bright yellow)
          let r: number, g: number, b: number;
          if (mapped < 0.25) {
            // Very dark moss green / almost black
            const f = mapped / 0.25;
            r = 10 + f * 20;
            g = 20 + f * 30;
            b = 5 + f * 10;
          } else if (mapped < 0.45) {
            // Dark olive
            const f = (mapped - 0.25) / 0.2;
            r = 30 + f * 40;
            g = 50 + f * 60;
            b = 15 + f * 15;
          } else if (mapped < 0.65) {
            // Muddy yellow / mustard
            const f = (mapped - 0.45) / 0.2;
            r = 70 + f * 80;
            g = 110 + f * 60;
            b = 30 + f * 10;
          } else if (mapped < 0.85) {
            // Golden yellow
            const f = (mapped - 0.65) / 0.2;
            r = 150 + f * 70;
            g = 170 + f * 50;
            b = 40 + f * 10;
          } else {
            // Bright greenish-yellow highlight
            const f = (mapped - 0.85) / 0.15;
            r = 220 + f * 35;
            g = 220 + f * 35;
            b = 50 + f * 20;
          }

          // Write 2x2 block with strong per-pixel grain
          for (let oy = 0; oy < step && py + oy < h; oy++) {
            for (let ox = 0; ox < step && px + ox < w; ox++) {
              const idx = ((py + oy) * w + (px + ox)) * 4;
              const grain = (Math.random() - 0.5) * 55;
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
      vignetteGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
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
    <div className="yellow-fluid-canvas">
      <canvas ref={canvasRef} className="yellow-fluid-canvas__el" />
    </div>
  );
};

export default YellowFluidCanvas;
