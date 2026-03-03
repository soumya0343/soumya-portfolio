import { useState, type FormEvent } from "react";
import "./ContactSection.css";

// ─── Web3Forms endpoint ─────────────────────────────────────────────────────
// Completely free — get your access key at https://web3forms.com (enter your
// email, they'll send you a key instantly, no credit card needed).
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;

type Status = "idle" | "sending" | "success" | "error";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name,
          email,
          message,
          subject: `New message from ${name} via portfolio`,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const submitLabel =
    status === "sending"
      ? "[ sending... ]"
      : status === "success"
        ? "[ message_sent ✓ ]"
        : status === "error"
          ? "[ error — retry? ]"
          : "./execute_send";

  return (
    <section className="contact" id="contact">
      <div className="contact__left">
        <iframe
          src="/fluid-art.html?palette=dusk"
          className="contact__fluid"
          title="Contact Fluid Art"
          loading="lazy"
        />
      </div>
      <div className="contact__right">
        <span className="contact__number">09</span>
        <h2 className="contact__title" data-reveal="up">
          Let's Collaborate
        </h2>
        <p className="contact__subtitle" data-reveal="up" data-reveal-delay="1">
          Open to discussing complex systems and new ideas.
        </p>

        <div className="contact__body">
          {/* Terminal Window */}
          <div className="terminal" data-reveal="up" data-reveal-delay="2">
            {/* Window Chrome */}
            <div className="terminal__chrome">
              <div className="terminal__dots">
                <span className="terminal__dot terminal__dot--red" />
                <span className="terminal__dot terminal__dot--yellow" />
                <span className="terminal__dot terminal__dot--green" />
              </div>
              <span className="terminal__path">user@system:~/messages</span>
            </div>

            {/* Terminal Body / Form */}
            <form className="terminal__body" onSubmit={handleSubmit} noValidate>
              <div className="terminal__prompt">
                <span className="terminal__arrow">→</span>
                <span className="terminal__cmd">~ write_message.sh</span>
              </div>

              <div className="terminal__fields">
                <div className="terminal__field">
                  <label htmlFor="contact-name" className="terminal__flag">
                    --NAME
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className="terminal__input"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={status === "sending"}
                  />
                </div>
                <div className="terminal__field">
                  <label htmlFor="contact-email" className="terminal__flag">
                    --EMAIL
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className="terminal__input"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === "sending"}
                  />
                </div>
              </div>

              <div className="terminal__field terminal__field--full">
                <label htmlFor="contact-message" className="terminal__flag">
                  --MESSAGE
                </label>
                <textarea
                  id="contact-message"
                  className="terminal__textarea"
                  placeholder="Let's build something..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={status === "sending"}
                />
              </div>

              <div className="terminal__actions">
                <button
                  type="submit"
                  className={`terminal__submit terminal__submit--${status}`}
                  disabled={status === "sending"}
                >
                  <span className="terminal__submit-icon">›_</span>
                  {submitLabel}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Meta */}
          <div className="contact__meta">
            <p className="contact__reply">
              # I read everything thoughtfully and reply within 24h.
            </p>
            <div className="contact__socials">
              <a
                href="https://www.linkedin.com/in/soumya-gupta-9bb270263"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__social-link"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://github.com/soumya0343"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__social-link"
              >
                GitHub ↗
              </a>
              <a
                href="mailto:soumya0343@gmail.com"
                className="contact__social-link"
              >
                Email ↗
              </a>
            </div>
          </div>
        </div>

        <div className="contact__footer">
          <p className="contact__copyright">
            © {new Date().getFullYear()} Soumya Gupta — All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
