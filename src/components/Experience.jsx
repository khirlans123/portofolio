import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import { experiences } from '../data/experience';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Experience() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="experience" className="section-padding" aria-label="Work experience">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            Journey
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
            My <span className="gradient-text">Experience</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            Perjalanan profesional saya dari awal hingga saat ini.
          </p>
        </motion.div>

        {/* Timeline */}
        <div
          ref={ref}
          style={{
            position: 'relative',
            maxWidth: '760px',
            margin: '0 auto',
          }}
        >
          {/* Vertical line */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '1.75rem',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'linear-gradient(to bottom, transparent, var(--border-subtle) 10%, var(--border-subtle) 90%, transparent)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  paddingLeft: '0',
                }}
              >
                {/* Dot */}
                <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '50%',
                      background: `${exp.color}18`,
                      border: `2px solid ${exp.color}50`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    aria-hidden="true"
                  >
                    <Briefcase size={18} style={{ color: exp.color }} />
                  </motion.div>
                </div>

                {/* Content */}
                <motion.div
                  className="glass-card"
                  whileHover={{ y: -4, borderColor: `${exp.color}40` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    flex: 1,
                    padding: '1.5rem',
                    borderRadius: '20px',
                    transition: 'border-color 0.3s',
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.875rem' }}>
                    <div>
                      <h3 style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        marginBottom: '0.25rem',
                      }}>
                        {exp.role}
                      </h3>
                      <p style={{ color: exp.color, fontWeight: 600, fontSize: '0.875rem' }}>
                        {exp.company}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '100px',
                        background: `${exp.color}12`,
                        border: `1px solid ${exp.color}25`,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: exp.color,
                        whiteSpace: 'nowrap',
                      }}>
                        {exp.period}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        textAlign: 'right',
                      }}>
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    marginBottom: '1rem',
                  }}>
                    {exp.description}
                  </p>

                  {/* Highlights */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {exp.highlights.map(h => (
                      <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={14} style={{ color: exp.color, flexShrink: 0 }} aria-hidden="true" />
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
