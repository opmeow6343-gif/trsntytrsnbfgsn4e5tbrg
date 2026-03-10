import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches || window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mx = -100, my = -100;
    let cx = -100, cy = -100;
    let hovering = false;
    let scale = 1;
    let targetScale = 1;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });

    const hoverIn = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,[role='button'],input,textarea,select,label,.cursor-pointer")) {
        hovering = true;
        targetScale = 1.6;
      }
    };
    const hoverOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,[role='button'],input,textarea,select,label,.cursor-pointer")) {
        hovering = false;
        targetScale = 1;
      }
    };
    document.addEventListener("mouseover", hoverIn, { passive: true });
    document.addEventListener("mouseout", hoverOut, { passive: true });

    let raf: number;
    const draw = () => {
    cx += (mx - cx) * 0.35;
      cy += (my - cy) * 0.35;
      scale += (targetScale - scale) * 0.2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const s = 12 * scale;
      const lineLen = s;
      const gap = 4 * scale;
      const thickness = 1.5;

      // Glow color
      const color = hovering ? "hsl(160, 100%, 60%)" : "hsl(160, 100%, 50%)";
      const glowAlpha = hovering ? 0.5 : 0.3;

      ctx.save();
      ctx.translate(cx, cy);

      // Outer glow
      ctx.shadowColor = `hsla(160, 100%, 50%, ${glowAlpha})`;
      ctx.shadowBlur = hovering ? 20 : 12;

      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";

      // Top line
      ctx.beginPath();
      ctx.moveTo(0, -gap);
      ctx.lineTo(0, -gap - lineLen);
      ctx.stroke();

      // Bottom line
      ctx.beginPath();
      ctx.moveTo(0, gap);
      ctx.lineTo(0, gap + lineLen);
      ctx.stroke();

      // Left line
      ctx.beginPath();
      ctx.moveTo(-gap, 0);
      ctx.lineTo(-gap - lineLen, 0);
      ctx.stroke();

      // Right line
      ctx.beginPath();
      ctx.moveTo(gap, 0);
      ctx.lineTo(gap + lineLen, 0);
      ctx.stroke();

      // Center dot
      ctx.shadowBlur = hovering ? 16 : 8;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, hovering ? 2.5 : 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Rotating outer ring when hovering
      if (hovering) {
        const time = Date.now() * 0.003;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = `hsla(160, 100%, 55%, 0.3)`;
        ctx.lineWidth = 1;
        const ringR = s + 6;
        
        for (let i = 0; i < 4; i++) {
          const angle = time + (i * Math.PI / 2);
          const arcLen = 0.4;
          ctx.beginPath();
          ctx.arc(0, 0, ringR, angle, angle + arcLen);
          ctx.stroke();
        }
      }

      ctx.restore();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", hoverIn);
      document.removeEventListener("mouseout", hoverOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100001] pointer-events-none hidden lg:block"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default CustomCursor;
