import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink, X, Wrench } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const FILTERS = [
  { id: 'all',      label: 'All'      },
  { id: 'design',   label: 'Design'   },
  { id: 'web',      label: 'Web'      },
  { id: 'branding', label: 'Branding' },
  { id: 'video',    label: 'Video'    },
];

const KNOWN_CATEGORIES = ['design', 'web', 'branding', 'video'];

const CATEGORY_COLORS = {
  design: '#6366f1',
  web: '#8b5cf6',
  branding: '#22d3ee',
  video: '#a855f7',
};

/* ─── Project Detail Modal ─────────────────────────────────── */
function ProjectModal({ project, onClose }) {
  if (!project) return null;

  const displayTags = Array.isArray(project.tags) ? project.tags : [];
  const displayTools = Array.isArray(project.tools) ? project.tools : [];

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 9000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            borderRadius: '24px',
            maxWidth: '640px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Detail project ${project.title}`}
        >
          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
            <img
              src={project.image}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(8,11,20,0.8) 0%, transparent 50%)',
            }} />
            {/* Category badge */}
            <div style={{
              position: 'absolute', top: '1rem', left: '1rem',
              padding: '0.3rem 0.85rem', borderRadius: '100px',
              background: `${project.color}25`, border: `1px solid ${project.color}50`,
              backdropFilter: 'blur(10px)', fontSize: '0.72rem', fontWeight: 700,
              color: project.color, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {project.category}
            </div>
            {/* Close button */}
            <motion.button
              onClick={onClose}
              aria-label="Tutup modal"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={18} />
            </motion.button>
          </div>

          {/* Content */}
          <div style={{ padding: '1.75rem' }}>
            {/* Tags */}
            {displayTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.875rem' }}>
                {displayTags.map(tag => (
                  <span key={tag} style={{
                    fontSize: '0.72rem', color: 'var(--text-muted)',
                    padding: '0.2rem 0.65rem', borderRadius: '100px',
                    border: '1px solid var(--border-glass)', background: 'var(--bg-secondary)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: '1.5rem', letterSpacing: '-0.03em',
              marginBottom: '0.75rem', color: 'var(--text-primary)',
            }}>
              {project.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: '0.9rem', color: 'var(--text-secondary)',
              lineHeight: 1.75, marginBottom: '1.5rem',
            }}>
              {project.description}
            </p>

            {/* Tools */}
            {displayTools.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  marginBottom: '0.625rem', fontSize: '0.75rem',
                  color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  <Wrench size={13} />
                  Tools Used
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {displayTools.map(tool => (
                    <span key={tool} style={{
                      padding: '0.35rem 0.875rem', borderRadius: '100px',
                      background: `${project.color}12`,
                      border: `1px solid ${project.color}30`,
                      fontSize: '0.8rem', fontWeight: 600, color: project.color,
                    }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {project.link && project.link !== '#' ? (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Visit Project <ExternalLink size={15} />
                </motion.a>
              ) : (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 1.5rem', borderRadius: '100px',
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)',
                }}>
                  🔒 Link Coming Soon
                </div>
              )}
              <motion.button
                onClick={onClose}
                className="btn-outline"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Tutup
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Project Card ──────────────────────────────────────────── */
function ProjectCard({ project, index, onView }) {
  const displayTags = Array.isArray(project.tags) ? project.tags : [];
  const displayTools = Array.isArray(project.tools) ? project.tools : [];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      className="noise-bg"
      style={{
        borderRadius: '20px', overflow: 'hidden',
        border: '1px solid var(--border-glass)',
        background: 'var(--bg-card)',
        cursor: 'pointer', position: 'relative',
      }}
      whileHover={{ y: -6 }}
      onClick={() => onView(project)}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
        <motion.img
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(8,11,20,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05 }}
            style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowUpRight size={22} style={{ color: '#080b14' }} aria-hidden="true" />
          </motion.div>
        </motion.div>

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '0.875rem', left: '0.875rem',
          padding: '0.3rem 0.75rem', borderRadius: '100px',
          background: `${project.color}22`, border: `1px solid ${project.color}44`,
          backdropFilter: 'blur(10px)', fontSize: '0.72rem', fontWeight: 600,
          color: project.color, letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        {displayTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
            {displayTags.slice(0, 2).map(tag => (
              <span key={tag} style={{
                fontSize: '0.72rem', color: 'var(--text-muted)',
                padding: '0.2rem 0.6rem', borderRadius: '100px',
                border: '1px solid var(--border-glass)', background: 'var(--bg-secondary)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: '1.125rem', letterSpacing: '-0.02em',
          marginBottom: '0.5rem', color: 'var(--text-primary)',
        }}>
          {project.title}
        </h3>

        <p style={{
          fontSize: '0.85rem', color: 'var(--text-secondary)',
          lineHeight: 1.6, marginBottom: '1rem',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {project.description}
        </p>

        {/* Tools + View button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {displayTools.slice(0, 3).map(tool => (
              <span key={tool} style={{
                fontSize: '0.7rem', color: project.color,
                padding: '0.15rem 0.5rem', borderRadius: '4px',
                background: `${project.color}12`,
              }}>
                {tool}
              </span>
            ))}
          </div>

          {/* View button — aksi buka modal */}
          <motion.button
            onClick={e => { e.stopPropagation(); onView(project); }}
            aria-label={`Lihat detail project ${project.title}`}
            whileHover={{ scale: 1.08, x: 2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              fontSize: '0.8rem', fontWeight: 700,
              color: project.color,
              background: `${project.color}15`,
              border: `1px solid ${project.color}35`,
              padding: '0.3rem 0.75rem',
              borderRadius: '100px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            View
            <ExternalLink size={12} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Projects Section ──────────────────────────────────────── */
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref, isInView } = useScrollAnimation();

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('order_index')
      .then(({ data, error }) => {
        if (error) {
          console.error('Projects fetch error:', error);
        }
        setProjects(data ?? []);
        setLoading(false);
      });
  }, []);

  // Hanya gunakan data murni dari database Supabase
  const displaySource = projects;

  // Normalise data dari Supabase/sample agar cocok dengan komponen
  const normalised = displaySource.map(p => {
    const rawTags = Array.isArray(p.tags) ? p.tags : [];
    const catFromTags = rawTags.find(t => KNOWN_CATEGORIES.includes(t?.toLowerCase()));
    const category = (p.category || catFromTags || 'design').toLowerCase();

    // Saring tag agar nama kategori tidak tampil duplikat di badge tag
    const cleanTags = rawTags.filter(t => !KNOWN_CATEGORIES.includes(t?.toLowerCase()));
    const rawTools = Array.isArray(p.tools) && p.tools.length > 0 ? p.tools : cleanTags;

    const color = p.color || CATEGORY_COLORS[category] || '#6366f1';

    return {
      ...p,
      image: p.image_url || p.image || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
      link: p.demo_url || p.link || '#',
      color,
      category,
      tools: rawTools.length > 0 ? rawTools : ['UI/UX'],
      tags: cleanTags.length > 0 ? cleanTags : [category],
    };
  });

  const filtered = activeFilter === 'all'
    ? normalised
    : normalised.filter(p => p.category === activeFilter);

  return (
    <>
      <section id="projects" className="section-padding" aria-label="Projects">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '3rem' }}
          >
            <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Portfolio</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginTop: '1rem' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Selected <span className="gradient-text">Works</span>
              </h2>
              {/* Filters */}
              <div role="group" aria-label="Project filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', padding: '0.375rem', borderRadius: '100px', border: '1px solid var(--border-glass)', background: 'var(--bg-card)' }}>
                {FILTERS.map(f => (
                  <motion.button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    aria-pressed={activeFilter === f.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '0.45rem 1rem', borderRadius: '100px', border: 'none',
                      fontSize: '0.825rem', fontWeight: 500, cursor: 'pointer',
                      background: activeFilter === f.id ? 'var(--gradient-primary)' : 'transparent',
                      color: activeFilter === f.id ? 'white' : 'var(--text-secondary)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {f.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grid */}
          <motion.div
            ref={ref}
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id || i}
                  project={project}
                  index={i}
                  onView={setSelectedProject}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {!loading && filtered.length === 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '4rem 1.5rem',
                color: 'var(--text-muted)',
                border: '1px dashed var(--border-glass)',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.01)',
              }}
            >
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Belum ada project yang diunggah.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Tambahkan project melalui panel admin agar tampil di halaman ini.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
