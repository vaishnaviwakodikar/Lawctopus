import { useState, useEffect, useRef, useCallback } from "react";

const REG_URL = "https://www.lawctopus.com/expert-level-mastering-contract-drafting-freelancing/";

const clauses = [
  { b: "shall use commercially reasonable efforts to deliver drafts", a: "shall deliver the first draft within 48 hours" },
  { b: "no liability for delays caused by either party", a: "liability capped at the fees paid under this Agreement" },
  { b: "may terminate this Agreement at any time, without notice", a: "may terminate this Agreement on 30 days' written notice" },
  { b: "Service Provider's rates are subject to change without notice", a: "Service Provider's rates are fixed for the Term of this Agreement" },
];

const curriculum = [
  { id: "m1", label: "Months 1–2", title: "Foundations & negotiation basics", sessions: "8 sessions", pts: ["Elements of a valid contract and pre-contractual instruments", "Preamble, recitals, definitions, operative clauses", "Introduction to negotiation skills", "Hands-on: review and redraft a sale deed solo"] },
  { id: "m2", label: "Month 3", title: "Common & international agreements", sessions: "7–8 sessions", pts: ["NDAs, Master Service Agreements, Power of Attorney", "International contracts and cross-border considerations", "Advanced negotiation skills and tactics", "E-contracts and digital signatures"] },
  { id: "m3", label: "Month 4", title: "IP & technology agreements", sessions: "7–8 sessions", pts: ["Trademark licensing, copyright, and trade secret agreements", "Technology transfer and software licensing", "Website terms of service and privacy policies", "Data protection agreements"] },
  { id: "m4", label: "Month 5", title: "Real estate agreements", sessions: "7–8 sessions", pts: ["Sale deeds, gift deeds, leave & licence agreements", "Development agreements and joint development contracts", "Mortgage and loan agreements", "Real estate due diligence clauses"] },
  { id: "m5", label: "Month 6", title: "Business agreements & freelancing", sessions: "7–8 sessions", pts: ["Shareholders agreements, JV agreements, partnership deeds", "Freelancing: Upwork profile, Fiverr, LinkedIn outreach", "Getting your first paying client — live guidance", "10 polished contracts ready for your Upwork portfolio"] },
];

const reviews = [
  { init: "LS", color: "#c1440e", text: "The live sessions were genuinely interactive. Faculty addressed even tiny questions patiently. I drafted NDAs that helped me land a good internship.", author: "Law student", batch: "Dec–May 2026 batch" },
  { init: "YL", color: "#1a6b3a", text: "I got internship offers by mentioning this course. The assignments gave me real drafts to show employers — not just certificates.", author: "Young lawyer", batch: "Nagpur" },
  { init: "PR", color: "#1a1a1a", text: "Support team was always responsive. Content was practical and actually easy to understand. It's improved my professional growth a lot.", author: "Professional", batch: "Delhi" },
];

const perks = [
  "54 live sessions with practising corporate lawyers",
  "Draft and review 24+ agreements with personal feedback",
  "Upwork profile setup + direct client referrals",
  "Bi-monthly 1-on-1 career coaching calls",
  "Lifetime access to all materials and recordings",
  "Completion + merit certificate",
];

const photos = [
  {
    src: "https://images.unsplash.com/photo-1423592707957-3b212afa6733?q=80&w=900&auto=format&fit=crop",
    alt: "Open notebook beside a stack of books, mid-draft",
    caption: "Where the drafting actually happens",
    credit: "Mikhail Pavstyuk",
  },
  {
    src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=900&auto=format&fit=crop",
    alt: "Rows of books piled on library shelves",
    caption: "Months of research, distilled into clauses",
    credit: "Iñaki del Olmo",
  },
  {
    src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=900&auto=format&fit=crop",
    alt: "Statue of a figure holding the scales of justice",
    caption: "The standard you're training to meet",
    credit: "Tingey Injury Law Firm",
  },
];

function pad(n) { return String(n).padStart(2, "0"); }

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);
  return reduced;
}

function useCountdown(deadline) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, done: false });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(deadline) - Date.now()) / 1000));
      setT({ d: Math.floor(diff / 86400), h: Math.floor((diff % 86400) / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60, done: diff <= 0 });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [deadline]);
  return t;
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (reducedMotion) { setVis(true); return; }
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, [reducedMotion]);
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: reducedMotion || vis ? "none" : "translateY(24px)",
        transition: reducedMotion ? "none" : `opacity .55s ease ${delay}ms, transform .55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function StampBadge({ size = 92, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#c1440e" strokeWidth="2" strokeDasharray="3 4" opacity="0.8" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#c1440e" strokeWidth="1.2" opacity="0.6" />
      <path id="stampArcTop" d="M 18 50 A 32 32 0 0 1 82 50" fill="none" />
      <text fontFamily="'DM Mono', monospace" fontSize="8.4" fontWeight="500" fill="#c1440e" letterSpacing="2">
        <textPath href="#stampArcTop" startOffset="50%" textAnchor="middle">LAWCTOPUS</textPath>
      </text>
      <text x="50" y="47" fontFamily="'Lora', Georgia, serif" fontSize="13" fontStyle="italic" fontWeight="600" fill="#1a1a1a" textAnchor="middle">
        verified
      </text>
      <text x="50" y="60" fontFamily="'DM Mono', monospace" fontSize="6.5" fill="#888" textAnchor="middle" letterSpacing="1">
        20,000+ LEARNERS
      </text>
    </svg>
  );
}

function MonthPanel({ open, children }) {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!innerRef.current) return;
    setHeight(open ? innerRef.current.scrollHeight : 0);
  }, [open, children]);
  return (
    <div className={`lc-month-body${open ? " open" : " closed"}`} style={{ maxHeight: height }}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

function FeatIcon({ name }) {
  const icons = {
    contract: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="1" width="11" height="15" rx="1" stroke="#1a1a1a" strokeWidth="1.4"/>
        <line x1="6" y1="5.5" x2="11" y2="5.5" stroke="#c1440e" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="6" y1="8.5" x2="11" y2="8.5" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.5 1.5"/>
        <line x1="6" y1="11.5" x2="9" y2="11.5" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.5 1.5"/>
        <path d="M13 12 L17 16" stroke="#1a6b3a" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="12.5" cy="11.5" r="2" stroke="#1a6b3a" strokeWidth="1.2"/>
      </svg>
    ),
    briefcase: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="7" width="16" height="10" rx="1.5" stroke="#1a1a1a" strokeWidth="1.4"/>
        <path d="M7 7V5.5C7 4.67 7.67 4 8.5 4h3C12.33 4 13 4.67 13 5.5V7" stroke="#1a1a1a" strokeWidth="1.4"/>
        <line x1="2" y1="12" x2="18" y2="12" stroke="#1a1a1a" strokeWidth="1.2" strokeDasharray="1.5 1.5"/>
      </svg>
    ),
    clock: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7.5" stroke="#1a1a1a" strokeWidth="1.4"/>
        <line x1="10" y1="5.5" x2="10" y2="10" stroke="#c1440e" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10" y1="10" x2="13" y2="12" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="10" cy="10" r="1" fill="#1a1a1a"/>
      </svg>
    ),
    infinity: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 10C7.5 10 5.5 7 3.5 7C1.5 7 1 8.5 1 10C1 11.5 1.5 13 3.5 13C5.5 13 8.5 10 10 10C11.5 10 14.5 13 16.5 13C18.5 13 19 11.5 19 10C19 8.5 18.5 7 16.5 7C14.5 7 12.5 10 12.5 10" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    target: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7.5" stroke="#1a1a1a" strokeWidth="1.4"/>
        <circle cx="10" cy="10" r="4.5" stroke="#1a1a1a" strokeWidth="1.2"/>
        <circle cx="10" cy="10" r="1.5" fill="#c1440e"/>
        <line x1="10" y1="1" x2="10" y2="3.5" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="10" y1="16.5" x2="10" y2="19" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="1" y1="10" x2="3.5" y2="10" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="16.5" y1="10" x2="19" y2="10" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    badge: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="8" r="5.5" stroke="#1a1a1a" strokeWidth="1.4"/>
        <path d="M6.5 12.5L5 18L10 15.5L15 18L13.5 12.5" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M8 8L9.5 9.5L12.5 6.5" stroke="#c1440e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return <span aria-hidden="true">{icons[name] || null}</span>;
}

export default function LawctopusLanding() {
  const [clauseIdx, setClauseIdx] = useState(0);
  const [openMonth, setOpenMonth] = useState("m1");
  const [revIdx, setRevIdx] = useState(0);
  const [stamped, setStamped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const revTimer = useRef(null);
  const scrollY = useScrollY();
  const countdown = useCountdown("2026-06-30T23:59:59");
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 20);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setClauseIdx(i => (i + 1) % clauses.length), 4200);
    return () => clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    revTimer.current = setInterval(() => setRevIdx(i => (i + 1) % reviews.length), 5000);
    return () => clearInterval(revTimer.current);
  }, [reducedMotion]);

  const pickRev = (i) => {
    setRevIdx(i);
    clearInterval(revTimer.current);
    if (!reducedMotion) revTimer.current = setInterval(() => setRevIdx(j => (j + 1) % reviews.length), 5000);
  };

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    setMenuOpen(false);
  }, [reducedMotion]);

  const openReg = () => window.open(REG_URL, "_blank", "noopener");

  const handleSeal = (e) => {
    e.preventDefault();
    setStamped(true);
    setTimeout(() => { openReg(); setStamped(false); }, reducedMotion ? 0 : 420);
  };

  const navLinks = [["What's included", "features"], ["Curriculum", "curriculum"], ["Reviews", "reviews"], ["Pricing", "pricing"]];

  return (
    <div className="lc-root" style={{ fontFamily: "'Lora', Georgia, serif", background: "#FAFAF7", color: "#1a1a1a", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAFAF7; }
        .lc-root { font-family: 'DM Sans', sans-serif; position: relative; }
        .lc-root button { font: inherit; }
        .lc-root::before {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.05; mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .lc-root :focus { outline: none; }
        .lc-root :focus-visible { outline: 2px solid #c1440e; outline-offset: 3px; border-radius: 3px; }
        @media (prefers-reduced-motion: reduce) {
          .lc-root * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
        }
        .lc-squiggle { text-decoration: underline; text-decoration-style: wavy; text-decoration-color: #c1440e; text-underline-offset: 6px; font-style: italic; }
        .lc-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 90;
          padding: 0 28px; height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(250,250,247,0.92); backdrop-filter: blur(8px);
          border-bottom: 1px solid #e5e3dc; transition: box-shadow .3s;
        }
        .lc-nav.scrolled { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .lc-nav-brand { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; letter-spacing: 0.1em; color: #1a1a1a; background: none; border: none; cursor: pointer; }
        .lc-nav-links { display: flex; align-items: center; gap: 24px; }
        .lc-nav-link { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #666; cursor: pointer; background: none; border: none; transition: color .2s; padding: 4px 0; }
        .lc-nav-link:hover { color: #1a1a1a; }
        .lc-nav-enroll { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; background: #c1440e; color: #fff; border: none; cursor: pointer; padding: 8px 18px; border-radius: 6px; transition: background .2s, transform .15s; }
        .lc-nav-enroll:hover { background: #a83a0c; transform: translateY(-1px); }
        .lc-burger { display: none; background: none; border: none; cursor: pointer; padding: 8px; flex-direction: column; gap: 4px; }
        .lc-burger span { display: block; width: 20px; height: 2px; background: #1a1a1a; transition: transform .25s, opacity .25s; }
        .lc-burger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .lc-burger.open span:nth-child(2) { opacity: 0; }
        .lc-burger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        .lc-mobile-menu {
          position: fixed; top: 56px; left: 0; right: 0; z-index: 89;
          background: #FAFAF7; border-bottom: 1px solid #e5e3dc;
          display: flex; flex-direction: column; padding: 8px 28px 18px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }
        .lc-mobile-menu .lc-nav-link { text-align: left; padding: 12px 0; border-bottom: 1px solid #f0ede8; font-size: 14px; }
        .lc-mobile-menu .lc-nav-enroll { margin-top: 14px; padding: 12px; text-align: center; }
        .lc-section { padding: 96px 0; border-bottom: 1px solid #e5e3dc; }
        .lc-wrap { max-width: 1080px; margin: 0 auto; padding: 0 28px; }
        .lc-wrap-narrow { max-width: 720px; margin: 0 auto; padding: 0 28px; }
        .lc-label { display: inline-flex; align-items: center; gap: 6px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500; color: #c1440e; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 14px; }
        .lc-label::before { content: '↳'; font-size: 13px; }
        .lc-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 88px 0 60px; }
        .lc-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .lc-h1 { font-family: 'Lora', Georgia, serif; font-size: clamp(32px, 4.5vw, 52px); font-weight: 500; line-height: 1.2; margin-bottom: 22px; letter-spacing: -0.01em; }
        .lc-lede { font-family: 'DM Sans', sans-serif; font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 32px; }
        .lc-intro { opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s ease; }
        .lc-intro.in { opacity: 1; transform: none; }
        .lc-stats { display: flex; gap: 0; margin-bottom: 36px; flex-wrap: wrap; }
        .lc-stat { flex: 1; min-width: 86px; padding: 16px 20px; border-left: 1px solid #e5e3dc; }
        .lc-stat:first-child { border-left: none; padding-left: 0; }
        .lc-stat-num { font-family: 'Lora', serif; font-size: 26px; font-weight: 600; color: #1a1a1a; }
        .lc-stat-lbl { font-family: 'DM Sans', sans-serif; font-size: 11px; color: #999; margin-top: 2px; }
        .lc-btn-primary { font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px; background: #1a1a1a; color: #FAFAF7; border: none; cursor: pointer; padding: 13px 28px; border-radius: 6px; transition: background .2s, transform .15s; text-decoration: none; display: inline-block; }
        .lc-btn-primary:hover { background: #c1440e; transform: translateY(-2px); }
        .lc-btn-ghost { font-family: 'DM Sans', sans-serif; font-size: 14px; color: #555; background: none; border: 1px solid #ccc; cursor: pointer; padding: 13px 22px; border-radius: 6px; transition: border-color .2s, color .2s; }
        .lc-btn-ghost:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .lc-redline { background: #fff; border: 1px solid #e0ddd6; border-radius: 3px; padding: 28px 28px 22px; position: relative; box-shadow: 2px 3px 0 #e0ddd6; }
        .lc-redline::before { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 32px; background: #fff8f5; border-right: 1px solid #f0ebe4; }
        .lc-redline-meta { font-family: 'DM Mono', monospace; font-size: 10px; color: #bbb; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; padding-left: 40px; }
        .lc-live { width: 5px; height: 5px; border-radius: 50%; background: #c1440e; animation: lc-pulse 1.8s ease-in-out infinite; display: inline-block; }
        @keyframes lc-pulse { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
        .lc-redline-body { font-family: 'Lora', Georgia, serif; font-size: 15px; line-height: 1.8; min-height: 110px; padding-left: 40px; }
        .lc-del { color: #c1440e; text-decoration: line-through; display: block; margin-bottom: 8px; opacity: 0.75; }
        .lc-ins { color: #1a6b3a; display: block; opacity: 0; animation: lc-ins .5s ease .5s forwards; }
        @keyframes lc-ins { from{opacity:0;transform:translateY(6px);} to{opacity:1;transform:none;} }
        .lc-redline-foot { font-family: 'DM Mono', monospace; font-size: 10px; color: #bbb; margin-top: 16px; padding-top: 12px; border-top: 1px dashed #e5e3dc; padding-left: 40px; }
        .lc-feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #e5e3dc; border: 1px solid #e5e3dc; margin-top: 28px; }
        .lc-feat-card { background: #FAFAF7; padding: 28px 24px; transition: background .2s; }
        .lc-feat-card:hover { background: #fff; }
        .lc-feat-icon { font-size: 20px; margin-bottom: 12px; line-height: 1; }
        .lc-feat-title { font-family: 'Lora', Georgia, serif; font-size: 16px; font-weight: 500; margin-bottom: 8px; }
        .lc-feat-desc { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #666; line-height: 1.7; }
        .lc-month { border-bottom: 1px solid #e5e3dc; }
        .lc-month:last-child { border-bottom: none; }
        .lc-month-head { width: 100%; text-align: left; background: none; border: none; cursor: pointer; padding: 20px 0; display: flex; justify-content: space-between; align-items: baseline; gap: 16px; font-family: 'DM Sans', sans-serif; transition: color .2s; }
        .lc-month-head:hover .lc-month-title { color: #c1440e; }
        .lc-month-tag { font-family: 'DM Mono', monospace; font-size: 11px; color: #bbb; flex-shrink: 0; }
        .lc-month-title { font-family: 'Lora', Georgia, serif; font-size: 17px; font-weight: 500; color: #1a1a1a; transition: color .2s; }
        .lc-month-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .lc-month-sessions { font-family: 'DM Mono', monospace; font-size: 11px; color: #bbb; }
        .lc-chevron { font-size: 12px; color: #bbb; transition: transform .25s; display: inline-block; }
        .lc-chevron.open { transform: rotate(180deg); }
        .lc-month-body { overflow: hidden; transition: max-height .35s ease, opacity .3s ease; }
        .lc-month-body.open { opacity: 1; }
        .lc-month-body.closed { opacity: 0; }
        .lc-month-list { padding: 0 0 20px 0; list-style: none; }
        .lc-month-list li { font-family: 'DM Sans', sans-serif; font-size: 14px; color: #555; line-height: 1.8; padding: 2px 0 2px 18px; position: relative; }
        .lc-month-list li::before { content: '—'; position: absolute; left: 0; color: #ccc; }
        .lc-rev-card { background: #fff; border: 1px solid #e5e3dc; border-radius: 3px; padding: 40px 36px 36px; box-shadow: 2px 3px 0 #e5e3dc; max-width: 600px; margin: 0 auto 28px; min-height: 160px; text-align: center; }
        .lc-rev-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 600; color: #fff; letter-spacing: 0.02em; }
        .lc-rev-quote { font-family: 'Lora', Georgia, serif; font-size: 19px; line-height: 1.7; color: #1a1a1a; margin-bottom: 20px; font-style: italic; text-align: left; }
        .lc-rev-author { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; }
        .lc-rev-role { font-family: 'DM Mono', monospace; font-size: 11px; color: #bbb; margin-top: 2px; }
        .lc-rev-dots { display: flex; justify-content: center; gap: 8px; }
        .lc-rev-dot { width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #ccc; background: transparent; cursor: pointer; transition: all .2s; padding: 0; }
        .lc-rev-dot.active { background: #1a1a1a; border-color: #1a1a1a; }
        .lc-pricing-grid { display: grid; grid-template-columns: 1fr 360px; gap: 60px; align-items: start; }
        .lc-perk { display: flex; align-items: flex-start; gap: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #444; padding: 12px 0; border-bottom: 1px solid #f0ede8; }
        .lc-perk:last-child { border-bottom: none; }
        .lc-perk-check { color: #1a6b3a; flex-shrink: 0; font-size: 13px; margin-top: 2px; }
        .lc-price-card { background: #1a1a1a; color: #FAFAF7; border-radius: 3px; padding: 28px; position: sticky; top: 80px; box-shadow: 4px 5px 0 #c1440e; }
        .lc-price-card-label { font-family: 'DM Mono', monospace; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .lc-price-big { font-family: 'Lora', Georgia, serif; font-size: 34px; font-weight: 600; margin-bottom: 4px; }
        .lc-price-was { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #555; text-decoration: line-through; margin-bottom: 20px; }
        .lc-timer-label { font-family: 'DM Mono', monospace; font-size: 10px; color: #e8a87c; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
        .lc-countdown { display: flex; gap: 6px; margin-bottom: 24px; }
        .lc-count-box { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 8px 4px; text-align: center; }
        .lc-count-num { font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 500; color: #e8a87c; }
        .lc-count-lbl { font-size: 9px; color: #555; text-transform: uppercase; font-family: 'DM Mono', monospace; }
        .lc-enroll-big { display: block; width: 100%; text-align: center; background: #c1440e; color: #fff; border: none; cursor: pointer; padding: 14px; border-radius: 4px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px; transition: background .2s, transform .15s; }
        .lc-enroll-big:hover { background: #a83a0c; transform: translateY(-1px); }
        .lc-cta { background: #1a1a1a; color: #FAFAF7; padding: 96px 0; }
        .lc-cta-inner { max-width: 600px; }
        .lc-cta-label { font-family: 'DM Mono', monospace; font-size: 11px; color: #e8a87c; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 18px; display: flex; align-items: center; gap: 6px; }
        .lc-cta-label::before { content: '↳'; }
        .lc-cta-h { font-family: 'Lora', Georgia, serif; font-size: clamp(28px,4vw,44px); font-weight: 500; line-height: 1.2; margin-bottom: 16px; }
        .lc-cta-sub { font-family: 'DM Sans', sans-serif; font-size: 15px; color: #888; line-height: 1.8; margin-bottom: 40px; }
        .lc-seal { display: inline-flex; align-items: center; justify-content: center; width: 160px; height: 160px; border-radius: 50%; background: #c1440e; color: #fff; font-family: 'Lora', Georgia, serif; font-size: 16px; font-style: italic; text-align: center; line-height: 1.4; border: 2px solid rgba(255,255,255,0.2); cursor: pointer; text-decoration: none; transition: transform .2s, box-shadow .2s; box-shadow: 3px 4px 0 #8c2e07; }
        .lc-seal:hover { transform: rotate(-3deg) scale(1.04); box-shadow: 4px 6px 0 #8c2e07; }
        .lc-seal.stamped { animation: lc-stamp .42s ease; }
        @keyframes lc-stamp { 0%{transform:scale(1) rotate(0);} 30%{transform:scale(0.85) rotate(-8deg);} 70%{transform:scale(1.08) rotate(3deg);} 100%{transform:scale(1) rotate(0);} }
        .lc-cta-contact { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #555; margin-top: 44px; line-height: 1.9; }
        .lc-cta-contact a { color: #e8a87c; text-underline-offset: 3px; }
        .lc-copy { font-family: 'DM Mono', monospace; font-size: 10px; color: #444; margin-top: 48px; }
        .lc-price-hint { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #888; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .lc-price-hint s { color: #bbb; }
        .lc-price-hint strong { color: #1a6b3a; font-size: 15px; }
        .lc-h2 { font-family: 'Lora', Georgia, serif; font-size: clamp(22px, 3vw, 30px); font-weight: 500; line-height: 1.3; margin-bottom: 8px; }
        .lc-h2-sub { font-family: 'DM Sans', sans-serif; font-size: 14px; color: #888; margin-bottom: 32px; }
        .lc-photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 28px; }
        .lc-photo { position: relative; overflow: hidden; border-radius: 3px; aspect-ratio: 4 / 5; background: #e5e3dc; box-shadow: 2px 3px 0 #e0ddd6; border: 1px solid #e0ddd6; }
        .lc-photo img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(45%) sepia(12%) saturate(85%) contrast(1.05); transition: filter .4s ease, transform .5s ease; }
        .lc-photo:hover img { filter: grayscale(15%) sepia(6%) saturate(95%) contrast(1.05); transform: scale(1.035); }
        .lc-photo::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(193,68,14,0) 55%, rgba(26,26,26,0.62) 100%); }
        .lc-photo-caption { position: absolute; left: 14px; right: 14px; bottom: 12px; z-index: 2; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; line-height: 1.4; }
        .lc-photo-credits { font-family: 'DM Mono', monospace; font-size: 10px; color: #bbb; margin-top: 16px; }
        .lc-mobile-cta { position: fixed; left: 0; right: 0; bottom: 0; z-index: 80; display: none; align-items: center; justify-content: space-between; gap: 12px; background: #fff; border-top: 1px solid #e5e3dc; padding: 12px 16px; box-shadow: 0 -6px 20px rgba(0,0,0,0.08); }
        .lc-mobile-cta-price { font-family: 'Lora', Georgia, serif; font-size: 16px; font-weight: 600; }
        .lc-mobile-cta-price span { display: block; font-family: 'DM Sans', sans-serif; font-size: 10px; color: #999; font-weight: 400; }
        .lc-mobile-cta button { font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px; background: #c1440e; color: #fff; border: none; cursor: pointer; padding: 11px 18px; border-radius: 6px; flex-shrink: 0; }
        @media (max-width: 860px) {
          .lc-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .lc-feat-grid { grid-template-columns: 1fr 1fr; }
          .lc-pricing-grid { grid-template-columns: 1fr; }
          .lc-price-card { position: static; }
        }
        @media (max-width: 700px) { .lc-photo-grid { grid-template-columns: 1fr; } }
        @media (max-width: 600px) {
          .lc-feat-grid { grid-template-columns: 1fr; }
          .lc-nav-links { display: none; }
          .lc-burger { display: flex; }
          .lc-mobile-cta { display: flex; }
          .lc-section { padding: 64px 0; }
          .lc-hero { padding-bottom: 88px; }
        }
      `}</style>

      <a
        href="#main"
        style={{ position: "absolute", left: -9999, top: 0 }}
        onFocus={(e) => { e.target.style.left = "12px"; e.target.style.top = "12px"; e.target.style.zIndex = 200; e.target.style.background = "#1a1a1a"; e.target.style.color = "#fff"; e.target.style.padding = "8px 14px"; e.target.style.borderRadius = "6px"; }}
        onBlur={(e) => { e.target.style.left = "-9999px"; }}
      >
        Skip to main content
      </a>

      <nav className={`lc-nav${scrollY > 20 ? " scrolled" : ""}`} aria-label="Primary">
        <button className="lc-nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })} aria-label="Back to top">
          Lawctopus
        </button>
        <div className="lc-nav-links">
          {navLinks.map(([l, id]) => (
            <button key={id} className="lc-nav-link" onClick={() => scrollTo(id)}>{l}</button>
          ))}
          <button className="lc-nav-enroll" onClick={openReg}>Enroll now</button>
        </div>
        <button
          className={`lc-burger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(m => !m)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span /><span /><span />
        </button>
      </nav>
      {menuOpen && (
        <div className="lc-mobile-menu" role="menu">
          {navLinks.map(([l, id]) => (
            <button key={id} className="lc-nav-link" onClick={() => scrollTo(id)} role="menuitem">{l}</button>
          ))}
          <button className="lc-nav-enroll" onClick={openReg}>Enroll now</button>
        </div>
      )}
      <div style={{ height: 56 }} />

      <main id="main">
        {/* HERO */}
        <section className="lc-hero lc-section" style={{ borderBottom: "1px solid #e5e3dc" }} aria-label="Introduction">
          <div className="lc-wrap">
            <div className="lc-hero-grid">
              <div className={`lc-intro${loaded ? " in" : ""}`}>
                <div className="lc-label">New batch · July 1, 2026</div>
                <h1 className="lc-h1">
                  Learn to draft contracts.<br />
                  <span className="lc-squiggle">Start freelancing</span> in 6 months.
                </h1>
                <p className="lc-lede">
                  54 live sessions with practising lawyers. Draft 24+ real agreements — NDAs, MSAs, IP, real estate. Get your first Upwork client with guidance from someone who's actually done it.
                </p>
                <div className="lc-stats">
                  {[["20k+", "learners"], ["4.8/5", "avg rating"], ["54", "live sessions"], ["24+", "contracts"]].map(([n, l]) => (
                    <div key={l} className="lc-stat">
                      <div className="lc-stat-num">{n}</div>
                      <div className="lc-stat-lbl">{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                  <button className="lc-btn-primary" onClick={openReg}>Enroll now →</button>
                  <button className="lc-btn-ghost" onClick={() => scrollTo("curriculum")}>See the curriculum</button>
                </div>
                <div className="lc-price-hint">
                  <s>Rs. 60,000</s>
                  <span aria-hidden="true">→</span>
                  <strong>Rs. 24,999</strong>
                  <span>· limited seats</span>
                </div>
              </div>

              <div className={`lc-intro${loaded ? " in" : ""}`} style={{ transitionDelay: "120ms", position: "relative" }}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#bbb" }}>a real clause, being fixed in real time</span>
                </div>
                <StampBadge
                  size={88}
                  style={{ position: "absolute", top: -28, right: -16, zIndex: 2, transform: "rotate(-9deg)", filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.05))" }}
                />
                <div className="lc-redline" role="img" aria-label={`Contract clause example: original wording "${clauses[clauseIdx].b}" revised to "${clauses[clauseIdx].a}"`}>
                  <div className="lc-redline-meta">
                    <span className="lc-live" aria-hidden="true" /> §4.2 — Service Levels
                  </div>
                  <div className="lc-redline-body" key={clauseIdx}>
                    <span className="lc-del">{clauses[clauseIdx].b}</span>
                    <span className="lc-ins">{clauses[clauseIdx].a}</span>
                  </div>
                  <div className="lc-redline-foot">This is exactly the kind of thing you'll learn to catch.</div>
                </div>
                <div style={{ marginTop: 14, fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#bbb", paddingLeft: 4 }}>
                  ↑ cycles through real examples every few seconds
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PHOTOS */}
        <section className="lc-section" aria-label="What the work looks like">
          <div className="lc-wrap">
            <Reveal>
              <div className="lc-label">Not just theory</div>
              <h2 className="lc-h2">What this actually looks like</h2>
              <p className="lc-h2-sub">Research, drafting, and the standard you're being trained to meet.</p>
            </Reveal>
            <Reveal delay={80}>
              <div className="lc-photo-grid">
                {photos.map((p) => (
                  <div className="lc-photo" key={p.src}>
                    <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
                    <span className="lc-photo-caption">{p.caption}</span>
                  </div>
                ))}
              </div>
              <div className="lc-photo-credits">
                Photos via Unsplash — {photos.map(p => p.credit).join(", ")}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="lc-section" aria-label="What's included">
          <div className="lc-wrap">
            <Reveal>
              <div className="lc-label">What's included</div>
              <h2 className="lc-h2">Everything you need, nothing you don't</h2>
              <p className="lc-h2-sub">One course, 6 months, a complete skill set.</p>
            </Reveal>
            <Reveal delay={80}>
              <div className="lc-feat-grid">
                {[
                  { icon: "contract", title: "Draft 24+ contracts", desc: "NDAs, MSAs, real estate, IP, JV agreements — with personalised expert feedback on every single draft." },
                  { icon: "briefcase", title: "Freelance on Upwork", desc: "Guided by a top-rated Upwork expert. Set up your profile, build a portfolio, and get direct client referrals." },
                  { icon: "clock", title: "Save ~4 years", desc: "Learn in 6 months what most lawyers pick up over 4–5 years on the job. Condensed, practical, real." },
                  { icon: "infinity", title: "Lifetime access", desc: "All sessions, recordings, and reading materials. Yours forever, not just for the batch duration." },
                  { icon: "target", title: "1-on-1 coaching", desc: "Bi-monthly career calls with the LLS founders. CV, LinkedIn, cover letter — the full package." },
                  { icon: "badge", title: "Certificate", desc: "Completion certificate for everyone. Merit certificate for top performers. Something real to show." },
                ].map((f) => (
                  <div key={f.title} className="lc-feat-card">
                    <div className="lc-feat-icon"><FeatIcon name={f.icon} /></div>
                    <div className="lc-feat-title">{f.title}</div>
                    <p className="lc-feat-desc">{f.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CURRICULUM */}
        <section id="curriculum" className="lc-section" style={{ background: "#fff" }} aria-label="Curriculum">
          <div className="lc-wrap-narrow">
            <Reveal>
              <div className="lc-label">The curriculum</div>
              <h2 className="lc-h2">6 months, month by month</h2>
              <p className="lc-h2-sub">Click any month to expand.</p>
            </Reveal>
            <div style={{ borderTop: "1px solid #e5e3dc" }}>
              {curriculum.map((m, i) => {
                const isOpen = openMonth === m.id;
                return (
                  <Reveal key={m.id} delay={i * 50}>
                    <div className="lc-month">
                      <button
                        className="lc-month-head"
                        onClick={() => setOpenMonth(isOpen ? null : m.id)}
                        aria-expanded={isOpen}
                        aria-controls={`panel-${m.id}`}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: 16, flex: 1, textAlign: "left" }}>
                          <span className="lc-month-tag">{m.label}</span>
                          <span className="lc-month-title">{m.title}</span>
                        </div>
                        <div className="lc-month-right">
                          <span className="lc-month-sessions">{m.sessions}</span>
                          <span className={`lc-chevron${isOpen ? " open" : ""}`} aria-hidden="true">▾</span>
                        </div>
                      </button>
                      <MonthPanel open={isOpen}>
                        <ul className="lc-month-list" id={`panel-${m.id}`}>
                          {m.pts.map(pt => <li key={pt}>{pt}</li>)}
                        </ul>
                      </MonthPanel>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="lc-section" aria-label="Reviews">
          <div className="lc-wrap">
            <Reveal>
              <div className="lc-label" style={{ justifyContent: "center", display: "flex" }}>From people who've done it</div>
              <h2 className="lc-h2" style={{ textAlign: "center", marginBottom: 32 }}>What learners actually say</h2>
            </Reveal>
            <Reveal delay={80}>
              <div className="lc-rev-card">
                <div className="lc-rev-avatar" style={{ background: reviews[revIdx].color }} aria-hidden="true">
                  {reviews[revIdx].init}
                </div>
                <p className="lc-rev-quote">"{reviews[revIdx].text}"</p>
                <div className="lc-rev-author">{reviews[revIdx].author}</div>
                <div className="lc-rev-role">{reviews[revIdx].batch}</div>
              </div>
              <div className="lc-rev-dots" role="tablist" aria-label="Choose a review">
                {reviews.map((r, i) => (
                  <button
                    key={i}
                    className={`lc-rev-dot${revIdx === i ? " active" : ""}`}
                    onClick={() => pickRev(i)}
                    role="tab"
                    aria-selected={revIdx === i}
                    aria-label={`Review from ${r.author}`}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="lc-section" style={{ background: "#fff" }} aria-label="Pricing">
          <div className="lc-wrap">
            <Reveal>
              <div className="lc-label">Pricing</div>
              <h2 className="lc-h2">One payment. Six months. A career.</h2>
              <p className="lc-h2-sub">Starts July 1, 2026. Limited seats.</p>
            </Reveal>
            <div className="lc-pricing-grid">
              <Reveal>
                <div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "#555", lineHeight: 1.8, marginBottom: 28, maxWidth: 400 }}>
                    A 6-month course covering drafting, negotiation, and freelancing — with personal feedback on every contract you write and 1-on-1 career support throughout.
                  </p>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#bbb", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>What you get</div>
                  {perks.map(p => (
                    <div key={p} className="lc-perk">
                      <span className="lc-perk-check" aria-hidden="true">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="lc-price-card">
                  <div className="lc-price-card-label">One-time payment</div>
                  <div className="lc-price-big">Rs. 24,999</div>
                  <div className="lc-price-was">Was Rs. 60,000</div>
                  <div className="lc-timer-label">{countdown.done ? "Final seats — closing soon" : "Registration closes in"}</div>
                  <div className="lc-countdown" aria-live="off">
                    {[["d", "days"], ["h", "hrs"], ["m", "min"], ["s", "sec"]].map(([k, l]) => (
                      <div key={k} className="lc-count-box">
                        <div className="lc-count-num">{pad(countdown[k])}</div>
                        <div className="lc-count-lbl">{l}</div>
                      </div>
                    ))}
                  </div>
                  <button className="lc-enroll-big" onClick={openReg}>Enroll now →</button>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#555", marginTop: 14, textAlign: "center" }}>
                    Questions? courses@lawctopus.com
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="lc-cta" aria-label="Enroll">
          <div className="lc-wrap">
            <div className="lc-cta-inner">
              <Reveal>
                <div className="lc-cta-label">One last thing</div>
                <h2 className="lc-cta-h">Ready to actually learn this?</h2>
                <p className="lc-cta-sub">
                  Batch starts July 1, 2026. Rs. 24,999 locks your seat and gets you 6 months of the most practical contract training available for law students and young lawyers in India.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <a href={REG_URL} className={`lc-seal${stamped ? " stamped" : ""}`} onClick={handleSeal} target="_blank" rel="noopener noreferrer">
                  Sign &amp;<br />Enroll
                </a>
              </Reveal>
              <div className="lc-cta-contact">
                Have questions? Reach us at <a href="mailto:courses@lawctopus.com">courses@lawctopus.com</a><br />
                or call +91 98058 08820 (11am–12pm / 5–6pm)
              </div>
              <div className="lc-copy">© 2026 Lawctopus. All rights reserved.</div>
            </div>
          </div>
        </section>
      </main>

      <div className="lc-mobile-cta">
        <div className="lc-mobile-cta-price">
          Rs. 24,999<span>was Rs. 60,000</span>
        </div>
        <button onClick={openReg}>Enroll now</button>
      </div>
    </div>
  );
}