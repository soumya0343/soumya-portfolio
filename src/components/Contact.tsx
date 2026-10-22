import "../styles/sections/contact.css";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { CONTACT, RESUME_URL } from "../data/portfolio";

/* Contact · "the notebook letter". The visitor writes on an Amie-style postcard; on send
 * it slides into a cobalt string-tie envelope while the real /api/contact request runs.
 * Success: the flap closes, the string ties, the envelope folds into a paper plane that
 * flies off, and a persistent "Sent" confirmation lands. Failure: the postcard comes back
 * out with her text intact and a note naming the problem. */

/** Optional build-time stamp. When vite.config.ts defines __BUILD_DATE__ it wins;
 *  otherwise fall back to the document's Last-Modified date. */
declare const __BUILD_DATE__: string | undefined;
function buildDate(): Date {
  const raw = typeof __BUILD_DATE__ !== "undefined" ? __BUILD_DATE__ : document.lastModified;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

type Field = "name" | "email" | "message";
type Phase = "idle" | "in" | "seal" | "fold" | "fly" | "sent" | "out";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Animation beats (ms) at --m = 1. Each waits for the CSS it pairs with.
const T_IN = 1150;
const T_SEAL = 900;
const T_FOLD = 560;
const T_FLY = 1500;
const T_OUT = 650;

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Turn a failed request into one sentence that names the problem. */
function describe(err: unknown, status?: number): string {
  if (err instanceof TypeError) return "Couldn't reach the server. Check your connection.";
  const msg = err instanceof Error ? err.message : "";
  if (msg && !/^HTTP \d+$/.test(msg)) {
    // Keep "Mail service error (502)." and drop the provider's raw response body.
    const first = msg.match(/^.*?[.!?](\s|$)/)?.[0]?.trim() || msg;
    return first.length > 140 ? `${first.slice(0, 137)}…` : first;
  }
  if (status === 404) return "The mail service isn't available here (404).";
  if (status && status >= 500) return `The mail service hit an error (${status}).`;
  return status ? `The server said no (${status}).` : "The send failed.";
}

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const OutIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const ResumeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h6" />
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const SubstackIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
);
const MediumIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7.5v5M12 16.5h.01" />
  </svg>
);

const TAPES = [
  { href: CONTACT.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: RESUME_URL, label: "Resume", Icon: ResumeIcon },
  { href: CONTACT.github, label: "GitHub", Icon: GitHubIcon },
];
const ALSO = [
  { href: CONTACT.x, label: "X", Icon: XIcon },
  { href: CONTACT.substack, label: "Substack", Icon: SubstackIcon },
  { href: CONTACT.medium, label: "Medium", Icon: MediumIcon },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [trap, setTrap] = useState(""); // honeypot: people never see or fill it
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [geo, setGeo] = useState<CSSProperties>({});
  const [again, setAgain] = useState(false);
  const [built] = useState(buildDate);
  const year = new Date().getFullYear();

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLFormElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const failRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const alive = useRef(true);
  const focusNext = useRef<"done" | "fail" | "msg" | null>(null);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Move focus to whatever result just landed, once it is in the DOM.
  useEffect(() => {
    const target = focusNext.current;
    if (!target) return;
    if (target === "done" && phase === "sent") doneRef.current?.focus();
    else if (target === "fail" && phase === "idle" && failure) failRef.current?.focus();
    else if (target === "msg" && phase === "idle") msgRef.current?.focus();
    else return;
    focusNext.current = null;
  }, [phase, failure]);

  const check = (f: Field, v: string): string => {
    const t = v.trim();
    if (f === "message") return t ? "" : "Write me a line or two first.";
    if (f === "name") return t ? "" : "Add your name so I know who wrote.";
    if (!t) return "Add your email so I can write back.";
    return EMAIL_RE.test(t) ? "" : "That email doesn't look right. Check it so I can write back.";
  };

  // Errors stay pinned until the field is fixed.
  const edit = (f: Field, v: string, set: (s: string) => void) => {
    set(v);
    if (errors[f] && !check(f, v)) setErrors((e) => ({ ...e, [f]: "" }));
  };

  /** Measure where the envelope sits so the postcard, fold and flight line up at any width. */
  const measure = () => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const env = envRef.current;
    if (!stage || !card || !env) return;
    const s = stage.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const e = env.getBoundingClientRect();
    const scale = s.width / 720;
    setGeo({
      "--ct-dy": `${Math.round(e.top + e.height * 0.66 - c.top)}px`,
      "--ct-s": scale.toFixed(4),
      "--ct-fy": `${Math.round(e.top - s.top - 442 * scale)}px`,
    } as CSSProperties);
  };

  /** Wait one beat; false if the section unmounted meanwhile. */
  const beat = async (ms: number) => {
    await wait(ms);
    return alive.current;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (phase !== "idle") return;
    const next: Partial<Record<Field, string>> = {
      message: check("message", msg),
      name: check("name", name),
      email: check("email", email),
    };
    setErrors(next);
    const first = (["message", "name", "email"] as Field[]).find((f) => next[f]);
    if (first) {
      ({ message: msgRef, name: nameRef, email: emailRef })[first].current?.focus();
      return;
    }

    setFailure(null);
    setAgain(false);
    const reduce = reducedMotion();
    measure();
    setPhase("in");
    const minIn = wait(reduce ? 250 : T_IN);

    let problem = "";
    if (!trap) {
      let status: number | undefined;
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), message: msg.trim() }),
        });
        status = res.status;
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error || `HTTP ${res.status}`);
        }
      } catch (err) {
        problem = describe(err, status);
      }
    }
    await minIn;
    if (!alive.current) return;

    if (problem) {
      if (!reduce) {
        setPhase("out");
        if (!(await beat(T_OUT))) return;
      }
      focusNext.current = "fail";
      setFailure(problem);
      setPhase("idle");
      return;
    }

    setName("");
    setEmail("");
    setMsg("");
    setTrap("");
    focusNext.current = "done";
    if (reduce) {
      setPhase("sent");
      return;
    }
    setPhase("seal");
    if (!(await beat(T_SEAL))) return;
    setPhase("fold");
    if (!(await beat(T_FOLD))) return;
    setPhase("fly");
    if (!(await beat(T_FLY))) return;
    setPhase("sent");
  };

  const writeAnother = () => {
    setErrors({});
    setFailure(null);
    focusNext.current = "msg";
    setAgain(true);
    setPhase("idle");
  };

  const busy = phase !== "idle" && phase !== "sent";
  const dateLabel = built.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const fieldNote = (f: Field) =>
    errors[f] ? (
      <span className="ct-fnote" id={`ct-err-${f}`}>
        <AlertIcon />
        {errors[f]}
      </span>
    ) : null;

  return (
    <section id="contact" className="ct" aria-labelledby="ct-h">
      <div className="ct-in">
        <div className="ct-grid">
          <div className="ct-left">
            <h2 id="ct-h" className="ct-lead rv">
              Let’s build something <mark>that lasts.</mark>
            </h2>
            <p className="ct-copy rv" data-d="1">
              Open to discussing complex systems, new ideas, and the kinds of problems that don't have a clean answer
              yet. Write me a postcard, or pick a tape.
            </p>
            <div className="rv" data-d="2">
              <a className="ct-tape ct-mail" href={`mailto:${CONTACT.email}`}>
                <MailIcon />
                {CONTACT.email}
                <OutIcon />
              </a>
            </div>
            <nav className="ct-tapes rv" data-d="3" aria-label="Main channels">
              {TAPES.map(({ href, label, Icon }) => (
                <a className="ct-tape" href={href} target="_blank" rel="noopener noreferrer" key={label}>
                  <Icon />
                  {label}
                </a>
              ))}
            </nav>
            <p className="ct-also rv" data-d="4">
              also on
              {ALSO.map(({ href, label, Icon }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" key={label}>
                  <Icon />
                  {label}
                </a>
              ))}
            </p>
          </div>

          <div className="ct-right rv" data-d="2">
            <div className="ct-stage" ref={stageRef} data-phase={phase} data-again={again || undefined} style={geo}>
              <div className="ct-slot">
                <form
                  className="ct-card"
                  ref={cardRef}
                  noValidate
                  aria-label="Write Soumya a postcard"
                  onSubmit={onSubmit}
                  inert={phase === "sent" || undefined}
                >
                  <span className="ct-washi ct-washi--a" aria-hidden="true" />
                  <span className="ct-washi ct-washi--b" aria-hidden="true" />
                  <div className="ct-msg">
                    <label className="ct-lab" htmlFor="ct-m">
                      Your message
                    </label>
                    <div className="ct-msgbox">
                      <textarea
                        id="ct-m"
                        ref={msgRef}
                        name="message"
                        required
                        maxLength={4000}
                        placeholder="Hi Soumya, …"
                        value={msg}
                        aria-invalid={!!errors.message || undefined}
                        aria-describedby={errors.message ? "ct-err-message" : undefined}
                        onChange={(e) => edit("message", e.target.value, setMsg)}
                      />
                    </div>
                    {fieldNote("message")}
                  </div>
                  <div className="ct-div" aria-hidden="true" />
                  <div className="ct-addr">
                    <div className="ct-stampbox" aria-hidden="true">
                      place
                      <br />
                      stamp here
                      <svg className="ct-stamp" viewBox="0 0 64 76">
                        <path d="M0 0h64v76H0z" className="ct-stamp-bg" />
                        <path d="M0 0h64v76H0z" fill="none" className="ct-stamp-perf" strokeWidth="5" strokeDasharray="3 3" />
                        <circle cx="32" cy="34" r="17" className="ct-stamp-sun" />
                        <circle cx="26" cy="31" r="2.2" className="ct-stamp-ink" />
                        <circle cx="38" cy="31" r="2.2" className="ct-stamp-ink" />
                        <path d="M24 39q8 7 16 0" fill="none" className="ct-stamp-smile" strokeWidth="2.2" strokeLinecap="round" />
                        <text x="32" y="66" textAnchor="middle" fontSize="8" fontWeight="500" letterSpacing="1">
                          AIRMAIL
                        </text>
                      </svg>
                    </div>
                    <svg className="ct-postmark" viewBox="0 0 100 100" aria-hidden="true">
                      <defs>
                        <path id="ct-pmc" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
                      </defs>
                      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.2" />
                      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      <text className="ct-pm-ring" fontSize="9" fontWeight="500" letterSpacing="1.4" fill="currentColor">
                        <textPath href="#ct-pmc">{`BENGALURU · INDIA · ${built.getFullYear()} ·`}</textPath>
                      </text>
                      <text className="ct-pm-sg" x="50" y="59" textAnchor="middle" fontWeight="700" fontSize="26" fill="currentColor">
                        SG
                      </text>
                    </svg>
                    <p className="ct-to">
                      <span className="ct-lab">To</span>
                      <b>Soumya, Bengaluru</b>
                    </p>
                    <div className="ct-f">
                      <label className="ct-lab" htmlFor="ct-n">
                        From (your name)
                      </label>
                      <div className="ct-inwrap">
                        <input
                          id="ct-n"
                          ref={nameRef}
                          name="name"
                          autoComplete="name"
                          required
                          maxLength={120}
                          placeholder="your name"
                          value={name}
                          aria-invalid={!!errors.name || undefined}
                          aria-describedby={errors.name ? "ct-err-name" : undefined}
                          onChange={(e) => edit("name", e.target.value, setName)}
                        />
                      </div>
                      {fieldNote("name")}
                    </div>
                    <div className="ct-f">
                      <label className="ct-lab" htmlFor="ct-e">
                        Reply to (your email)
                      </label>
                      <div className="ct-inwrap">
                        <input
                          id="ct-e"
                          ref={emailRef}
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          maxLength={200}
                          placeholder="you@example.com"
                          value={email}
                          aria-invalid={!!errors.email || undefined}
                          aria-describedby={errors.email ? "ct-err-email" : undefined}
                          onChange={(e) => edit("email", e.target.value, setEmail)}
                        />
                      </div>
                      {fieldNote("email")}
                    </div>
                    <div className="ct-trap" aria-hidden="true">
                      <label htmlFor="ct-w">Leave this empty</label>
                      <input id="ct-w" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                    </div>
                    <button type="submit" className="ct-send" aria-disabled={busy || undefined}>
                      {busy ? (
                        "Folding…"
                      ) : (
                        <>
                          Fold &amp; send
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M22 2 11 13" />
                            <path d="M22 2 15 22l-4-9-9-4z" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="ct-env" ref={envRef} aria-hidden="true">
                <div className="ct-envback" />
                <div className="ct-liner" />
                <div className="ct-envfront">
                  <div className="ct-front">
                    <span className="ct-btn ct-btn1" />
                    <span className="ct-label">
                      <small>DELIVER TO</small>
                      <span>Soumya, Bengaluru</span>
                    </span>
                    <span className="ct-sg">SG</span>
                  </div>
                  <div className="ct-flap">
                    <div className="ct-flapin" />
                    <span className="ct-btn" />
                  </div>
                  <svg className="ct-string" viewBox="0 0 720 248">
                    <path
                      d="M360 128 C 318 138 318 218 360 218 C 402 218 402 138 360 128 C 334 150 390 176 360 196 Q 392 230 452 214 Q 488 204 502 230"
                      pathLength="1"
                      fill="none"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="ct-flight" aria-hidden="true">
                <svg className="ct-trail" viewBox="0 0 720 690" width="720" height="690">
                  <defs>
                    <mask id="ct-trailmask" maskUnits="userSpaceOnUse" x="-200" y="-300" width="1500" height="1200">
                      <path
                        className="ct-mpath"
                        d="M 360 566 C 480 604 620 552 640 470 C 660 388 548 372 544 436 C 540 500 700 500 724 400 C 748 306 732 206 860 156 C 950 122 1010 52 1090 -70"
                        pathLength="1"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="16"
                        strokeLinecap="round"
                      />
                    </mask>
                  </defs>
                  <path
                    className="ct-dots"
                    d="M 360 566 C 480 604 620 552 640 470 C 660 388 548 372 544 436 C 540 500 700 500 724 400 C 748 306 732 206 860 156 C 950 122 1010 52 1090 -70"
                    fill="none"
                    strokeWidth="3"
                    strokeDasharray="2 10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    mask="url(#ct-trailmask)"
                  />
                </svg>
                <div className="ct-plane">
                  <svg viewBox="0 0 196 96">
                    <path d="M30 60 Q 14 74 2 70 Q -8 66 -4 82" fill="none" className="ct-pl-tail" strokeWidth="2.6" strokeLinecap="round" />
                    <polygon points="0,6 196,48 62,56" className="ct-pl-top" strokeWidth="1.5" strokeLinejoin="round" />
                    <polygon points="62,56 196,48 40,92" className="ct-pl-wing" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="96" cy="64" r="3" className="ct-pl-pink" />
                    <circle cx="120" cy="58" r="3" className="ct-pl-sun" />
                    <circle cx="80" cy="76" r="3" className="ct-pl-sun" />
                    <polygon points="62,56 40,92 26,62" className="ct-pl-fold" />
                    <circle cx="150" cy="44" r="7" className="ct-pl-btn" strokeWidth="1.2" />
                  </svg>
                </div>
              </div>

              {phase === "sent" && (
                <div className="ct-done">
                  <div className="ct-pm" aria-hidden="true">
                    <div className="ct-sticker">
                      <b>SENT!</b>
                    </div>
                    <svg className="ct-wave" viewBox="0 0 170 80">
                      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M4 14 q12 -9 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" />
                        <path d="M4 34 q12 -9 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" />
                        <path d="M4 54 q12 -9 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" />
                        <path d="M4 74 q12 -9 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" />
                      </g>
                    </svg>
                  </div>
                  <div className="ct-dtxt">
                    <p className="ct-dline" role="status" tabIndex={-1} ref={doneRef}>
                      Sent. Replies within 24h.
                    </p>
                    <button type="button" className="ct-again" onClick={writeAnother}>
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                      Write another
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="ct-posting" aria-live="polite">
              {busy ? "Posting your postcard…" : ""}
            </p>
            {failure && (
              <div className="ct-fail" role="status" tabIndex={-1} ref={failRef}>
                <span className="ct-err">
                  <AlertIcon />
                  That one didn't fly. Your postcard is still here.
                </span>
                <span className="ct-why">{failure}</span>
                <span>
                  Try again, or email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ct-in ct-in--foot">
        <footer className="ct-foot rv">
          <span>
            <b>© {year} Soumya Gupta</b>
          </span>
          <span className="ct-sep" aria-hidden="true">
            ·
          </span>
          <span>Designed and curated by Soumya Gupta</span>
          <span className="ct-sep" aria-hidden="true">
            ·
          </span>
          <span>
            Updated <time dateTime={built.toISOString().slice(0, 10)}>{dateLabel}</time>
          </span>
        </footer>
      </div>
    </section>
  );
}
