/**
 * Drawn marks for the About bento.
 *
 * SVG rather than image assets: they inherit `currentColor`, so they follow the
 * accent token through both themes, scale to any tile without a second export,
 * and add nothing to the network. Each is a 60x60 viewBox so sizing is a single
 * number at the call site.
 *
 * Every mark is decorative — the card's own text carries the meaning — so they
 * are aria-hidden and never announced.
 */

type Mark = { size?: number };

const box = (size: number) => ({ width: size, height: size, display: "block" as const });

/** Multi-agent graph: the systems work described in "Who I am". */
export function AgentGraph({ size = 170 }: Mark) {
  return (
    <svg viewBox="0 0 60 60" style={box(size)} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.1" fill="none" opacity="0.85">
        <line x1="30" y1="12" x2="14" y2="34" />
        <line x1="30" y1="12" x2="46" y2="34" />
        <line x1="14" y1="34" x2="30" y2="48" />
        <line x1="46" y1="34" x2="30" y2="48" />
        <line x1="14" y1="34" x2="46" y2="34" />
      </g>
      <g fill="currentColor">
        <circle cx="30" cy="12" r="3.4" />
        <circle cx="14" cy="34" r="3.4" />
        <circle cx="46" cy="34" r="3.4" />
        <circle cx="30" cy="48" r="3.4" />
      </g>
    </svg>
  );
}

/** Quotation marks, for the card holding the three open questions. */
export function QuoteMark({ size = 150 }: Mark) {
  return (
    <svg viewBox="0 0 60 60" style={box(size)} aria-hidden="true" focusable="false">
      <g fill="currentColor" opacity="0.9">
        <path d="M14 34 q0-12 11-16 l2 4 q-7 3-7 10 h7 v12 h-13 z" />
        <path d="M34 34 q0-12 11-16 l2 4 q-7 3-7 10 h7 v12 h-13 z" />
      </g>
    </svg>
  );
}

/** Stacked layers, for the full-stack and distributed-systems list. */
export function StackLayers({ size = 140 }: Mark) {
  return (
    <svg viewBox="0 0 60 60" style={box(size)} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.2" fill="none">
        <path d="M30 8 L52 19 L30 30 L8 19 Z" />
        <path d="M8 30 L30 41 L52 30" />
        <path d="M8 41 L30 52 L52 41" />
      </g>
    </svg>
  );
}

/** Mandala, drawn from the visual art listed under Beyond engineering. */
export function Mandala({ size = 155 }: Mark) {
  const spokes = Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180);
  return (
    <svg viewBox="0 0 60 60" style={box(size)} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="0.8" fill="none">
        {spokes.map((a, i) => (
          <line key={`s${i}`} x1="30" y1="30" x2={30 + 24 * Math.cos(a)} y2={30 + 24 * Math.sin(a)} />
        ))}
        {spokes.map((a, i) => (
          <circle key={`c${i}`} cx={30 + 16 * Math.cos(a)} cy={30 + 16 * Math.sin(a)} r="4.5" />
        ))}
        <circle cx="30" cy="30" r="24" />
        <circle cx="30" cy="30" r="16" />
        <circle cx="30" cy="30" r="7" />
      </g>
    </svg>
  );
}

/** Commit graph, for the contribution card. */
export function CommitGraph({ size = 150 }: Mark) {
  return (
    <svg viewBox="0 0 60 60" style={box(size)} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.4" fill="none">
        <path d="M14 52 L14 22 Q14 14 22 14 L34 14" />
        <path d="M14 34 Q14 27 22 27 L40 27" />
        <path d="M14 42 Q14 46 22 46 L30 46" />
      </g>
      <g fill="currentColor">
        <circle cx="14" cy="52" r="3.2" />
        <circle cx="34" cy="14" r="3.2" />
        <circle cx="40" cy="27" r="3.2" />
        <circle cx="30" cy="46" r="3.2" />
      </g>
    </svg>
  );
}

/** Open book, for Currently reading. */
export function BookMark({ size = 140 }: Mark) {
  return (
    <svg viewBox="0 0 60 60" style={box(size)} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.3" fill="none">
        <path d="M12 14 h16 q4 0 4 4 v28 q0-4-4-4 h-16 z" />
        <path d="M48 14 h-16 q-4 0-4 4 v28 q0-4 4-4 h16 z" />
      </g>
    </svg>
  );
}

/* ---- small inline icons, one per interest ---------------------------- */

export function WaveIcon({ size = 26 }: Mark) {
  const bars = [10, 20, 30, 24, 14, 8];
  return (
    <svg viewBox="0 0 60 60" style={box(size)} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
        {bars.map((h, i) => {
          const x = 10 + i * 8;
          return <line key={i} x1={x} y1={30 - h / 2} x2={x} y2={30 + h / 2} />;
        })}
      </g>
    </svg>
  );
}

export function CompassIcon({ size = 26 }: Mark) {
  return (
    <svg viewBox="0 0 60 60" style={box(size)} aria-hidden="true" focusable="false">
      <circle cx="30" cy="30" r="21" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="30" cy="30" r="2.6" fill="currentColor" />
      <path d="M30 12 L34 28 L30 30 L26 28 Z" fill="currentColor" />
      <path d="M30 48 L26 32 L30 30 L34 32 Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

export function PeopleIcon({ size = 26 }: Mark) {
  return (
    <svg viewBox="0 0 60 60" style={box(size)} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="2.2" fill="none" opacity="0.9">
        <line x1="30" y1="16" x2="17" y2="38" />
        <line x1="30" y1="16" x2="43" y2="38" />
        <line x1="17" y1="38" x2="43" y2="38" />
      </g>
      <g fill="currentColor">
        <circle cx="30" cy="16" r="4.6" />
        <circle cx="17" cy="38" r="4.6" />
        <circle cx="43" cy="38" r="4.6" />
      </g>
    </svg>
  );
}

export function MandalaIcon({ size = 26 }: Mark) {
  return <Mandala size={size} />;
}
