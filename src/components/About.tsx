import "../styles/sections/about.css";
import type { CSSProperties, ReactNode, SyntheticEvent } from "react";
import GithubCal from "./GithubCal";
import { EDUCATION, EXPERIENCE, PROFILE } from "../data/portfolio";

/* About · "Scrapbook spread" (spec S04-B2). A ring-bound spread: ruled left
   page (who I am, how I think, where I'm heading), dotted right page
   (currently, reading, thinking about, beyond engineering). Under it, a
   felt pocket taped to the book holds the GitHub board (GithubCal).
   The book's pages are paper, so all of their text uses --w-paper-ink /
   --w-paper-muted and stays put when the ground goes dark. */

const TITLE = [
  { ch: "A", bg: "var(--w-sun)", ink: "var(--w-paper-ink)", r: -3.1, cp: "polygon(1.7% 3.9%,93.9% 5.5%,100% 97.3%,6.1% 100%)" },
  { ch: "b", bg: "var(--w-cobalt)", ink: "var(--w-paper)", r: -2.7, cp: "polygon(1.7% 0.6%,96.4% 2.9%,100% 95.0%,4.0% 100%)" },
  { ch: "o", bg: "var(--w-pink)", ink: "var(--w-paper-ink)", r: -1.8, cp: "polygon(1.8% 4.4%,98.9% 0.3%,100% 99.7%,2.0% 100%)" },
  { ch: "u", bg: "var(--w-green)", ink: "var(--w-paper-ink)", r: -5.1, cp: "polygon(1.8% 1.2%,94.4% 4.7%,100% 97.4%,7.0% 100%)" },
  { ch: "t", bg: "var(--w-orange)", ink: "var(--w-paper-ink)", r: 2.6, cp: "polygon(1.8% 5.0%,97.0% 2.1%,100% 95.1%,5.0% 100%)" },
];

/** "Engineering: Full-Stack Products, Backend Systems" -> { name, items }. */
const ROUTES = PROFILE.focus.map((line, i) => {
  const [name, rest = ""] = line.split(/:\s*/);
  return {
    name,
    items: rest.split(/,\s*/).filter(Boolean),
    c: i === 0 ? "var(--w-sun)" : "var(--w-mint)",
  };
});

const QUOTE_COLOURS = ["var(--w-coral)", "var(--w-cobalt)", "var(--w-green)"];

const NOW = EXPERIENCE.find((e) => e.current) ?? EXPERIENCE[0];
const DEGREE = EDUCATION[0];
// The data carries the full institute name; the ticket uses the name people say.
const SCHOOL = DEGREE.org.includes("Pilani") ? `BITS Pilani, ${DEGREE.loc.split(",")[0]}` : DEGREE.org;
const GRADUATED = (() => {
  const end = DEGREE.period.split(/\s+-\s+/)[1] ?? "";
  const [m, y] = end.split(" ");
  return m && y ? `${m.charAt(0)}${m.slice(1).toLowerCase()} ${y}` : end;
})();

interface Sticker {
  name: string;
  text: string;
  c: string;
  r: number;
  icon: ReactNode;
}

const STICKERS: Sticker[] = [
  {
    name: "Music",
    text: "Guitar & keyboard, rhythm and structure in a different language.",
    c: "var(--w-sun)",
    r: -1.5,
    icon: (
      <>
        <path d="M12 24V7l14-3v16" />
        <circle cx="8.5" cy="24" r="3.6" />
        <circle cx="22.5" cy="20.5" r="3.6" />
        <path d="M12 12l14-3" />
      </>
    ),
  },
  {
    name: "Visual Art",
    text: "Mandala art, drawing, painting, symmetry and balance on paper.",
    c: "var(--ab-pink-soft)",
    r: 1.2,
    icon: (
      <>
        <circle cx="16" cy="16" r="3" />
        <circle cx="16" cy="16" r="8" />
        <circle cx="16" cy="16" r="13" />
        <path d="M16 3v5M16 24v5M3 16h5M24 16h5M6.8 6.8l3.5 3.5M21.7 21.7l3.5 3.5M6.8 25.2l3.5-3.5M21.7 10.3l3.5-3.5" />
      </>
    ),
  },
  {
    name: "Travel",
    text: "Haven't seen much of the world yet, but it's high on the list. Always up for a recommendation.",
    c: "var(--w-mint)",
    r: 0.8,
    icon: (
      <>
        <circle cx="16" cy="16" r="12.5" />
        <path d="M20.5 11.5l-3 6.5-6 2.5 3-6.5z" />
      </>
    ),
  },
  {
    name: "People",
    text: "Conversations, new connections, collaboration, growth is human.",
    c: "var(--ab-blue-soft)",
    r: -1,
    icon: (
      <>
        <circle cx="11" cy="11" r="4" />
        <circle cx="22" cy="12.5" r="3.4" />
        <path d="M3.5 26c.8-5 3.8-7.5 7.5-7.5s6.7 2.5 7.5 7.5M18 19.5c1.2-1 2.5-1.4 4-1.4 3.2 0 5.6 2.2 6.4 6.4" />
      </>
    ),
  },
];

const vars = (v: Record<string, string | number>) => v as CSSProperties;

function Tape({ className = "", style }: { className?: string; style: CSSProperties }) {
  return <span className={`ab-tape ${className}`} style={style} aria-hidden="true" />;
}

function H3({ c, children, className }: { c: string; children: ReactNode; className?: string }) {
  return (
    <h3 className={className} style={vars({ "--c": c })}>
      <span>{children}</span>
    </h3>
  );
}

function onCoverError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  // Fall back to Open Library if the local cover is missing, then hide.
  if (!img.dataset.fallback) {
    img.dataset.fallback = "1";
    img.src = "https://covers.openlibrary.org/b/isbn/9781098166304-L.jpg";
  } else {
    img.style.display = "none";
  }
}

export default function About() {
  return (
    <section id="about" className="ab" aria-labelledby="ab-h">
      <div className="ab-book rv">
        {/* ---------- left page: ruled ---------- */}
        <div className="ab-pg ab-L">
          <h2 className="ab-title" id="ab-h">
            <span className="sr-only">About</span>
            {TITLE.map((l, i) => (
              <b
                key={l.ch}
                aria-hidden="true"
                style={vars({ "--bg": l.bg, "--ink": l.ink, "--r": `${l.r}deg`, "--cp": l.cp, "--d": `${i * 0.08}s` })}
              >
                {l.ch}
              </b>
            ))}
          </h2>
          <span className="ab-aside">the short version</span>

          <figure className="ab-photo">
            <Tape style={vars({ left: "44px", top: "-12px", "--t": "var(--w-pink)", "--tr": "-6deg" })} />
            <picture>
              <source srcSet="/assets/soumya.webp" type="image/webp" />
              <img
                className="ab-pic"
                src="/assets/soumya.jpg"
                alt="Soumya in a black dress on the stone forecourt at BITS Pilani, Goa, with the convocation hall behind her"
                width={480}
                height={505}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </figure>

          <div className="ab-who">
            <H3 c="var(--w-mint)">Who I am</H3>
            <p>
              I'm Soumya, a full-stack engineer who enjoys building production systems end to end. I work across Go and
              FastAPI backends, data pipelines, REST APIs, AI agents, and frontends that don't feel like an afterthought,
              shipping features from architecture to deployment.
            </p>
            <p>
              What pulls me most right now is the AI systems layer:{" "}
              <mark>multi-agent systems, RAG, evaluation frameworks, memory architectures</mark>, and the infrastructure
              that makes LLM applications reliable, observable, and production-ready.
            </p>
            <p>
              To me, good engineering isn't about getting it right on paper, it's about shortening the feedback loop
              between an idea and a reliable system by building, learning from real-world usage, and iterating
              relentlessly.
            </p>
          </div>

          <div className="ab-how">
            <H3 c="var(--ab-pink-soft)">How I think</H3>
            <div className="ab-note">
              <p>
                I default to asking what system produced a problem, not just how to solve it. I want the mechanism, not
                the rule: why something exists, what it assumes, where it breaks.
              </p>
            </div>
            <div className="ab-n2">
              <svg className="ab-conn" viewBox="0 0 70 48" aria-hidden="true">
                <path d="M6 4c4 22 22 34 52 36M48 32l10 8-12 5" />
              </svg>
              <span className="ab-but" aria-hidden="true">
                but…
              </span>
              <div className="ab-note">
                <p>
                  But I don't sit on that thinking for long. Once I have a rough shape of the problem, I start building,
                  and I'd rather fix things as they break in a real version than try to pre-solve every edge case on
                  paper.
                </p>
              </div>
            </div>
          </div>

          <div className="ab-head">
            <H3 c="var(--w-sun)">Where I'm heading</H3>
            <dl className="ab-route">
              {ROUTES.map((r) => (
                <div className="ab-route-row" key={r.name}>
                  <dt style={vars({ "--c": r.c })}>{r.name}</dt>
                  <dd>
                    <ul>
                      {r.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="ab-rings" aria-hidden="true" />

        {/* ---------- right page: dotted ---------- */}
        <div className="ab-pg ab-R">
          <div className="ab-now">
            <Tape style={vars({ right: "30px", top: "-10px", "--t": "var(--w-sun)", "--tr": "4deg" })} />
            <h3>Currently</h3>
            <p className="ab-role">
              <span className="ab-dot" aria-hidden="true" />
              {NOW.role} @ {NOW.company}
            </p>
            <p className="ab-sub">Building production software and exploring how reliable AI systems are engineered.</p>
            <p className="ab-after">
              <span>
                After hours: building <b>{PROFILE.afterHours.name}</b>
              </span>
              <span className="ab-stealth">{PROFILE.afterHours.note}</span>
            </p>
            <p className="ab-edu">
              {DEGREE.degree}
              <br />
              {SCHOOL} (Graduated {GRADUATED})
            </p>
          </div>

          <div className="ab-read">
            <Tape style={vars({ left: "-14px", top: "-8px", width: "70px", "--t": "var(--w-mint)", "--tr": "-30deg" })} />
            <img
              src="/assets/ai-engineering.jpg"
              alt="Cover of AI Engineering by Chip Huyen: an owl perched on a branch"
              width={96}
              height={126}
              loading="lazy"
              onError={onCoverError}
            />
            <div>
              <H3 c="var(--w-mint)" className="ab-read-h">
                Currently reading
              </H3>
              <p className="ab-read-t">AI Engineering</p>
              <p className="ab-read-a">Chip Huyen · Building Applications with Foundation Models</p>
              <p className="ab-read-n">Sharpening how I think about shipping reliable AI systems.</p>
            </div>
          </div>

          <div className="ab-think">
            <H3 c="var(--ab-pink-soft)">Thinking about</H3>
            {PROFILE.thinkingAbout.map((q, i) => (
              <blockquote key={q} style={vars({ "--q": QUOTE_COLOURS[i % QUOTE_COLOURS.length] })}>
                {q}
              </blockquote>
            ))}
          </div>

          <div className="ab-bey">
            <H3 c="var(--w-sun)">Beyond engineering</H3>
            <ul className="ab-stk">
              {STICKERS.map((s, i) => (
                <li key={s.name} className="ab-st" style={vars({ "--c": s.c, "--r": `${s.r}deg`, "--k": i })}>
                  <span className="ab-ic">
                    <svg viewBox="0 0 32 32" aria-hidden="true">
                      {s.icon}
                    </svg>
                  </span>
                  <b>{s.name}</b>
                  <span className="ab-d">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* the two strips of washi tape that hold the pocket to the book */}
        <Tape className="ab-tape--hold" style={vars({ left: "64px", width: "96px", "--t": "var(--w-mint)", "--tr": "-7deg" })} />
        <Tape className="ab-tape--hold" style={vars({ right: "64px", width: "96px", "--t": "var(--w-pink)", "--tr": "6deg" })} />
      </div>

      {/* ---------- the felt pocket, with a year of commits pulled out of it ---------- */}
      <div className="ab-pocket rv">
        <div className="ab-pk">
          <div className="ab-back" aria-hidden="true" />
          <div className="ab-board">
            <GithubCal />
          </div>
          <div className="ab-front" aria-hidden="true">
            <span className="ab-snap">
              <svg viewBox="0 0 24 24">
                <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" />
              </svg>
            </span>
            <p className="ab-lbl">
              a year of commits, pulled out of the pocket
              <svg viewBox="0 0 34 34">
                <path d="M6 28c10-2 17-9 20-21M19 11l7-5 3 8" />
              </svg>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
