import { motion } from 'framer-motion';
import { Quote, Palette, Code2, Sparkles, Zap, Eye, Cpu } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const MOTTOS = [
  {
    id: 1,
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Prinsip Desain",
    icon: Palette,
    color: '#6366f1',
  },
  {
    id: 2,
    text: "Code is like humor. When you have to explain it, it's bad. Tulis kode yang berbicara sendiri.",
    author: "Filosofi Coding",
    icon: Code2,
    color: '#22d3ee',
  },
  {
    id: 3,
    text: "Kreativitas bukan bakat — itu cara bekerja. Setiap piksel punya tujuan, setiap baris kode punya makna.",
    author: "Cara Kerja",
    icon: Sparkles,
    color: '#a855f7',
  },
  {
    id: 4,
    text: "Simplicity is the ultimate sophistication. Buat yang kompleks terasa mudah — itulah seni desain.",
    author: "Prinsip Visual",
    icon: Eye,
    color: '#f59e0b',
  },
  {
    id: 5,
    text: "First, solve the problem. Then, write the code. Teknologi adalah alat — bukan tujuan.",
    author: "Mindset Developer",
    icon: Cpu,
    color: '#ec4899',
  },
  {
    id: 6,
    text: "Good design is invisible. Great design is unforgettable. Buat karya yang diingat, bukan sekadar dilihat.",
    author: "Visi Kreatif",
    icon: Zap,
    color: '#8b5cf6',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export default function Testimonials() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section aria-label="Motto & Filosofi" style={{ padding: '7rem 0' }}>
      <div className="container-custom">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            Motto & Filosofi
          </span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginTop: '1rem',
            marginBottom: '1rem',
          }}>
            Prinsip yang <span className="gradient-text">Menginspirasi</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Kata-kata yang menjadi landasan dalam setiap karya desain dan baris kode yang saya tulis.
          </p>
        </motion.div>

        {/* Grid motto */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {MOTTOS.map((motto) => {
            const Icon = motto.icon;
            return (
              <motion.div
                key={motto.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="glass-card noise-bg"
                style={{
                  padding: '1.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  border: '1px solid var(--border-glass)',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = motto.color + '45';
                  e.currentTarget.style.boxShadow = `0 8px 40px ${motto.color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-glass)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Background glow */}
                <div aria-hidden="true" style={{
                  position: 'absolute', top: '-30px', right: '-30px',
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: `radial-gradient(circle, ${motto.color}20, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Top: icon + label */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `${motto.color}15`,
                    border: `1px solid ${motto.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} style={{ color: motto.color }} aria-hidden="true" />
                  </div>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 600,
                    color: motto.color, letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '100px',
                    background: `${motto.color}12`,
                    border: `1px solid ${motto.color}25`,
                  }}>
                    {motto.author}
                  </span>
                </div>

                {/* Quote icon */}
                <Quote
                  size={28}
                  style={{ color: motto.color, opacity: 0.2, marginBottom: '0.75rem' }}
                  aria-hidden="true"
                />

                {/* Text */}
                <blockquote style={{
                  fontSize: '0.925rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.75,
                  fontStyle: 'italic',
                  margin: 0,
                }}>
                  "{motto.text}"
                </blockquote>

                {/* Bottom accent line */}
                <div style={{
                  position: 'absolute', bottom: 0, left: '1.75rem', right: '1.75rem',
                  height: '2px',
                  background: `linear-gradient(90deg, ${motto.color}, transparent)`,
                  borderRadius: '2px 2px 0 0',
                }} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Big quote center */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            marginTop: '4rem',
            textAlign: 'center',
            padding: '3rem 2rem',
            borderRadius: '24px',
            background: 'rgba(99,102,241,0.04)',
            border: '1px solid rgba(99,102,241,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div aria-hidden="true" style={{
            position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          <Quote size={48} style={{ color: 'var(--accent-blue)', opacity: 0.15, margin: '0 auto 1.25rem' }} aria-hidden="true" />
          <p style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.4,
            maxWidth: '700px',
            margin: '0 auto 1rem',
          }}>
            <span className="gradient-text">"Bukan seberapa bagus alatmu, </span>
            <span style={{ color: 'var(--text-primary)' }}>tapi seberapa dalam kamu memahami masalah yang ingin kamu selesaikan."</span>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>— Khoirul Anas</p>
        </motion.div>

      </div>
    </section>
  );
}
