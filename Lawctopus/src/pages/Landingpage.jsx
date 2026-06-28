import { useState, useEffect, useRef } from "react";

const REG_URL = "https://www.lawctopus.com/expert-level-mastering-contract-drafting-freelancing/";

const sectionsMeta = [
  { id: "hero", num: "§1", label: "Recitals" },
  { id: "features", num: "§2", label: "Whereas" },
  { id: "curriculum", num: "§3", label: "Operative Clauses" },
  { id: "reviews", num: "§4", label: "Representations" },
  { id: "pricing", num: "§5", label: "Consideration" },
  { id: "cta", num: "§6", label: "Execution" },
];

const clauses = [
  { b: "shall use commercially reasonable efforts to deliver drafts", a: "shall deliver the first draft within 48 hours" },
  { b: "no liability for delays caused by either party", a: "liability capped at the fees paid under this Agreement" },
  { b: "may terminate this Agreement at any time, without notice", a: "may terminate this Agreement on 30 days' written notice" },
  { b: "Service Provider's rates are subject to change without notice", a: "Service Provider's rates are fixed for the Term of this Agreement" },
];

const features = [
  { icon: "📝", title: "Draft 24+ contracts", desc: "NDAs, MSAs, real estate, IP, JV agreements, e-contracts — with personalised expert feedback on every draft.", cat: "drafting" },
  { icon: "💼", title: "Freelance on Upwork", desc: "Training from a top-rated Upwork contract expert. Build your portfolio and receive direct client referrals.", cat: "freelance" },
  { icon: "⏱️", title: "Save 4 years", desc: "Learn in 6 months what a practising lawyer takes 4–5 years to accumulate on the job.", cat: "career" },
  { icon: "♾️", title: "Lifetime access", desc: "All recorded sessions, reading resources, drafts, and live session recordings — yours forever.", cat: "drafting" },
  { icon: "🎯", title: "1-on-1 coaching", desc: "Bi-monthly career coaching calls with LLS founders. CV, cover letter, and LinkedIn feedback included.", cat: "career" },
  { icon: "🏅", title: "Certificates", desc: "Completion certificate for all learners. Merit certificate for top performers in the batch.", cat: "career" },
];

const curriculum = [
  { id: "m1", c: "3.1", label: "Months 1–2", title: "Foundations & negotiation basics", sessions: "8 sessions", pts: ["Elements of a valid contract and pre-contractual instruments", "Preamble, recitals, definitions, operative clauses", "Introduction to negotiation skills", "Hands-on: review and redraft a sale deed solo"] },
  { id: "m2", c: "3.2", label: "Month 3", title: "Common & international agreements", sessions: "7–8 sessions", pts: ["NDAs, Master Service Agreements, Power of Attorney", "International contracts and cross-border considerations", "Advanced negotiation skills and tactics", "E-contracts and digital signatures"] },
  { id: "m3", c: "3.3", label: "Month 4", title: "IP & technology agreements", sessions: "7–8 sessions", pts: ["Trademark licensing, copyright, and trade secret agreements", "Technology transfer and software licensing contracts", "Website terms of service and privacy policies", "Data protection agreements"] },
  { id: "m4", c: "3.4", label: "Month 5", title: "Real estate agreements", sessions: "7–8 sessions", pts: ["Sale deeds, gift deeds, and leave & licence agreements", "Development agreements and joint development contracts", "Mortgage and loan agreements", "Real estate due diligence clauses"] },
  { id: "m5", c: "3.5", label: "Month 6", title: "Business agreements & freelancing", sessions: "7–8 sessions", pts: ["Shareholders agreements, JV agreements, partnership deeds", "Freelancing: Upwork profile, Fiverr, LinkedIn outreach", "Getting your first paying client — live guidance", "10 polished contracts ready for your Upwork portfolio"] },
];

const reviews = [
  { init: "LS", text: "The live sessions were highly interactive. The faculty addressed even minor questions patiently. I was able to draft NDAs that helped me land a good internship.", author: "Law student", role: "Dec–May 2026 batch" },
  { init: "YL", text: "I could get good internships by mentioning this course. The assignments gave me real drafts I could show employers.", author: "Young lawyer", role: "Nagpur" },
  { init: "PR", text: "The support team was always responsive. Course content was practical and easy to understand — it has improved my professional growth significantly.", author: "Professional", role: "Delhi" },
];

const perks = [
  "54 live sessions with practising corporate lawyers",
  "Draft and review 24+ agreements with personal feedback",
  "Upwork profile setup + direct client referrals",
  "Bi-monthly 1-on-1 career coaching calls",
  "Lifetime access to all materials and recordings",
  "Completion + merit certificate",
];

const goalMap = {
  draft: "📝 <strong>Perfect.</strong> You'll draft 24+ real contracts across NDAs, MSAs, IP, real estate, and JV agreements — with expert feedback on each.",
  freelance: "💼 <strong>Great fit.</strong> Month 6 is entirely dedicated to launching your Upwork profile, landing your first client, and building a 10-contract portfolio.",
  internship: "🎯 <strong>Smart move.</strong> Our learners have landed internships citing this course. You'll have real drafts to show on Day 1.",
  career: "🚀 <strong>This is your path.</strong> 54 sessions condensing 4+ years of on-the-job learning into 6 months — with 1-on-1 career coaching included.",
};

const filterCats = ["all", "drafting", "freelance", "career"];

function pad(n) { return String(n).padStart(2, "0"); }

function useCountdown(deadline) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(deadline) - Date.now()) / 1000));
      setTime({ d: Math.floor(diff / 86400), h: Math.floor((diff % 86400) / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);
  return time;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      let current = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.55) current = id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(18px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LawctopusLanding() {
  const [clauseIdx, setClauseIdx] = useState(0);
  const [openMonth, setOpenMonth] = useState("m1");
  const [revIdx, setRevIdx] = useState(0);
  const [stamped, setStamped] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [goal, setGoal] = useState(null);
  const revTimer = useRef(null);
  const countdown = useCountdown("2026-06-30T23:59:59");
  const progress = useScrollProgress();
  const activeId = useActiveSection(sectionsMeta.map((s) => s.id));
  const activeMeta = sectionsMeta.find((s) => s.id === activeId) || sectionsMeta[0];

  useEffect(() => {
    const id = setInterval(() => setClauseIdx((i) => (i + 1) % clauses.length), 4400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    revTimer.current = setInterval(() => setRevIdx((i) => (i + 1) % reviews.length), 5200);
    return () => clearInterval(revTimer.current);
  }, []);

  const selectReview = (i) => {
    setRevIdx(i);
    clearInterval(revTimer.current);
    revTimer.current = setInterval(() => setRevIdx((j) => (j + 1) % reviews.length), 5200);
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleSeal = (e) => {
    e.preventDefault();
    setStamped(true);
    setTimeout(() => {
      window.open(REG_URL, "_blank", "noopener,noreferrer");
      setStamped(false);
    }, 480);
  };

  const toggleMonth = (id) => setOpenMonth((prev) => (prev === id ? null : id));

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#F8FAFC", background: "#0F1923", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .lc-btn-sky { background: #0EA5E9; color: #0F1923; padding: 12px 26px; border-radius: 8px; font-weight: 600; font-size: 13px; border: none; cursor: pointer; transition: background .2s, transform .2s; font-family: Inter, sans-serif; }
        .lc-btn-sky:hover { background: #38BDF8; transform: translateY(-2px); }
        .lc-btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.18); color: #F8FAFC; padding: 12px 20px; border-radius: 8px; font-size: 13px; cursor: pointer; transition: border-color .2s, background .2s; font-family: Inter, sans-serif; }
        .lc-btn-outline:hover { border-color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.04); }

        .lc-nav-cta { font-size: 13px; font-weight: 600; color: #0F1923; background: #0EA5E9; padding: 7px 16px; border-radius: 6px; border: none; cursor: pointer; transition: background .2s, transform .2s; font-family: Inter, sans-serif; }
        .lc-nav-cta:hover { background: #38BDF8; transform: translateY(-1px); }

        .lc-rail-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; position: relative; }
        .lc-rail-dot { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.15); background: transparent; flex-shrink: 0; transition: all .25s; }
        .lc-rail-btn.active .lc-rail-dot { background: #0EA5E9; border-color: #0EA5E9; box-shadow: 0 0 12px rgba(14,165,233,0.4); }
        .lc-rail-lbl { font-size: 10px; color: rgba(255,255,255,0.35); opacity: 0; transform: translateX(-8px); transition: all .25s; white-space: nowrap; font-family: "JetBrains Mono", monospace; }
        .lc-rail-btn:hover .lc-rail-lbl, .lc-rail-btn.active .lc-rail-lbl { opacity: 1; transform: none; color: #F8FAFC; }

        .lc-feat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-left: 3px solid transparent; border-radius: 10px; padding: 22px; transition: border-left-color .25s, transform .25s, background .25s, opacity .3s; cursor: default; }
        .lc-feat-card:hover { border-left-color: #0EA5E9; transform: translateY(-4px); background: rgba(14,165,233,0.06); }
        .lc-feat-card.dimmed { opacity: 0.2; pointer-events: none; }

        .lc-filter-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #64748B; padding: 6px 14px; border-radius: 20px; font-size: 12px; cursor: pointer; transition: all .2s; font-family: Inter, sans-serif; }
        .lc-filter-btn.active { background: #0EA5E9; border-color: #0EA5E9; color: #0F1923; font-weight: 600; }

        .lc-clause-head { width: 100%; text-align: left; background: rgba(255,255,255,0.02); border: none; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; cursor: pointer; color: #F8FAFC; transition: background .2s; font-family: Inter, sans-serif; }
        .lc-clause-head:hover, .lc-clause-head.open { background: rgba(14,165,233,0.08); }

        .lc-rev-tab { width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); background: transparent; font-family: "JetBrains Mono", monospace; font-size: 11px; font-weight: 600; color: #64748B; cursor: pointer; transition: all .2s; }
        .lc-rev-tab.active { background: #0EA5E9; color: #0F1923; border-color: #0EA5E9; }

        .lc-enroll-btn { display: block; width: 100%; text-align: center; background: linear-gradient(135deg, #0EA5E9, #14B8A6); color: #0F1923; padding: 14px 0; border-radius: 8px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: opacity .2s, transform .2s; font-family: Inter, sans-serif; letter-spacing: 0.02em; }
        .lc-enroll-btn:hover { opacity: 0.88; transform: translateY(-2px); }

        .lc-seal { width: 168px; height: 168px; border-radius: 50%; background: #0EA5E9; display: flex; align-items: center; justify-content: center; font-family: "Source Serif 4", Georgia, serif; font-size: 16px; font-weight: 600; color: #0F1923; text-align: center; line-height: 1.4; border: 3px solid rgba(255,255,255,0.15); box-shadow: 0 0 40px rgba(14,165,233,0.35); cursor: pointer; transition: transform .25s, box-shadow .25s; text-decoration: none; padding: 20px; }
        .lc-seal:hover { transform: scale(1.06) rotate(-2deg); box-shadow: 0 0 60px rgba(14,165,233,0.5); }
        .lc-seal.stamped { animation: lcStamp .48s ease; }
        @keyframes lcStamp { 0%{transform:scale(1) rotate(0);} 35%{transform:scale(0.82) rotate(-8deg);} 70%{transform:scale(1.1) rotate(3deg);} 100%{transform:scale(1) rotate(0);} }

        .lc-rdel { color: #F87171; text-decoration: line-through; opacity: 0.7; display: block; margin-bottom: 10px; }
        .lc-rins { color: #0EA5E9; display: block; opacity: 0; animation: lcFadeUp .5s ease .55s forwards; }
        @keyframes lcFadeUp { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:none;} }

        .lc-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #0EA5E9; display: inline-block; animation: lcBlink 1.5s ease-in-out infinite; }
        @keyframes lcBlink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

        .lc-scroll-arrow { font-size: 18px; animation: lcBounce 2s ease-in-out infinite; display: block; }
        @keyframes lcBounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(7px);} }

        .lc-quiz-opt { background: transparent; border: 1px solid rgba(255,255,255,0.12); color: #94A3B8; padding: 8px 16px; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all .2s; font-family: Inter, sans-serif; }
        .lc-quiz-opt:hover { border-color: #0EA5E9; color: #0EA5E9; background: rgba(14,165,233,0.06); }
        .lc-quiz-opt.chosen { border-color: #0EA5E9; color: #0F1923; background: #0EA5E9; }

        @media (max-width: 780px) {
          .lc-hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .lc-pricing-grid { grid-template-columns: 1fr !important; }
          .lc-rail { display: none !important; }
          .lc-nav-clause { display: none !important; }
        }
      `}</style>

      {/* TOP BAR */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ height: 2, background: "rgba(255,255,255,0.06)" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,#0EA5E9,#14B8A6)", width: `${progress}%`, transition: "width .1s linear" }} />
        </div>
        <div style={{ background: "rgba(15,25,35,0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", color: "#0EA5E9" }}>LAWCTOPUS</span>
            <span className="lc-nav-clause" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748B" }}>{activeMeta.num} — {activeMeta.label}</span>
            <button className="lc-nav-cta" onClick={() => window.open(REG_URL, "_blank", "noopener")}>Enroll now →</button>
          </div>
        </div>
      </div>
      <div style={{ height: 56 }} />

      {/* SIDE RAIL */}
      <nav className="lc-rail" style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", zIndex: 50, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ position: "absolute", left: 9, top: 4, bottom: 4, width: 1, background: "rgba(255,255,255,0.08)" }} />
        {sectionsMeta.map((s) => (
          <button key={s.id} className={`lc-rail-btn${activeId === s.id ? " active" : ""}`} onClick={() => scrollTo(s.id)}>
            <span className="lc-rail-dot" />
            <span className="lc-rail-lbl">{s.num} {s.label}</span>
          </button>
        ))}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "88px 0 40px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px", width: "100%" }}>
          <div className="lc-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 60, alignItems: "center" }}>
            {/* LEFT */}
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.12em", color: "#0EA5E9", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ width: 20, height: 1, background: "#0EA5E9", display: "inline-block" }} />
                §1 — RECITALS · NEW BATCH JULY 1, 2026
              </div>
              <h1 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 600, lineHeight: 1.18, marginBottom: 18 }}>
                Master contract drafting.<br /><em style={{ fontStyle: "normal", color: "#0EA5E9" }}>Start freelancing in 6 months.</em>
              </h1>
              <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.8, marginBottom: 28, maxWidth: 460 }}>
                54 live sessions with practising lawyers. Draft 24+ complex agreements. Get your first Upwork client with direct guidance from a top-rated expert.
              </p>

              {/* STATS */}
              <div style={{ display: "flex", gap: 30, flexWrap: "wrap", marginBottom: 28 }}>
                {[["20,000+", "Learners taught"], ["93.2/100", "Avg. rating"], ["54", "Live sessions"], ["24+", "Contracts drafted"]].map(([num, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 22, fontWeight: 700 }}>{num}</div>
                    <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 3 }}>{lbl}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                <button className="lc-btn-sky" onClick={() => window.open(REG_URL, "_blank", "noopener")}>Enroll now →</button>
                <button className="lc-btn-outline" onClick={() => scrollTo("curriculum")}>View curriculum</button>
              </div>

              <div style={{ fontSize: 13, color: "#64748B", display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
                <span style={{ textDecoration: "line-through", opacity: 0.45 }}>Rs. 60,000</span>
                <span>→</span>
                <span style={{ color: "#10B981", fontWeight: 700, fontSize: 15 }}>Rs. 24,999</span>
                <span>· limited seats</span>
              </div>

              {/* QUIZ */}
              <div style={{ background: "rgba(14,165,233,0.07)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Quick check — what's your goal?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[["draft", "Draft contracts at work"], ["freelance", "Freelance on Upwork/Fiverr"], ["internship", "Land a law internship"], ["career", "Switch to contract law"]].map(([key, label]) => (
                    <button key={key} className={`lc-quiz-opt${goal === key ? " chosen" : ""}`} onClick={() => setGoal(key)}>{label}</button>
                  ))}
                </div>
                {goal && (
                  <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 14, lineHeight: 1.7, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, borderLeft: "2px solid #0EA5E9" }}
                    dangerouslySetInnerHTML={{ __html: goalMap[goal] }} />
                )}
              </div>
            </div>

            {/* REDLINE CARD */}
            <div style={{ background: "#1E2D40", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid #0EA5E9", borderRadius: 14, padding: 28, position: "relative", overflow: "hidden" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748B", display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <span className="lc-live-dot" /> §4.2 — Service Levels, live edit
              </div>
              <div key={clauseIdx} style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 16, lineHeight: 1.75, minHeight: 120 }}>
                <span className="lc-rdel">{clauses[clauseIdx].b}</span>
                <span className="lc-rins">{clauses[clauseIdx].a}</span>
              </div>
              <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#475569" }}>
                This is the kind of clause you'll learn to spot — and fix.
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button onClick={() => scrollTo("features")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#475569", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.08em", margin: "0 auto" }}>
            WHAT'S INCLUDED <span className="lc-scroll-arrow">↓</span>
          </button>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "88px 0", background: "#1E2D40", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.12em", color: "#0EA5E9", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 20, height: 1, background: "#0EA5E9", display: "inline-block" }} />§2 — WHEREAS
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Everything bundled into one course</h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {filterCats.map((cat) => (
                <button key={cat} className={`lc-filter-btn${activeFilter === cat ? " active" : ""}`} onClick={() => setActiveFilter(cat)}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14 }}>
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div className={`lc-feat-card${activeFilter !== "all" && f.cat !== activeFilter ? " dimmed" : ""}`}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
                  <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
                  <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section id="curriculum" style={{ padding: "88px 0", background: "#0F1923", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.12em", color: "#0EA5E9", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 20, height: 1, background: "#0EA5E9", display: "inline-block" }} />§3 — OPERATIVE CLAUSES
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 24, fontWeight: 600, marginBottom: 6 }}>The 6-month curriculum</h2>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>Click a clause to expand it.</p>
          </Reveal>
          {curriculum.map((m, i) => {
            const isOpen = openMonth === m.id;
            return (
              <Reveal key={m.id} delay={i * 60}>
                <div style={{ marginBottom: 8, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
                  <button className={`lc-clause-head${isOpen ? " open" : ""}`} onClick={() => toggleMonth(m.id)}>
                    <span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#0EA5E9", fontWeight: 600, marginRight: 10 }}>Clause {m.c}</span>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{m.label} · {m.title}</span>
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748B", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                      {m.sessions}
                      <span style={{ display: "inline-block", transition: "transform .25s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                    </span>
                  </button>
                  <div style={{ background: "rgba(14,165,233,0.04)", maxHeight: isOpen ? 400 : 0, overflow: "hidden", transition: "max-height .35s ease, padding .3s ease", padding: isOpen ? "14px 20px 18px" : "0 20px" }}>
                    <ul style={{ paddingLeft: 16 }}>
                      {m.pts.map((pt) => (
                        <li key={pt} style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.9 }}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" style={{ padding: "88px 0", background: "#1E2D40", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.12em", color: "#0EA5E9", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 20, height: 1, background: "#0EA5E9", display: "inline-block" }} />§4 — REPRESENTATIONS
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 24, fontWeight: 600, textAlign: "center", marginBottom: 28 }}>What learners say</h2>
          </Reveal>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 36, background: "rgba(255,255,255,0.02)", minHeight: 170 }}>
              <div style={{ color: "#F59E0B", fontSize: 14, letterSpacing: 2, marginBottom: 16 }}>★★★★★</div>
              <p style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 18, lineHeight: 1.7, marginBottom: 18 }}>"{reviews[revIdx].text}"</p>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{reviews[revIdx].author}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{reviews[revIdx].role}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
              {reviews.map((r, i) => (
                <button key={r.init} className={`lc-rev-tab${revIdx === i ? " active" : ""}`} onClick={() => selectReview(i)}>{r.init}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "88px 0", background: "#0F1923", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.12em", color: "#0EA5E9", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 20, height: 1, background: "#0EA5E9", display: "inline-block" }} />§5 — CONSIDERATION
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 24, fontWeight: 600, marginBottom: 24 }}>The price of 4 years, paid once</h2>
          </Reveal>
          <div className="lc-pricing-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 50, alignItems: "start" }}>
            <Reveal>
              <div>
                <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.8, maxWidth: 400 }}>
                  A 6-month expert-level course starting July 1, 2026 — covering drafting, negotiation, and freelancing, with personal feedback on every contract you write.
                </p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "24px 0 0" }}>Schedule of benefits</p>
                <ul style={{ listStyle: "none", marginTop: 12 }}>
                  {perks.map((p) => (
                    <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#94A3B8", padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ color: "#10B981", flexShrink: 0, fontSize: 14 }}>✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div style={{ background: "#1E2D40", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 30, position: "sticky", top: 80 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>One-time payment</div>
                <div style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: 30, fontWeight: 700, marginBottom: 2 }}>Rs. 24,999</div>
                <div style={{ fontSize: 13, color: "#475569", textDecoration: "line-through", marginBottom: 18 }}>Regular: Rs. 60,000</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#F59E0B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Time is of the essence — closes in</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
                  {[["d", "days"], ["h", "hrs"], ["m", "min"], ["s", "sec"]].map(([k, lbl]) => (
                    <div key={k} style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "8px 12px", textAlign: "center", minWidth: 52 }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: "#F59E0B" }}>{pad(countdown[k])}</div>
                      <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase" }}>{lbl}</div>
                    </div>
                  ))}
                </div>
                <button className="lc-enroll-btn" onClick={() => window.open(REG_URL, "_blank", "noopener")}>Enroll now →</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA / EXECUTION ── */}
      <section id="cta" style={{ padding: "88px 0", background: "linear-gradient(160deg,#0F1923 0%,#2A3F57 100%)", minHeight: "70vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px", width: "100%" }}>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 680, margin: "0 auto" }}>
            <Reveal>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#F59E0B", letterSpacing: "0.12em", display: "flex", alignItems: "center", gap: 8, marginBottom: 20, justifyContent: "center" }}>
                <span style={{ width: 20, height: 1, background: "#F59E0B", display: "inline-block" }} />§6 — EXECUTION
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h2 style={{ fontFamily: "'Source Serif 4',Georgia,serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 600, marginBottom: 14 }}>Ready to put it in writing?</h2>
            </Reveal>
            <Reveal delay={100}>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.8, marginBottom: 36 }}>
                Batch begins July 1, 2026. Rs. 24,999 secures your seat — and a 6-month head start most lawyers spend years building.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <a href={REG_URL} className={`lc-seal${stamped ? " stamped" : ""}`} onClick={handleSeal}>
                Sign &amp;<br />Enroll
              </a>
            </Reveal>
            <div style={{ marginTop: 44, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "center", fontSize: 13, color: "#475569" }}>
              <span>Questions?</span>
              <a href="mailto:courses@lawctopus.com" style={{ color: "#94A3B8", textDecoration: "none", borderBottom: "1px solid rgba(148,163,184,0.3)" }}>courses@lawctopus.com</a>
              <span>+91 98058 08820 (11am–12pm, 5–6pm)</span>
            </div>
            <div style={{ marginTop: 32, fontSize: 11, color: "#334155", fontFamily: "'JetBrains Mono',monospace" }}>
              © 2026 LAWCTOPUS · ALL RIGHTS RESERVED
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}