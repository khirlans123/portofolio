import { motion } from 'framer-motion';
import { Palette, Layout, Code2, Video, Zap, Sparkles } from 'lucide-react';
import { skillCategories } from '../data/skills';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const iconMap = { Palette, Layout, Code2, Video, Zap, Sparkles };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

function SkillCard({ skill }) {
  const Icon = iconMap[skill.icon] || Sparkles;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-card noise-bg"
      style={{
        padding: '1.75rem',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-glass)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = skill.color + '50';
        e.currentTarget.style.boxShadow = `0 0 30px ${skill.color}20`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-glass)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '1.75rem',
        right: '1.75rem',
        height: '2px',
        background: `linear-gradient(90deg, ${skill.color}, transparent)`,
        borderRadius: '0 0 2px 2px',
      }} />

      {/* Icon */}
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        background: `${skill.color}18`,
        border: `1px solid ${skill.color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
      }}>
        <Icon size={24} style={{ color: skill.color }} aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 700,
        fontSize: '1.125rem',
        letterSpacing: '-0.02em',
        marginBottom: '0.5rem',
        color: 'var(--text-primary)',
      }}>
        {skill.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        marginBottom: '1.25rem',
      }}>
        {skill.description}
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proficiency</span>
          <span style={{ fontSize: '0.75rem', color: skill.color, fontWeight: 600 }}>{skill.level}%</span>
        </div>
        <div style={{
          height: '4px',
          background: 'var(--border-glass)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              height: '100%',
              width: `${skill.level}%`,
              background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`,
              borderRadius: '2px',
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {skill.skills.map((s) => (
          <span
            key={s}
            style={{
              padding: '0.2rem 0.625rem',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 500,
              color: skill.color,
              background: `${skill.color}12`,
              border: `1px solid ${skill.color}25`,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="skills" className="section-padding" aria-label="Skills">
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
            Expertise
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
            What I{' '}
            <span className="gradient-text">Do Best</span>
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Kombinasi skill yang saling melengkapi untuk menghadirkan solusi kreatif yang komprehensif.
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
          {skillCategories.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
