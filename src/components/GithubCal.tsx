import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

/* Custom GitHub contribution calendar, ported from github-cal.js. */

const USERNAME = "soumya0343";
const DESKTOP_MONTHS = 12;
// A 53-week grid cannot render legibly below ~760px: the cells collapse to a
// couple of pixels. Phones get the recent 6 months at a readable size instead,
// and the header states the window so the number is never mislabelled.
const MOBILE_MONTHS = 6;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Day {
  date: Date;
  key: string;
  count: number;
  future: boolean;
}

// Ten steps, not five. A five-band ramp collapses everything from 10 to 47
// contributions into one colour, which is most of the busy days, so a heavy
// year renders as flat as a quiet one. Cuts are upper bounds per level.
const CUTS = [0, 1, 2, 3, 5, 7, 10, 15, 25];
// Shown in the legend tooltip so the colours are readable as values.
export const BANDS = ["0", "1", "2", "3", "4–5", "6–7", "8–10", "11–15", "16–25", "26+"];

function level(day: Day): string {
  if (day.future) return "f";
  for (let i = 0; i < CUTS.length; i++) {
    if (day.count <= CUTS[i]) return String(i);
  }
  return "9";
}

function useMonths(): number {
  const [months, setMonths] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches ? MOBILE_MONTHS : DESKTOP_MONTHS,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const sync = () => setMonths(mq.matches ? MOBILE_MONTHS : DESKTOP_MONTHS);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return months;
}

export default function GithubCal() {
  const [byDate, setByDate] = useState<Record<string, number> | null>(null);
  const [failed, setFailed] = useState(false);
  const months = useMonths();

  useEffect(() => {
    let alive = true;

    const toMap = (data: { contributions?: { date: string; count: number }[] }) => {
      const map: Record<string, number> = {};
      (data.contributions || []).forEach((c) => {
        if (c.date) map[c.date] = c.count;
      });
      return map;
    };

    // Primary: our serverless endpoint (GitHub GraphQL, real-time, includes today).
    // Fallback: the public scraper API (cached, may lag a few hours) if the endpoint
    // isn't configured (no GITHUB_TOKEN) or errors.
    fetch("/api/github")
      .then((r) => {
        if (!r.ok) throw new Error("api/github unavailable");
        return r.json();
      })
      .catch(() =>
        fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`).then((r) => {
          // Throw rather than resolving with an empty set: resolving would look
          // like a successful request that found no contributions, which is a
          // different (and false) statement from "both sources are down".
          if (!r.ok) throw new Error("contributions API unavailable");
          return r.json();
        }),
      )
      .then((data: { contributions?: { date: string; count: number }[] }) => {
        if (alive) setByDate(toMap(data));
      })
      .catch(() => {
        // An outage must never render as an empty grid: "no contributions for a
        // year" and "we could not reach GitHub" look identical otherwise, and
        // only one of them is true.
        if (alive) {
          setFailed(true);
          setByDate({});
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const model = useMemo(() => {
    if (!byDate) return null;
    // Local YYYY-MM-DD (NOT toISOString, which is UTC and rolls the date back a day
    // for IST/positive-offset zones, mis-keying today's cell).
    const ymd = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const start = new Date(today);
    start.setMonth(start.getMonth() - months);
    start.setDate(1);
    start.setDate(start.getDate() - start.getDay()); // rewind to Sunday
    start.setHours(0, 0, 0, 0);

    const weeks: Day[][] = [];
    const cursor = new Date(start);
    while (cursor <= today) {
      const week: Day[] = [];
      for (let d = 0; d < 7; d++) {
        const key = ymd(cursor);
        week.push({ date: new Date(cursor), key, count: byDate[key] || 0, future: cursor > today });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    const startKey = ymd(start);
    let total = 0;
    Object.keys(byDate).forEach((k) => {
      if (k >= startKey) total += byDate[k];
    });

    let lastMonth = -1;
    const monthLabels = weeks.map((week) => {
      const m = week[0].date.getMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        return MONTH_NAMES[m];
      }
      return "";
    });

    // Stats are framed by WEEK, not by day. A daily grid draws one square per
    // day, so a year with 71 active days out of 368 is 81% blank by
    // construction and reads as "no contributions" however it is coloured.
    // Active weeks is the same data at the resolution the work actually
    // happened in, and it is the honest headline.
    const past = weeks.map((w) => w.filter((d) => !d.future));
    const weeksElapsed = past.filter((w) => w.length > 0).length;
    const activeWeeks = past.filter((w) => w.some((d) => d.count > 0)).length;

    let bestWeek = 0;
    past.forEach((w) => {
      const sum = w.reduce((n, d) => n + d.count, 0);
      if (sum > bestWeek) bestWeek = sum;
    });

    // Longest run of consecutive days with at least one contribution.
    let bestDay = 0;
    let streakBest = 0;
    let streakRun = 0;
    past.flat().forEach((d) => {
      if (d.count > bestDay) bestDay = d.count;
      if (d.count > 0) {
        streakRun += 1;
        if (streakRun > streakBest) streakBest = streakRun;
      } else {
        streakRun = 0;
      }
    });

    return { weeks, total, monthLabels, weeksElapsed, activeWeeks, bestWeek, bestDay, streakBest };
  }, [byDate, months]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ text: string; left: number; top: number } | null>(null);

  // GitHub-style tooltip: position a styled label above the hovered cell (event
  // delegation so we don't attach handlers to ~150 cells).
  const onCellOver = (e: ReactMouseEvent) => {
    const cell = e.target as HTMLElement;
    const text = cell.dataset?.tip;
    if (!text || !wrapRef.current) return;
    const wrap = wrapRef.current.getBoundingClientRect();
    const c = cell.getBoundingClientRect();
    setTip({ text, left: c.left - wrap.left + c.width / 2, top: c.top - wrap.top });
  };
  const onCellOut = (e: ReactMouseEvent) => {
    if ((e.target as HTMLElement).dataset?.tip) setTip(null);
  };

  if (failed) {
    return (
      <div className="gh-error" role="status">
        <span>GitHub stats unavailable right now.</span>
        <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer">
          View on GitHub ↗
        </a>
      </div>
    );
  }

  if (!model) {
    return <div className="gh-loading">Loading contributions…</div>;
  }

  return (
    <>
      <div className="gh-header">
        <span className="gh-total">
          <b>
            {model.activeWeeks}/{model.weeksElapsed}
          </b>{" "}
          active weeks
        </span>
        <span className="gh-sub">
          {model.total} contributions in the last {months} months
        </span>
      </div>
      <div
        className="gh-grid-wrap"
        ref={wrapRef}
        onMouseOver={onCellOver}
        onMouseOut={onCellOut}
        onMouseLeave={() => setTip(null)}
      >
        <div className="gh-days">
          {DAY_LABELS.map((l, i) => (
            <span key={l}>{i % 2 === 1 ? l : ""}</span>
          ))}
        </div>
        <div className="gh-cols-wrap">
          <div className="gh-months">
            {model.monthLabels.map((label, wi) => (
              <span key={wi}>{label}</span>
            ))}
          </div>
          <div className="gh-cols">
            {model.weeks.map((week, wi) => (
              <div className="gh-week" key={wi}>
                {week.map((day) => {
                  const tip = day.future
                    ? undefined
                    : `${day.count || "No"} contribution${day.count !== 1 ? "s" : ""} · ${day.date.toDateString()}`;
                  return <div className={`gh-cell l${level(day)}`} data-tip={tip} key={day.key} />;
                })}
              </div>
            ))}
          </div>
        </div>
        {tip && (
          <div className="gh-tip" style={{ left: tip.left, top: tip.top }} role="tooltip">
            {tip.text}
          </div>
        )}
      </div>
      <div className="gh-foot">
        <div className="gh-stats">
          {/* active weeks is the header's headline, so the footer carries the
              three figures that aren't stated anywhere else */}
          {[
            [String(model.bestWeek), "best week"],
            [String(model.bestDay), "peak day"],
            [String(model.streakBest), "day streak"],
          ].map(([value, label]) => (
            <div className="gh-stat" key={label}>
              <span className="gh-stat__v">{value}</span>
              <span className="gh-stat__k">{label}</span>
            </div>
          ))}
        </div>
        <div className="gh-legend" aria-hidden="true">
          <span>Less</span>
          {["l0", "l1", "l2", "l3", "l4"].map((l) => (
            <i className={`gh-cell ${l}`} key={l} />
          ))}
          <span>More</span>
        </div>
      </div>
    </>
  );
}
