import { motion } from 'framer-motion';
import { Palette, AtSign, Zap, Layout, Code2, Video, ArrowRight, CheckCircle2 } from 'lucide-react';
import { services } from '../data/services';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const iconMap = { Palette, AtSign, Zap, Layout, Code2, Video };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || Zap;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="glass-card noise-bg"
      style={{
        padding: '1.75rem',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-glass)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = service.color + '40';
        e.currentTarget.style.boxShadow = `0 8px 40px ${service.color}15`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-glass)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${service.color}20, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        background: `${service.color}15`,
        border: `1px solid ${service.color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} style={{ color: service.color }} aria-hidden="true" />
      </div>

      <div>
        <h3 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: '1.125rem',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
        }}>
          {service.title}
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
        }}>
          {service.description}
        </p>
      </div>

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {service.features.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={13} style={{ color: service.color, flexShrink: 0 }} aria-hidden="true" />
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-glass)',
        marginTop: 'auto',
      }}>
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = service.color}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          Get Started
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="services" className="section-padding" aria-label="Services">
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
            Services
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
            What I <span className="gradient-text">Offer</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Dari desain hingga development, saya siap membantu mewujudkan visi kreatif kamu.
          </p>
        </motion.div>

        {/* Grid */}
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
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
