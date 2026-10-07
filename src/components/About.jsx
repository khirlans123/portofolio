import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Download, Award, Coffee } from 'lucide-react';
import profileImg from '../assets/profile.png';

function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useScrollAnimation();
  const started = useRef(false);

  useEffect(() => {
    if (isInView && !started.current) {
      started.current = true;
      const start = Date.now();
      const step = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(ease * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export default function About() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="about" className="section-padding" aria-label="About me">
      <div className="container-custom">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Left: Image */}
          <motion.div variants={itemVariants} style={{ position: 'relative' }}>
            <div style={{ position: 'relative', maxWidth: '420px' }}>
              {/* Main image — no box, fade bottom, larger */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  background: 'transparent',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={profileImg}
                  alt="Khoirul Anas — Creative Designer & Developer"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                  }}
                />
                {/* Fade bottom — smooth blend into background */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '45%',
                  background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }} />
              </motion.div>

              {/* Floating card — experience */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="glass-card"
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '-1.5rem',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  minWidth: '170px',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(99,102,241,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Award size={18} style={{ color: 'var(--accent-blue)' }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.25rem', lineHeight: 1 }}>20</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Years Old</div>
                </div>
              </motion.div>

              {/* Floating card — projects */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="glass-card"
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: '-1.5rem',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  minWidth: '160px',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(34,211,238,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Coffee size={18} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.25rem', lineHeight: 1 }}>Open</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>to Work</div>
                </div>
              </motion.div>

              {/* Decorative ring */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '-20px',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  zIndex: -1,
                }}
              />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div variants={containerVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.div variants={itemVariants}>
              <span className="section-label">About Me</span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Saya percaya bahwa{' '}
              <span className="gradient-text">desain yang baik</span>{' '}
              adalah seni yang berfungsi.
            </motion.h2>

            <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '1rem' }}>
              Halo! Saya Khoirul Anas, seorang Creative Designer & Developer yang berpasion di bidang UI/UX, graphic design, videografi, dan web development. Saya berusia 20 tahun dan sudah bergelut di dunia kreatif sejak awal masa kuliah.
            </motion.p>

            <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '1rem' }}>
              Pendekatan saya selalu dimulai dari <strong style={{ color: 'var(--text-primary)' }}>riset mendalam</strong>, dilanjutkan dengan strategi visual yang kuat, dan dieksekusi dengan detail yang presisi. Saya percaya bahwa setiap piksel memiliki tujuannya.
            </motion.p>

            <motion.div
              variants={itemVariants}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              {[
                { icon: '🎨', title: 'Design-First', desc: 'Visual yang kuat adalah fondasi setiap project.' },
                { icon: '⚡', title: 'Fast Delivery', desc: 'Tepat waktu tanpa mengorbankan kualitas.' },
                { icon: '🔍', title: 'Detail-Oriented', desc: 'Setiap pixel dirancang dengan tujuan.' },
                { icon: '🤝', title: 'Collaborative', desc: 'Bekerja sama untuk hasil terbaik.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="glass-card"
                  style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
                >
                  <span style={{ fontSize: '1.25rem' }} role="img" aria-label={item.title}>{item.icon}</span>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}
            >
              {[
                { target: 3, suffix: '+', label: 'Years Exp.' },
                { target: 5, suffix: '+', label: 'Skills' },
                { target: 100, suffix: '%', label: 'Satisfaction' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: '2rem',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    <Counter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA — CV download disabled for now */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
