import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

const FADE_MS = 800;
const ACCENT = { r: 229, g: 56, b: 59 }; // --accent #e5383b
const MESSAGE = "WELCOME TO\nSOUMYA'S PORTFOLIO";

/** Boot screen: red particles converge from across the whole page to spell the welcome, then Enter/click reveals the site. */
export default function Splash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const goneRef = useRef(false);

  // Canvas fills the viewport so particles originate from the entire page.
  const size = useMemo(() => ({ w: window.innerWidth, h: window.innerHeight }), []);

  const dismiss = useCallback(() => {
    if (goneRef.current) return;
    goneRef.current = true;
    setLeaving(true);
    window.setTimeout(() => {
      document.body.style.overflow = "";
      onDone();
    }, FADE_MS);
  }, [onDone]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoTimer = window.setTimeout(dismiss, reduce ? 800 : 30000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(autoTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [dismiss]);

  return (
    <div
      onClick={dismiss}
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--bg)",
        overflow: "hidden",
        cursor: "pointer",
        opacity: leaving ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      <ParticleTextEffect
        words={[MESSAGE]}
        color={ACCENT}
        transparent
        width={size.w}
        height={size.h}
        style={{ position: "absolute", inset: 0, width: "100vw", height: "100vh", maxWidth: "none" }}
      />
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "7%",
          textAlign: "center",
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: "12px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        press <b style={{ color: "var(--accent)", fontWeight: 600 }}>Enter</b> to continue
      </span>
    </div>
  );
}
