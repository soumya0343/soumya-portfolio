export default function Proof() {
  return (
    <section className="proof" aria-label="Impact by the numbers">
      <div className="proof__grid">
        <div className="proof__cell rv">
          <div className="proof__num">
            15s<span className="u">→</span>ms
          </div>
          <div className="proof__cap">Backend latency cut on a live prediction market</div>
        </div>
        <div className="proof__cell rv" data-d="1">
          <div className="proof__num">
            83<span className="u">%</span>
          </div>
          <div className="proof__cap">Less manual reporting time per SEBI cycle</div>
        </div>
        <div className="proof__cell rv" data-d="2">
          <div className="proof__num">
            5,000<span className="u">+</span>
          </div>
          <div className="proof__cap">Clients served by automated reporting</div>
        </div>
        <div className="proof__cell rv" data-d="3">
          <div className="proof__num">
            10<span className="u">+</span>
          </div>
          <div className="proof__cap">Projects shipped across AI, backend &amp; full-stack</div>
        </div>
      </div>
    </section>
  );
}
