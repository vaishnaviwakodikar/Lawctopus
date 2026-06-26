import { useState, useEffect, useRef } from "react";

const REGISTER_URL = "https://www.lawctopus.com/expert-level-mastering-contract-drafting-freelancing/";

const sectionsMeta = [
  { id: "hero", num: "§1", label: "Recitals" },
  { id: "features", num: "§2", label: "Whereas" },
  { id: "curriculum", num: "§3", label: "Operative Clauses" },
  { id: "reviews", num: "§4", label: "Representations" },
  { id: "pricing", num: "§5", label: "Consideration" },
  { id: "cta", num: "§6", label: "Execution" },
];

const clauses = [
  {
    before: "shall use commercially reasonable efforts to deliver drafts",
    after: "shall deliver the first draft within 48 hours",
  },
  {
    before: "no liability for delays caused by either party",
    after: "liability capped at the fees paid under this Agreement",
  },
  {
    before: "may terminate this Agreement at any time, without notice",
    after: "may terminate this Agreement on 30 days' written notice",
  },
  {
    before: "Service Provider's rates are subject to change without notice",
    after: "Service Provider's rates are fixed for the Term of this Agreement",
  },
];

const features = [
  { icon: "📝", title: "Draft 24+ contracts", desc: "NDAs, MSAs, real estate, IP, JV agreements, e-contracts and more — with personalised expert feedback on every draft." },
  { icon: "💼", title: "Freelance on Upwork", desc: "Training from a top-rated Upwork contract expert. Build your portfolio and receive direct client referrals." },
  { icon: "⏱️", title: "Save 4 years", desc: "Learn in 6 months what a practising lawyer takes 4–5 years to accumulate on the job." },
  { icon: "♾️", title: "Lifetime access", desc: "All recorded sessions, reading resources, drafts, and live session recordings — yours forever." },
  { icon: "🎯", title: "1-on-1 coaching", desc: "Bi-monthly career coaching calls with LLS founders. CV, cover letter, and LinkedIn feedback included." },
  { icon: "🏅", title: "Certificates", desc: "Completion certificate for all learners. Merit certificate for top performers in the batch." },
];

const curriculum = [
  { id: "m1", clause: "3.1", label: "Months 1–2", title: "Foundations & negotiation basics", sessions: "8 sessions", points: ["Elements of a valid contract and pre-contractual instruments", "Preamble, recitals, definitions, operative clauses", "Introduction to negotiation skills", "Hands-on: review and redraft a sale deed solo", "Assignment: identify contracts, obligations, and breach"] },
  { id: "m3", clause: "3.2", label: "Month 3", title: "Common & international agreements", sessions: "7–8 sessions", points: ["NDAs, Master Service Agreements, Power of Attorney", "International contracts and cross-border considerations", "Advanced negotiation skills and tactics", "E-contracts and digital signatures"] },
  { id: "m4", clause: "3.3", label: "Month 4", title: "IP & technology agreements", sessions: "7–8 sessions", points: ["Trademark licensing, copyright, and trade secret agreements", "Technology transfer and software licensing contracts", "Website terms of service and privacy policies", "Data protection agreements"] },
  { id: "m5", clause: "3.4", label: "Month 5", title: "Real estate agreements", sessions: "7–8 sessions", points: ["Sale deeds, gift deeds, and leave & licence agreements", "Development agreements and joint development contracts", "Mortgage and loan agreements", "Real estate due diligence clauses"] },
  { id: "m6", clause: "3.5", label: "Month 6", title: "Business agreements & freelancing", sessions: "7–8 sessions", points: ["Shareholders agreements, JV agreements, partnership deeds", "Freelancing: Upwork profile, Fiverr, LinkedIn outreach", "Getting your first paying client — live guidance", "10 polished contracts ready for your Upwork portfolio"] },
];

const reviews = [
  { initials: "LS", text: "The live sessions were highly interactive. The faculty addressed even minor questions patiently. I was able to draft NDAs that helped me land a good internship.", author: "Law student", role: "Dec–May 2026 batch" },
  { initials: "YL", text: "I could get good internships by mentioning this course. The assignments gave me real drafts I could show employers.", author: "Young lawyer", role: "Nagpur" },
  { initials: "PR", text: "The support team was always responsive. Course content was practical and easy to understand — it has improved my professional growth significantly.", author: "Professional", role: "Delhi" },
];

const perks = [
  "54 live sessions with practising corporate lawyers",
  "Draft and review 24+ agreements with personal feedback",
  "Upwork profile setup + direct client referrals",
  "Bi-monthly 1-on-1 career coaching calls",
  "Lifetime access to all materials and recordings",
  "Completion + merit certificate",
];

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
      const top = window.scrollY || doc.scrollTop || 0;
      setProgress(scrollable > 0 ? Math.min(100, (top / scrollable) * 100) : 0);
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
    const observers = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(id); }),
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);
  return active;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal${visible ? " reveal-visible" : ""}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

export default function LawctopusLanding() {
  const [openMonth, setOpenMonth] = useState("m1");
  const [activeReview, setActiveReview] = useState(0);
  const [stamped, setStamped] = useState(false);
  const [clauseIdx, setClauseIdx] = useState(0);
  const reviewTimer = useRef(null);
  const countdown = useCountdown("2026-06-30T23:59:59");
  const progress = useScrollProgress();
  const activeId = useActiveSection(sectionsMeta.map((s) => s.id));
  const activeMeta = sectionsMeta.find((s) => s.id === activeId) || sectionsMeta[0];

  useEffect(() => {
    const id = setInterval(() => setClauseIdx((i) => (i + 1) % clauses.length), 4200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    reviewTimer.current = setInterval(() => setActiveReview((i) => (i + 1) % reviews.length), 5200);
    return () => clearInterval(reviewTimer.current);
  }, []);

  const selectReview = (i) => {
    setActiveReview(i);
    clearInterval(reviewTimer.current);
    reviewTimer.current = setInterval(() => setActiveReview((j) => (j + 1) % reviews.length), 5200);
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleSeal = (e) => {
    e.preventDefault();
    setStamped(true);
    setTimeout(() => {
      window.open(REGISTER_URL, "_blank", "noopener,noreferrer");
      setStamped(false);
    }, 480);
  };

  const toggleMonth = (id) => setOpenMonth((prev) => (prev === id ? null : id));

  return (
    <div className="lc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        :root {
          --paper: #FAF7F0;
          --paper-deep: #F1ECDE;
          --ink: #1C2330;
          --ink-soft: #5C5747;
          --rule: #DDD5C2;
          --seal: #B23A2E;
          --seal-dark: #8C2C22;
          --gold: #AD8A2E;
          --ok: #3F6B4A;
          --font-display: 'Source Serif 4', Georgia, serif;
          --font-body: 'Inter', 'DM Sans', sans-serif;
          --font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;
        }
        .lc-root { font-family: var(--font-body); color: var(--ink); background: var(--paper); }
        .lc-root * { box-sizing: border-box; }
        .wrap { max-width: 1100px; margin: 0 auto; padding: 0 28px; }

        a:focus-visible, button:focus-visible { outline: 2px solid var(--seal); outline-offset: 3px; }

        /* top bar */
        .top-fixed { position: fixed; top: 0; left: 0; right: 0; z-index: 60; }
        .progress-track { height: 3px; background: var(--rule); }
        .progress-fill { height: 100%; background: var(--seal); transition: width .1s linear; }
        .site-header { height: 56px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 24px; background: rgba(250,247,240,0.92); backdrop-filter: blur(8px); border-bottom: 1px solid var(--rule); }
        .brand { font-family: var(--font-mono); font-weight: 600; font-size: 13px; letter-spacing: 0.14em; color: var(--ink); white-space: nowrap; }
        .header-clause { font-family: var(--font-mono); font-size: 11px; color: var(--ink-soft); letter-spacing: 0.03em; }
        .header-cta { font-family: var(--font-body); font-size: 13px; font-weight: 600; color: #fff; background: var(--ink); padding: 8px 16px; border-radius: 6px; text-decoration: none; transition: background .2s ease, transform .2s ease; white-space: nowrap; }
        .header-cta:hover { background: var(--seal); transform: translateY(-1px); }
        @media (max-width: 680px) { .header-clause { display: none; } }
        .spacer { height: 59px; }

        /* side rail */
        .side-rail { position: fixed; left: 26px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 22px; z-index: 40; }
        .rail-line { position: absolute; left: 9px; top: 4px; bottom: 4px; width: 1px; background: var(--rule); }
        .rail-dot { position: relative; display: flex; align-items: center; gap: 10px; background: none; border: none; cursor: pointer; padding: 0; }
        .rail-num { width: 19px; height: 19px; border-radius: 50%; background: var(--paper); border: 1px solid var(--rule); color: var(--ink-soft); font-family: var(--font-mono); font-size: 9px; display: flex; align-items: center; justify-content: center; transition: all .25s ease; flex-shrink: 0; }
        .rail-dot.active .rail-num { background: var(--seal); border-color: var(--seal); color: #fff; }
        .rail-label { font-size: 11px; color: var(--ink-soft); opacity: 0; transform: translateX(-6px); transition: all .25s ease; white-space: nowrap; }
        .rail-dot:hover .rail-label, .rail-dot.active .rail-label { opacity: 1; transform: none; color: var(--ink); }
        @media (max-width: 980px) { .side-rail { display: none; } }

        /* reveal */
        .reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s ease; }
        .reveal-visible { opacity: 1; transform: none; }

        section.full { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 88px 0; border-bottom: 1px solid var(--rule); }

        /* eyebrow */
        .eyebrow { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--seal); letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
        .eyebrow::before { content: ''; width: 22px; height: 1px; background: var(--seal); display: inline-block; }

        /* hero */
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 56px; align-items: center; }
        @media (max-width: 860px) { .hero-grid { grid-template-columns: 1fr; gap: 40px; } }
        .hero h1 { font-family: var(--font-display); font-size: clamp(30px, 5vw, 48px); font-weight: 600; line-height: 1.18; margin: 0 0 20px; max-width: 600px; }
        .hero h1 em { font-style: normal; color: var(--seal); }
        .hero p.lede { font-size: 16px; color: var(--ink-soft); line-height: 1.75; max-width: 480px; margin: 0 0 28px; }
        .stat-row { display: flex; gap: 36px; flex-wrap: wrap; margin-bottom: 32px; }
        .stat-num { font-family: var(--font-display); font-size: 24px; font-weight: 700; }
        .stat-lbl { font-size: 11px; color: var(--ink-soft); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.04em; }
        .cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
        .btn-primary { background: var(--ink); color: #fff; padding: 13px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; transition: background .2s ease, transform .2s ease; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary:hover { background: var(--seal); transform: translateY(-2px); }
        .btn-ghost { background: transparent; border: 1px solid var(--rule); color: var(--ink); padding: 13px 22px; border-radius: 8px; font-size: 14px; cursor: pointer; transition: border-color .2s ease, background .2s ease; }
        .btn-ghost:hover { border-color: var(--ink); background: rgba(28,35,48,0.04); }
        .price-line { font-size: 13px; color: var(--ink-soft); display: flex; align-items: center; gap: 8px; }
        .strike { text-decoration: line-through; opacity: 0.55; }
        .price-now { color: var(--ok); font-weight: 700; font-size: 16px; }

        /* redline card */
        .redline-card { background: var(--ink); color: var(--paper); border-radius: 14px; padding: 28px; box-shadow: 0 24px 60px -20px rgba(28,35,48,0.45); position: relative; overflow: hidden; }
        .redline-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--seal); }
        .redline-meta { font-family: var(--font-mono); font-size: 11px; color: #C9C2AE; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
        .redline-dot { width: 6px; height: 6px; border-radius: 50%; background: #E05A4A; animation: pulse 1.6s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        .redline-body { font-family: var(--font-display); font-size: 17px; line-height: 1.7; min-height: 132px; }
        .redline-del { color: #C9846F; text-decoration: line-through; opacity: 0.75; display: block; margin-bottom: 10px; animation: strikeIn .5s ease; }
        .redline-ins { color: var(--paper); display: block; animation: insertIn .5s ease both; animation-delay: .55s; opacity: 0; }
        @keyframes strikeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 0.75; transform: none; } }
        @keyframes insertIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .redline-foot { margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(250,247,240,0.15); font-family: var(--font-mono); font-size: 10px; color: #9B9480; letter-spacing: 0.04em; }

        .scroll-cue { align-self: center; margin-top: 56px; display: flex; flex-direction: column; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; color: var(--ink-soft); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; }
        .scroll-cue span.arrow { font-size: 16px; animation: bob 1.8s ease-in-out infinite; }
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }

        /* features */
        .feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
        .feat-card { background: var(--paper); border: 1px solid var(--rule); border-left: 3px solid var(--rule); border-radius: 10px; padding: 22px; transition: border-left-color .25s ease, transform .25s ease, box-shadow .25s ease; }
        .feat-card:hover { border-left-color: var(--seal); transform: translateY(-4px); box-shadow: 0 16px 30px -18px rgba(28,35,48,0.25); }
        .feat-icon { font-size: 22px; margin-bottom: 10px; }
        .feat-title { font-family: var(--font-display); font-size: 16px; font-weight: 600; margin: 0 0 6px; }
        .feat-desc { font-size: 13px; color: var(--ink-soft); line-height: 1.65; margin: 0; }

        /* curriculum */
        .clause-item { margin-bottom: 10px; border: 1px solid var(--rule); border-radius: 10px; overflow: hidden; }
        .clause-head { width: 100%; text-align: left; background: var(--paper); border: none; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px; transition: background .2s ease; }
        .clause-head:hover { background: var(--paper-deep); }
        .clause-head.open { background: var(--paper-deep); }
        .clause-num { font-family: var(--font-mono); font-size: 12px; color: var(--seal); font-weight: 600; margin-right: 10px; }
        .clause-title { font-size: 14px; font-weight: 600; }
        .clause-meta { font-family: var(--font-mono); font-size: 11px; color: var(--ink-soft); flex-shrink: 0; display: flex; align-items: center; gap: 8px; }
        .clause-chevron { transition: transform .25s ease; display: inline-block; }
        .clause-chevron.open { transform: rotate(180deg); }
        .clause-body { background: var(--paper-deep); padding: 0 20px; max-height: 0; overflow: hidden; transition: max-height .35s ease, padding .35s ease; }
        .clause-body.open { padding: 14px 20px 18px; max-height: 400px; }
        .clause-body ul { margin: 0; padding-left: 18px; }
        .clause-body li { font-size: 13px; color: var(--ink-soft); line-height: 1.85; }

        /* reviews */
        .review-card { background: var(--paper); border: 1px solid var(--rule); border-radius: 14px; padding: 36px; max-width: 640px; margin: 0 auto 26px; min-height: 150px; }
        .review-stars { color: var(--gold); font-size: 14px; margin-bottom: 14px; letter-spacing: 2px; }
        .review-text { font-family: var(--font-display); font-size: 19px; line-height: 1.65; margin: 0 0 18px; }
        .review-author { font-size: 13px; font-weight: 600; }
        .review-role { font-size: 12px; color: var(--ink-soft); }
        .review-tabs { display: flex; justify-content: center; gap: 12px; }
        .review-tab { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--rule); background: var(--paper); font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--ink-soft); cursor: pointer; transition: all .2s ease; }
        .review-tab.active { background: var(--ink); color: var(--paper); border-color: var(--ink); }

        /* pricing */
        .pricing-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 50px; align-items: start; }
        @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr; } }
        .perk-list { list-style: none; padding: 0; margin: 22px 0 0; }
        .perk-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--ink-soft); padding: 9px 0; border-top: 1px solid var(--rule); }
        .perk-list li:first-child { border-top: none; }
        .perk-check { color: var(--ok); font-weight: 700; flex-shrink: 0; }
        .price-card { background: var(--ink); color: var(--paper); border-radius: 16px; padding: 30px; position: sticky; top: 90px; }
        .price-card .small { font-size: 11px; color: #C9C2AE; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 6px; }
        .price-big { font-family: var(--font-display); font-size: 32px; font-weight: 700; margin-bottom: 2px; }
        .price-was { font-size: 13px; color: #9B9480; text-decoration: line-through; margin-bottom: 18px; }
        .toe { font-family: var(--font-mono); font-size: 10px; color: var(--gold); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
        .countdown-row { display: flex; gap: 8px; margin-bottom: 22px; flex-wrap: wrap; }
        .count-box { background: rgba(250,247,240,0.07); border: 1px solid rgba(250,247,240,0.18); border-radius: 8px; padding: 8px 12px; text-align: center; min-width: 50px; }
        .count-num { font-family: var(--font-mono); font-size: 18px; font-weight: 700; color: var(--gold); }
        .count-lbl { font-size: 9px; color: #9B9480; text-transform: uppercase; }
        .enroll-btn { display: block; text-align: center; background: var(--seal); color: #fff; padding: 14px 0; border-radius: 8px; font-weight: 600; font-size: 15px; text-decoration: none; transition: background .2s ease, transform .2s ease; }
        .enroll-btn:hover { background: #C9483A; transform: translateY(-2px); }

        /* execution / cta */
        .cta-section { background: var(--ink); color: var(--paper); }
        .cta-section .eyebrow { color: var(--gold); }
        .cta-section .eyebrow::before { background: var(--gold); }
        .cta-title { font-family: var(--font-display); font-size: clamp(28px, 4.5vw, 44px); font-weight: 600; margin: 0 0 16px; max-width: 640px; }
        .cta-sub { font-size: 15px; color: #C9C2AE; max-width: 480px; line-height: 1.7; margin-bottom: 34px; }
        .seal-btn { display: inline-flex; align-items: center; justify-content: center; width: 168px; height: 168px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #C9483A, var(--seal-dark)); color: #fff; font-family: var(--font-display); font-size: 16px; font-weight: 600; text-align: center; text-decoration: none; border: 3px solid rgba(250,247,240,0.25); cursor: pointer; transition: transform .25s ease, box-shadow .25s ease; box-shadow: 0 18px 40px -12px rgba(0,0,0,0.5); line-height: 1.3; }
        .seal-btn:hover { transform: scale(1.04) rotate(-2deg); box-shadow: 0 24px 50px -10px rgba(0,0,0,0.55); }
        .seal-btn.stamped { animation: stampDown .48s ease; }
        @keyframes stampDown { 0% { transform: scale(1) rotate(0deg); } 35% { transform: scale(0.84) rotate(-7deg); } 70% { transform: scale(1.1) rotate(3deg); } 100% { transform: scale(1) rotate(0deg); } }
        .cta-footer-row { margin-top: 48px; display: flex; flex-wrap: wrap; gap: 28px; align-items: center; font-size: 13px; color: #9B9480; }
        .cta-footer-row a { color: #C9C2AE; text-decoration: none; border-bottom: 1px solid rgba(201,194,174,0.3); }
        .cta-footer-row a:hover { color: var(--paper); border-color: var(--paper); }
        .copyright { margin-top: 36px; font-size: 11px; color: #6E6858; font-family: var(--font-mono); }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
        }
      `}</style>

      {/* top fixed progress + header */}
      <div className="top-fixed">
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <header className="site-header">
          <span className="brand">LAWCTOPUS</span>
          <span className="header-clause">{activeMeta.num} — {activeMeta.label}</span>
          <a className="header-cta" href={REGISTER_URL} target="_blank" rel="noreferrer">Enroll now →</a>
        </header>
      </div>
      <div className="spacer" />

      {/* side rail nav */}
      <nav className="side-rail" aria-label="Page sections">
        <div className="rail-line" />
        {sectionsMeta.map((s) => (
          <button key={s.id} className={`rail-dot${activeId === s.id ? " active" : ""}`} onClick={() => scrollTo(s.id)}>
            <span className="rail-num">{s.num}</span>
            <span className="rail-label">{s.label}</span>
          </button>
        ))}
      </nav>

      {/* ── HERO / §1 RECITALS ── */}
      <section id="hero" className="full hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">§1 — RECITALS · NEW BATCH JULY 1, 2026</div>
            <h1>Master contract drafting. <em>Start freelancing in 6 months.</em></h1>
            <p className="lede">54 live sessions with practising lawyers. Draft 24+ complex agreements. Get your first Upwork client with direct guidance from a top-rated expert.</p>

            <div className="stat-row">
              {[["20,000+", "learners taught"], ["93.2/100", "avg. rating"], ["54", "live sessions"], ["24+", "contracts drafted"]].map(([num, lbl]) => (
                <div key={lbl}>
                  <div className="stat-num">{num}</div>
                  <div className="stat-lbl">{lbl}</div>
                </div>
              ))}
            </div>

            <div className="cta-row">
              <a className="btn-primary" href={REGISTER_URL} target="_blank" rel="noreferrer">Enroll now →</a>
              <button className="btn-ghost" onClick={() => scrollTo("curriculum")}>View curriculum</button>
            </div>

            <div className="price-line">
              <span className="strike">Rs. 60,000</span>
              <span>→</span>
              <span className="price-now">Rs. 24,999</span>
              <span>· limited seats</span>
            </div>
          </div>

          <div className="redline-card">
            <div className="redline-meta"><span className="redline-dot" /> §4.2 — Service Levels, live edit</div>
            <div className="redline-body" key={clauseIdx}>
              <span className="redline-del">{clauses[clauseIdx].before}</span>
              <span className="redline-ins">{clauses[clauseIdx].after}</span>
            </div>
            <div className="redline-foot">This is the kind of clause you'll learn to spot — and fix.</div>
          </div>
        </div>
        <button className="scroll-cue" onClick={() => scrollTo("features")}>
          WHAT'S INCLUDED <span className="arrow">↓</span>
        </button>
      </section>

      {/* ── §2 WHEREAS / FEATURES ── */}
      <section id="features" className="full" style={{ background: "var(--paper-deep)" }}>
        <div className="wrap">
          <Reveal><div className="eyebrow">§2 — WHEREAS</div></Reveal>
          <Reveal><h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, margin: "0 0 28px" }}>Everything bundled into one course</h2></Reveal>
          <div className="feat-grid">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="feat-card">
                  <div className="feat-icon">{f.icon}</div>
                  <h3 className="feat-title">{f.title}</h3>
                  <p className="feat-desc">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── §3 OPERATIVE CLAUSES / CURRICULUM ── */}
      <section id="curriculum" className="full">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <Reveal><div className="eyebrow">§3 — OPERATIVE CLAUSES</div></Reveal>
          <Reveal><h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, margin: "0 0 6px" }}>The 6-month curriculum</h2></Reveal>
          <Reveal><p style={{ color: "var(--ink-soft)", fontSize: 14, margin: "0 0 28px" }}>Click a clause to expand it.</p></Reveal>

          {curriculum.map((m, i) => {
            const isOpen = openMonth === m.id;
            return (
              <Reveal key={m.id} delay={i * 60}>
                <div className="clause-item">
                  <button className={`clause-head${isOpen ? " open" : ""}`} onClick={() => toggleMonth(m.id)}>
                    <span>
                      <span className="clause-num">Clause {m.clause}</span>
                      <span className="clause-title">{m.label} · {m.title}</span>
                    </span>
                    <span className="clause-meta">{m.sessions} <span className={`clause-chevron${isOpen ? " open" : ""}`}>▾</span></span>
                  </button>
                  <div className={`clause-body${isOpen ? " open" : ""}`}>
                    <ul>{m.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── §4 REPRESENTATIONS / REVIEWS ── */}
      <section id="reviews" className="full" style={{ background: "var(--paper-deep)" }}>
        <div className="wrap">
          <Reveal><div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>§4 — REPRESENTATIONS</div></Reveal>
          <Reveal><h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, textAlign: "center", margin: "0 0 32px" }}>What learners say</h2></Reveal>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"{reviews[activeReview].text}"</p>
            <div className="review-author">{reviews[activeReview].author}</div>
            <div className="review-role">{reviews[activeReview].role}</div>
          </div>
          <div className="review-tabs">
            {reviews.map((r, i) => (
              <button key={r.initials} className={`review-tab${activeReview === i ? " active" : ""}`} onClick={() => selectReview(i)}>{r.initials}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── §5 CONSIDERATION / PRICING ── */}
      <section id="pricing" className="full">
        <div className="wrap">
          <Reveal><div className="eyebrow">§5 — CONSIDERATION</div></Reveal>
          <Reveal><h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, margin: "0 0 28px" }}>The price of 4 years, paid once</h2></Reveal>

          <div className="pricing-grid">
            <Reveal>
              <div>
                <p style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.75, maxWidth: 440 }}>
                  A 6-month, expert-level course starting July 1, 2026 — covering drafting, negotiation, and freelancing, with personal feedback on every contract you write.
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "26px 0 0" }}>Schedule of benefits</p>
                <ul className="perk-list">
                  {perks.map((p) => (
                    <li key={p}><span className="perk-check">✓</span>{p}</li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="price-card">
                <div className="small">One-time payment</div>
                <div className="price-big">Rs. 24,999</div>
                <div className="price-was">Regular: Rs. 60,000</div>

                <div className="toe">Time is of the essence — registration closes in</div>
                <div className="countdown-row">
                  {[["d", "days"], ["h", "hrs"], ["m", "min"], ["s", "sec"]].map(([k, lbl]) => (
                    <div key={k} className="count-box">
                      <div className="count-num">{pad(countdown[k])}</div>
                      <div className="count-lbl">{lbl}</div>
                    </div>
                  ))}
                </div>

                <a className="enroll-btn" href={REGISTER_URL} target="_blank" rel="noreferrer">Enroll now →</a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── §6 EXECUTION / FINAL CTA ── */}
      <section id="cta" className="full cta-section">
        <div className="wrap" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal><div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>§6 — EXECUTION</div></Reveal>
          <Reveal><h2 className="cta-title">Ready to put it in writing?</h2></Reveal>
          <Reveal delay={80}><p className="cta-sub">Batch begins July 1, 2026. Rs. 24,999 secures your seat — and a 6-month head start most lawyers spend years building.</p></Reveal>

          <Reveal delay={160}>
            <a href={REGISTER_URL} className={`seal-btn${stamped ? " stamped" : ""}`} onClick={handleSeal}>
              Sign &amp; Enroll
            </a>
          </Reveal>

          <div className="cta-footer-row">
            <span>Questions?</span>
            <a href="mailto:courses@lawctopus.com">courses@lawctopus.com</a>
            <span>+91 98058 08820 (11am–12pm, 5–6pm)</span>
          </div>
          <div className="copyright">© 2026 LAWCTOPUS · ALL RIGHTS RESERVED</div>
        </div>
      </section>
    </div>
  );
}

