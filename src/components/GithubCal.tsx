import { useEffect, useMemo, useState } from "react";

/* Custom GitHub contribution calendar — ported from github-cal.js. */

const USERNAME = "soumya0343";
const DESKTOP_MONTHS = 6;
const MOBILE_MONTHS = 4; // fewer columns on phones so month labels don't collide
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Day {
  date: Date;
  key: string;
  count: number;
  future: boolean;
}

function level(day: Day): string {
  if (day.future) return "f";
  if (day.count === 0) return "0";
  if (day.count <= 2) return "1";
  if (day.count <= 5) return "2";
  if (day.count <= 9) return "3";
  return "4";
}

function useMonths(): number {
  const [months, setMonths] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches ? MOBILE_MONTHS : DESKTOP_MONTHS,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const sync = () => setMonths(mq.matches ? MOBILE_MONTHS : DESKTOP_MONTHS);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return months;
}

export default function GithubCal() {
  const [byDate, setByDate] = useState<Record<string, number> | null>(null);
  const months = useMonths();

  useEffect(() => {
    let alive = true;
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
      .then((r) => (r.ok ? r.json() : { contributions: [] }))
      .then((data: { contributions?: { date: string; count: number }[] }) => {
        const map: Record<string, number> = {};
        (data.contributions || []).forEach((c) => {
          if (c.date) map[c.date] = c.count;
        });
        if (alive) setByDate(map);
      })
      .catch(() => {
        if (alive) setByDate({});
      });
    return () => {
      alive = false;
    };
  }, []);

  const model = useMemo(() => {
    if (!byDate) return null;
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
        const key = cursor.toISOString().slice(0, 10);
        week.push({ date: new Date(cursor), key, count: byDate[key] || 0, future: cursor > today });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    const startKey = start.toISOString().slice(0, 10);
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

    return { weeks, total, monthLabels };
  }, [byDate, months]);

  if (!model) {
    return <div className="gh-loading">Loading contributions…</div>;
  }

  return (
    <>
      <div className="gh-header">
        <span className="gh-total">
          {model.total} contributions in the last {months} months
        </span>
      </div>
      <div className="gh-grid-wrap">
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
                    ? ""
                    : `${day.count || "No"} contribution${day.count !== 1 ? "s" : ""} · ${day.date.toDateString()}`;
                  return <div className={`gh-cell l${level(day)}`} title={tip} key={day.key} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
