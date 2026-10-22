import "../styles/sections/skills.css";
import type { CSSProperties } from "react";
import { SKILLS } from "../data/portfolio";

/* Die-cut sticker sheet: one colour per group, handwritten group labels. */

const GROUP_COLORS: { c: string; ci: string }[] = [
  { c: "var(--w-sun)", ci: "var(--w-paper-ink)" },
  { c: "var(--w-cobalt)", ci: "#FFFFFF" },
  { c: "var(--w-pink)", ci: "var(--w-paper-ink)" },
  { c: "var(--w-mint)", ci: "var(--w-paper-ink)" },
  { c: "var(--w-green)", ci: "var(--w-paper-ink)" },
  { c: "var(--w-orange)", ci: "var(--w-paper-ink)" },
];
const TILTS = [-2.5, 1.8, -1, 2.6, -1.8, 1, -2.2, 2.2, -0.6, 1.4, -1.4];
const SHAPES = ["999px", "14px", "999px 999px 999px 8px", "12px"];

/** A few stickers get a peeled corner; one lifts and one gets slapped back on, as decoration. */
const extra = (g: number, i: number) => {
  if (g === 1 && i === 4) return " sk-lift";
  if (g === 4 && i === 0) return " sk-slap";
  return (g * 3 + i * 2) % 7 === 3 ? " sk-peel" : "";
};

const Arrow = () => (
  <svg viewBox="0 0 60 30" aria-hidden="true" focusable="false">
    <path
      d="M3 6 C 20 2, 40 8, 50 22 M 42 21 L 51 23 L 52 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Skills() {
  return (
    <section id="skills" className="sk" aria-labelledby="sk-title">
      <div className="sk-in">
        <div className="sk-head rv">
          <div className="sk-burst">
            <svg viewBox="0 0 250 150" aria-hidden="true" focusable="false">
              <polygon
                points="125,4 146,38 190,14 180,52 244,48 202,78 246,104 184,104 196,144 148,118 125,148 104,118 54,142 66,104 6,106 50,78 4,50 70,52 60,12 104,38"
                fill="var(--w-sun)"
              />
            </svg>
            <h2 id="sk-title">Skills</h2>
          </div>
          <p>the sheet I keep reaching into. grouped, peel-and-stick</p>
        </div>

        <div className="sk-sheet rv" data-d="1">
          {SKILLS.map((g, gi) => {
            const col = GROUP_COLORS[gi % GROUP_COLORS.length];
            return (
              <div
                className="sk-z"
                key={g.cat}
                style={{ "--c": col.c, "--ci": col.ci, "--zi": gi } as CSSProperties}
              >
                <h3>
                  {g.cat}
                  <Arrow />
                </h3>
                <ul>
                  {g.items.map((it, i) => (
                    <li
                      key={it}
                      className={`sk-s${extra(gi, i)}`}
                      style={
                        {
                          "--r": `${TILTS[(gi * 4 + i) % TILTS.length]}deg`,
                          "--sh": SHAPES[(gi + i) % SHAPES.length],
                          "--si": Math.min(i, 8),
                        } as CSSProperties
                      }
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
