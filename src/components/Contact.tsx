import { useRef, useState } from "react";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [label, setLabel] = useState("›_ ./execute_send");
  const timers = useRef<number[]>([]);
  const year = new Date().getFullYear();

  const [sending, setSending] = useState(false);
  const reset = (delay: number) => timers.current.push(window.setTimeout(() => setLabel("›_ ./execute_send"), delay));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!name.trim() || !email.trim() || !msg.trim()) {
      setLabel("›_ [ all fields required ]");
      reset(2400);
      return;
    }
    if (sending) return;
    setSending(true);
    setLabel("›_ [ sending... ]");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: msg.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || `HTTP ${res.status}`);
      }
      setName("");
      setEmail("");
      setMsg("");
      setLabel("›_ [ message sent ✓ ]");
      reset(4000);
    } catch (err) {
      setLabel(`›_ [ ${err instanceof Error ? err.message : "send failed"} ]`);
      reset(4000);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">07</span>
          <h2 className="sec-head__title">Contact</h2>
          <span className="sec-head__sub">REPLIES WITHIN 24H</span>
        </div>
        <div className="contact__grid">
          <div className="rv">
            <h3 className="contact__lead">
              Let's build something <span className="accent">that lasts.</span>
            </h3>
            <p className="contact__copy">
              Open to discussing complex systems, new ideas, and the kinds of problems that don't have a clean answer
              yet.
            </p>
            <div className="contact__direct">
              <a href="mailto:soumya0343@gmail.com">
                <MailIcon />
                soumya0343@gmail.com <span className="arr">↗</span>
              </a>
              <a href="https://www.linkedin.com/in/soumya-gupta-9bb270263" target="_blank" rel="noopener noreferrer">
                <LinkedInIcon />
                linkedin.com/in/soumya-gupta <span className="arr">↗</span>
              </a>
              <a href="https://github.com/soumya0343" target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
                github.com/soumya0343 <span className="arr">↗</span>
              </a>
              <a href="https://x.com/soumyaa0343" target="_blank" rel="noopener noreferrer">
                <XIcon />
                x.com/soumyaa0343 <span className="arr">↗</span>
              </a>
            </div>
          </div>

          <div className="rv" data-d="1">
            <div className="term">
              <div className="term__bar">
                <span className="term__lights">
                  <span />
                  <span />
                  <span />
                </span>{" "}
                user@system:~/messages
              </div>
              <form className="term__body" id="contactForm" noValidate onSubmit={onSubmit}>
                <div className="term__line">
                  <span className="ar">→</span> ~ write_message.sh
                </div>
                <div className="term__fields">
                  <div className="field">
                    <label htmlFor="cName">--NAME</label>
                    <input id="cName" type="text" placeholder="Jane Doe" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="cEmail">--EMAIL</label>
                    <input id="cEmail" type="email" placeholder="jane@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="field field--full">
                  <label htmlFor="cMsg">--MESSAGE</label>
                  <textarea id="cMsg" rows={5} placeholder="Let's build something..." required value={msg} onChange={(e) => setMsg(e.target.value)} />
                </div>
                <button type="submit" className="term__submit" id="cSubmit" disabled={sending}>
                  {label}
                </button>
              </form>
            </div>
          </div>
        </div>

        <footer className="foot">
          <span>© {year} Soumya Gupta — All rights reserved.</span>
          <div className="foot__socials">
            <a href="https://www.linkedin.com/in/soumya-gupta-9bb270263" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href="https://github.com/soumya0343" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a href="https://x.com/soumyaa0343" target="_blank" rel="noopener noreferrer" aria-label="X">
              <XIcon />
            </a>
            <a href="mailto:soumya0343@gmail.com" aria-label="Email">
              <MailIcon />
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
