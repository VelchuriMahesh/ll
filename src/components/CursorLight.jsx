import { useEffect, useRef, useState } from "react";

const SPARK_COLORS = [
  "#c084fc", "#f0abfc", "#818cf8",
  "#fb7185", "#fde68a", "#ffffff",
  "#e879f9", "#a5f3fc",
];

let UID = 0;

export default function CursorLight() {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ mouse: { x:-500, y:-500 }, visible: false, trail: [], sparks: [] });
  const rafRef    = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover:none)").matches) return;

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const s    = stateRef.current;
      const prev = { ...s.mouse };
      s.mouse    = { x: e.clientX, y: e.clientY };
      s.visible  = true;

      const dx    = s.mouse.x - prev.x;
      const dy    = s.mouse.y - prev.y;
      const speed = Math.sqrt(dx*dx + dy*dy);

      s.trail.push({ x: e.clientX, y: e.clientY, age: 0, maxAge: 18 + speed * 0.4 });

      if (speed > 4) {
        const count = Math.floor(Math.min(speed * 0.35, 8));
        for (let i = 0; i < count; i++) {
          const angle = Math.atan2(dy, dx) + Math.PI + (Math.random() - 0.5) * 1.4;
          const vel   = 1.5 + Math.random() * speed * 0.18;
          s.sparks.push({
            id: UID++,
            x: e.clientX + (Math.random()-0.5)*6,
            y: e.clientY + (Math.random()-0.5)*6,
            vx: Math.cos(angle) * vel,
            vy: Math.sin(angle) * vel - Math.random() * 1.5,
            life: 1,
            decay: 0.025 + Math.random() * 0.045,
            size: 1.5 + Math.random() * 4,
            color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          });
        }
      }
    };

    const onClick = (e) => {
      const s = stateRef.current;
      for (let i = 0; i < 22; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel   = 2 + Math.random() * 7;
        s.sparks.push({
          id: UID++,
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle)*vel, vy: Math.sin(angle)*vel,
          life: 1, decay: 0.018 + Math.random()*0.03,
          size: 2 + Math.random()*6,
          color: SPARK_COLORS[Math.floor(Math.random()*SPARK_COLORS.length)],
        });
      }
    };

    const onLeave = () => { stateRef.current.visible = false; };
    const onEnter = () => { stateRef.current.visible = true;  };

    window.addEventListener("mousemove",  onMove);
    window.addEventListener("click",      onClick);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);

    const render = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!s.visible) { rafRef.current = requestAnimationFrame(render); return; }

      // age trail
      s.trail = s.trail.filter((p) => { p.age += 1; return p.age < p.maxAge; });

      // draw tail
      if (s.trail.length > 2) {
        for (let i = 1; i < s.trail.length; i++) {
          const p0  = s.trail[i-1];
          const p1  = s.trail[i];
          const t0  = 1 - p0.age / p0.maxAge;
          const t1  = 1 - p1.age / p1.maxAge;
          const avg = (t0 + t1) * 0.5;
          const w   = avg * 14;
          if (w < 0.3) continue;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(168,85,247,${avg * 0.85})`;
          ctx.lineWidth   = w;
          ctx.lineCap     = "round";
          ctx.shadowColor = "#c084fc";
          ctx.shadowBlur  = w * 3;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(255,255,255,${avg * 0.55})`;
          ctx.lineWidth   = w * 0.25;
          ctx.shadowBlur  = w * 1.5;
          ctx.shadowColor = "#ffffff";
          ctx.stroke();
          ctx.restore();
        }
      }

      // draw sparks
      s.sparks = s.sparks.filter((sp) => {
        sp.life -= sp.decay;
        sp.x    += sp.vx;
        sp.y    += sp.vy;
        sp.vy   += 0.08;
        sp.vx   *= 0.97;
        if (sp.life <= 0) return false;
        const r = sp.size * sp.life;
        ctx.save();
        ctx.globalAlpha = sp.life;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, Math.max(0.1, r), 0, Math.PI * 2);
        ctx.shadowColor = sp.color;
        ctx.shadowBlur  = r * 4;
        ctx.fillStyle   = sp.color;
        ctx.fill();
        ctx.restore();
        return true;
      });

      // cursor head glow
      const mx = s.mouse.x, my = s.mouse.y;
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 28);
      grad.addColorStop(0,   "rgba(232,121,249,0.55)");
      grad.addColorStop(0.4, "rgba(168,85,247,0.2)");
      grad.addColorStop(1,   "rgba(168,85,247,0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, 28, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      const core = ctx.createRadialGradient(mx, my, 0, mx, my, 5);
      core.addColorStop(0,   "rgba(255,255,255,1)");
      core.addColorStop(0.4, "rgba(240,171,252,0.9)");
      core.addColorStop(1,   "rgba(168,85,247,0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, 5, 0, Math.PI*2);
      ctx.fillStyle   = core;
      ctx.shadowColor = "#f0abfc";
      ctx.shadowBlur  = 20;
      ctx.fill();
      ctx.restore();

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("click",      onClick);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("resize",     resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        9000,   /* below modals (99998+) but above normal content */
        pointerEvents: "none", /* CRITICAL — lets ALL clicks pass through to cards */
        mixBlendMode:  "screen",
      }}
    />
  );
}