import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import profileImg from '../assets/profile.png';

const TOOLS = [
  { label: 'Figma',       emoji: '🎨', color: '#F24E1E', deg: 0   },
  { label: 'React',       emoji: '⚛️',  color: '#61DAFB', deg: 45  },
  { label: 'Photoshop',   emoji: '🖼️',  color: '#31A8FF', deg: 90  },
  { label: 'Premiere',    emoji: '🎬',  color: '#EA77FF', deg: 135 },
  { label: 'VS Code',     emoji: '💻',  color: '#007ACC', deg: 180 },
  { label: 'Illustrator', emoji: '🖊️',  color: '#FF9A00', deg: 225 },
  { label: 'After FX',    emoji: '✨',  color: '#9999FF', deg: 270 },
  { label: 'Tailwind',    emoji: '💨',  color: '#38BDF8', deg: 315 },
];

const ROLES = ['UI/UX Designer', 'Graphic Designer', 'Web Developer', 'Videographer', 'Motion Designer'];

function useTyping(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wordIdx];
    let t;
    if (!deleting && charIdx <= word.length) {      
      t = setTimeout(() => { setDisplay(word.slice(0, charIdx)); setCharIdx(c => c + 1); }, speed);
    } else if (!deleting && charIdx > word.length) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      t = setTimeout(() => { setDisplay(word.slice(0, charIdx)); setCharIdx(c => c - 1); }, speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const R = 160;
const PHOTO_H = 380;

export default function Hero() {
  const canvasRef = useRef(null);
  const typedText = useTyping(ROLES);
  const [isMobile, setIsMobile] = useState(false);

  /* detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* particle grid — skip on mobile for performance */
  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i <= Math.ceil(canvas.width / 52); i++) {
        for (let j = 0; j <= Math.ceil(canvas.height / 52); j++) {
          const wave = Math.sin((i + j) * 0.4 + t) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(i * 52, j * 52, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,102,241,${wave * 0.13})`;
          ctx.fill();
        }
      }
      t += 0.012;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, [isMobile]);

  const handleNav = href => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" aria-label="Hero section"
      style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

      {/* canvas — desktop only */}
      {!isMobile && (
        <canvas ref={canvasRef} aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
      )}

      {/* gradient orbs */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-15%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)', filter: 'blur(60px)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', bottom: 0, left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="container-custom"
        style={{ position: 'relative', zIndex: 2, paddingTop: '6rem', paddingBottom: '5rem', width: '100%' }}>

        {/* ═══ MOBILE LAYOUT ═══ */}
        {isMobile && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0' }}
          >
            {/* Photo + mini orbit — mobile */}
            <motion.div
              variants={itemVariants}
              style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '300px', height: '300px', margin: '0 auto 1.5rem' }}
            >
              {/* Glow */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
                style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.4) 0%,transparent 70%)', filter: 'blur(25px)', zIndex: 1 }}
              />

              {/* Orbit ring mobile */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
                style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1.5px solid rgba(99,102,241,0.3)', zIndex: 2, pointerEvents: 'none' }}
              />

              {/* 8 chips — satu ring radius 118, tetap di dalam container 300px */}
              {TOOLS.map((tool) => {
                const r = 118;
                const rad = (tool.deg * Math.PI) / 180;
                const cx = 150 + r * Math.sin(rad);
                const cy = 150 - r * Math.cos(rad);
                return (
                  <motion.div
                    key={tool.label}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      width: 300, height: 300,
                      borderRadius: '50%',
                      top: 0, left: 0,
                      zIndex: 4, pointerEvents: 'none',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      style={{ position: 'absolute', left: cx, top: cy, transform: 'translate(-50%,-50%)', pointerEvents: 'auto' }}
                    >
                      <div
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.2rem',
                          padding: '0.22rem 0.5rem', borderRadius: '100px',
                          background: 'rgba(8,11,20,0.92)', backdropFilter: 'blur(12px)',
                          border: `1px solid ${tool.color}55`,
                          boxShadow: `0 0 8px ${tool.color}40`,
                          fontSize: '0.6rem', fontWeight: 600, whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ fontSize: '0.68rem' }}>{tool.emoji}</span>
                        <span style={{ color: tool.color }}>{tool.label}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Photo mobile */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', zIndex: 3 }}
              >
                <motion.img
                  src={profileImg}
                  alt="Khoirul Anas"
                  loading="eager"
                  animate={{ filter: ['drop-shadow(0 0 18px rgba(99,102,241,0.5))', 'drop-shadow(0 0 36px rgba(139,92,246,0.7))', 'drop-shadow(0 0 18px rgba(99,102,241,0.5))'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ height: '260px', width: 'auto', objectFit: 'contain', display: 'block', userSelect: 'none', pointerEvents: 'none' }}
                />
              </motion.div>

            </motion.div>

            {/* Text — mobile */}
            <motion.p variants={itemVariants} style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>Hello, I'm</motion.p>

            <motion.h1 variants={itemVariants} style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem,10vw,3.5rem)', lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Khoirul Anas
            </motion.h1>

            <motion.div variants={itemVariants} style={{ marginBottom: '1rem', minHeight: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 'clamp(1rem,5vw,1.4rem)', letterSpacing: '-0.02em' }}>
                <span className="gradient-text">{typedText}</span>
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--accent-blue)', marginLeft: '2px', verticalAlign: 'middle', borderRadius: '2px' }} />
              </span>
            </motion.div>

            <motion.p variants={itemVariants} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '340px' }}>
              Saya menciptakan visual, pengalaman digital, dan solusi kreatif yang menggabungkan desain dengan teknologi.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
              <motion.button className="btn-primary" onClick={() => handleNav('#projects')} whileTap={{ scale: 0.96 }} style={{ padding: '0.875rem 1.75rem', fontSize: '0.9rem' }}>
                View My Work <ArrowRight size={15} />
              </motion.button>
              <motion.button className="btn-outline" onClick={() => handleNav('#contact')} whileTap={{ scale: 0.96 }} style={{ padding: '0.875rem 1.75rem', fontSize: '0.9rem' }}>
                Contact Me
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[{ value: '3+', label: 'Years Exp.' }, { value: '5+', label: 'Skills' }, { value: '100%', label: 'Satisfaction' }].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ═══ DESKTOP LAYOUT ═══ */}
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>

            {/* LEFT */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.p variants={itemVariants} style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Hello, I'm</motion.p>

              <motion.h1 variants={itemVariants} style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(2.8rem,5vw,5.5rem)', lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Khoirul Anas
              </motion.h1>

              <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem', minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 'clamp(1.1rem,2.8vw,1.9rem)', letterSpacing: '-0.02em' }}>
                  <span className="gradient-text">{typedText}</span>
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                    style={{ display: 'inline-block', width: '3px', height: '1.1em', background: 'var(--accent-blue)', marginLeft: '3px', verticalAlign: 'middle', borderRadius: '2px' }} />
                </span>
              </motion.div>

              <motion.p variants={itemVariants} style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: 1.75, marginBottom: '2.5rem' }}>
                Saya menciptakan visual, pengalaman digital, dan solusi kreatif yang menggabungkan desain dengan teknologi.
              </motion.p>

              <motion.div variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
                <motion.button className="btn-primary" onClick={() => handleNav('#projects')} whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }} style={{ padding: '1rem 2rem', fontSize: '0.95rem' }}>
                  View My Work <ArrowRight size={16} />
                </motion.button>
                <motion.button className="btn-outline" onClick={() => handleNav('#contact')} whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }} style={{ padding: '1rem 2rem', fontSize: '0.95rem' }}>
                  Contact Me
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                {[{ value: '3+', label: 'Years Exp.' }, { value: '5+', label: 'Skills' }, { value: '100%', label: 'Satisfaction' }].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — photo + orbit */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.34, 1.1, 0.64, 1] }}
              style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: `${PHOTO_H + R * 0.7}px` }}
            >
              {/* Glow */}
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0.8, 0.45] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
                style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.38) 0%,rgba(139,92,246,0.18) 45%,transparent 70%)', filter: 'blur(28px)', zIndex: 1 }}
              />

              {/* Ring outer */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} aria-hidden="true"
                style={{ position: 'absolute', width: R * 2 + 20, height: R * 2 + 20, borderRadius: '50%', border: '1.5px solid rgba(99,102,241,0.3)', boxShadow: '0 0 20px rgba(99,102,241,0.08)', zIndex: 2, pointerEvents: 'none' }}
              />
              {/* Ring inner */}
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} aria-hidden="true"
                style={{ position: 'absolute', width: R * 1.35, height: R * 1.35, borderRadius: '50%', border: '1px dashed rgba(34,211,238,0.22)', zIndex: 2, pointerEvents: 'none' }}
              />

              {/* Chips orbit */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0, rotate: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 360 }}
                transition={{
                  scale: { duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.7, delay: 0.4 },
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear', delay: 1.6 },
                }}
                style={{ position: 'absolute', width: R * 2 + 20, height: R * 2 + 20, borderRadius: '50%', zIndex: 2, pointerEvents: 'none' }}
              >
                {TOOLS.map((tool) => {
                  const rad = (tool.deg * Math.PI) / 180;
                  const half = R + 10;
                  const cx = half + half * Math.sin(rad);
                  const cy = half - half * Math.cos(rad);
                  return (
                    <motion.div key={tool.label}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: 1.6 }}
                      style={{ position: 'absolute', left: cx, top: cy, transform: 'translate(-50%,-50%)', pointerEvents: 'auto' }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.18 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.38rem 0.85rem', borderRadius: '100px', background: 'rgba(8,11,20,0.92)', backdropFilter: 'blur(16px)', border: `1px solid ${tool.color}55`, boxShadow: `0 0 16px ${tool.color}45, 0 4px 12px rgba(0,0,0,0.5)`, fontSize: '0.74rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'default' }}
                      >
                        <span style={{ fontSize: '0.88rem' }}>{tool.emoji}</span>
                        <span style={{ color: tool.color }}>{tool.label}</span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Photo */}
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center' }}
              >
                <motion.img src={profileImg} alt="Khoirul Anas" loading="eager"
                  animate={{ filter: ['drop-shadow(0 0 28px rgba(99,102,241,0.55))', 'drop-shadow(0 0 55px rgba(139,92,246,0.75))', 'drop-shadow(0 0 28px rgba(99,102,241,0.55))'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ height: `${PHOTO_H}px`, width: 'auto', objectFit: 'contain', display: 'block', userSelect: 'none', pointerEvents: 'none' }}
                />
              </motion.div>

            </motion.div>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.button onClick={() => handleNav('#about')} aria-label="Scroll to about section"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', zIndex: 2 }}>
        <span>Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={14} />
        </motion.div>
      </motion.button>
    </section>
  );
}
