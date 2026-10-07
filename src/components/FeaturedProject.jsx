import { motion } from 'framer-motion';
import { ArrowUpRight, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { featuredProject } from '../data/projects';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function FeaturedProject() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section aria-label="Featured project" style={{ padding: '4rem 0 7rem' }}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            Featured
          </span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginTop: '1rem',
          }}>
            Project{' '}
            <span className="gradient-text">Unggulan</span>
          </h2>
        </motion.div>

        {/* Bento layout */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* Main image card */}
          <div
            style={{
              gridColumn: 'span 1',
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '4/3',
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-card)',
            }}
            className="featured-main"
          >
            <motion.img
              src={featuredProject.image}
              alt={featuredProject.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6 }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8,11,20,0.85) 0%, transparent 50%)',
            }} />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                {featuredProject.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '100px',
                    background: 'rgba(99,102,241,0.25)',
                    border: '1px solid rgba(99,102,241,0.4)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--accent-blue)',
                    backdropFilter: 'blur(8px)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h3 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '1.5rem',
                letterSpacing: '-0.03em',
                color: 'white',
                marginBottom: '0.5rem',
              }}>
                {featuredProject.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {featuredProject.description}
              </p>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Challenge */}
            <div className="glass-card" style={{ padding: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={16} style={{ color: '#f59e0b' }} aria-hidden="true" />
                </div>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>The Challenge</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {featuredProject.challenge}
              </p>
            </div>

            {/* Solution */}
            <div className="glass-card" style={{ padding: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lightbulb size={16} style={{ color: 'var(--accent-blue)' }} aria-hidden="true" />
                </div>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>The Solution</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {featuredProject.solution}
              </p>
            </div>

            {/* Result */}
            <div className="glass-card" style={{ padding: '1.5rem', flex: 1, border: '1px solid rgba(34,211,238,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(34,211,238,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={16} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
                </div>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>The Result</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {featuredProject.result}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tools + CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginTop: '1.25rem',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border-glass)',
            background: 'var(--bg-card)',
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tools Used</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {featuredProject.tools.map(tool => (
                <span key={tool} style={{
                  padding: '0.3rem 0.875rem',
                  borderRadius: '100px',
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-blue)',
                  fontWeight: 500,
                }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <motion.a
            href={featuredProject.link}
            onClick={e => e.preventDefault()}
            className="btn-primary"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`View ${featuredProject.title} project`}
          >
            View Full Case Study
            <ArrowUpRight size={16} aria-hidden="true" />
          </motion.a>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .featured-main { grid-column: span 1; }
        }
      `}</style>
    </section>
  );
}
