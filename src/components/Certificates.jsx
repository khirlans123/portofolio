import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ArrowUpRight, ExternalLink, Calendar, CheckCircle2, ShieldCheck, X, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/* ─── Certificate Modal (Detail Pop-up: Tampil Penuh & Responsif) ─── */
function CertificateModal({ cert, onClose }) {
  if (!cert) return null;

  const displaySkills = Array.isArray(cert.skills)
    ? cert.skills
    : typeof cert.skills === 'string' && cert.skills.trim()
    ? cert.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <AnimatePresence>
      <motion.div
        key="cert-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 5, 12, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          key="cert-modal"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            borderRadius: '24px',
            maxWidth: '920px',
            width: '95%',
            maxHeight: '92vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(10, 14, 25, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(10, 14, 25, 0.75)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={18} />
          </button>

          {/* Full Certificate Image Container (100% Utuh & Responsif, Tidak Terpotong) */}
          {cert.image_url ? (
            <div
              style={{
                position: 'relative',
                width: '100%',
                background: '#070a13',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem',
                borderBottom: '1px solid var(--border-glass)',
                overflow: 'hidden',
              }}
            >
              <img
                src={cert.image_url}
                alt={cert.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '68vh',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7)',
                  display: 'block',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                padding: '3rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-glass)',
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={36} style={{ color: '#818cf8' }} />
              </div>
            </div>
          )}

          {/* Details Body */}
          <div style={{ padding: '1.75rem 2rem' }}>
            {/* Badges row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.875rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '100px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  color: '#818cf8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={14} />
                {cert.issuer}
              </span>

              {cert.date && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '100px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                  }}
                >
                  <Calendar size={13} />
                  {cert.date}
                </span>
              )}

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '100px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  color: '#4ade80',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={12} />
                Sertifikat Terverifikasi
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.25rem, 3vw, 1.6rem)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              {cert.title}
            </h3>

            {/* Skills / Topics */}
            {displaySkills.length > 0 && (
              <div style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Keahlian & Kompetensi:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {displaySkills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-primary)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '100px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-glass)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <CheckCircle2 size={12} style={{ color: '#22d3ee' }} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)' }}>
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  Verifikasi Kredensial Resmi
                  <ExternalLink size={15} />
                </a>
              )}

              {cert.image_url && (
                <a
                  href={cert.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '100px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
                >
                  <ExternalLink size={14} />
                  Buka Gambar Resolusi Penuh
                </a>
              )}

              <button
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '100px',
                  background: 'transparent',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  marginLeft: 'auto',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-glass)';
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Certificate Card (Tampilan Teaser: Bikin Penasaran Sebelum Klik View) ─── */
function CertificateCard({ cert, index, onView }) {
  const displaySkills = Array.isArray(cert.skills)
    ? cert.skills
    : typeof cert.skills === 'string' && cert.skills.trim()
    ? cert.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      className="noise-bg"
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--border-glass)',
        background: 'var(--bg-card)',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      whileHover={{ y: -6 }}
      onClick={() => onView(cert)}
    >
      {/* Tampilan Gambar Teaser — Cuplikan Menarik Sebelum Klik View */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
        {cert.image_url ? (
          <motion.img
            src={cert.image_url}
            alt={cert.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at center, rgba(99,102,241,0.15), transparent 70%), var(--bg-secondary)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={28} style={{ color: '#818cf8' }} />
            </div>
          </div>
        )}

        {/* Hover overlay dengan tombol rasa penasaran (Lihat Sertifikat Penuh) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(8, 11, 20, 0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            whileHover={{ scale: 1.05, opacity: 1 }}
            transition={{ delay: 0.05 }}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '100px',
              background: 'white',
              color: '#080b14',
              fontSize: '0.825rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <Eye size={15} />
            <span>Lihat Sertifikat Lengkap</span>
          </motion.div>
        </motion.div>

        {/* Badge Penerbit (Issuer) di pojok kiri atas gambar */}
        <div
          style={{
            position: 'absolute',
            top: '0.875rem',
            left: '0.875rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '100px',
            background: 'rgba(99, 102, 241, 0.35)',
            border: '1px solid rgba(99, 102, 241, 0.55)',
            backdropFilter: 'blur(10px)',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: '#c7d2fe',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <ShieldCheck size={12} style={{ color: '#818cf8' }} />
          <span>{cert.issuer}</span>
        </div>

        {/* Badge Tanggal / Tahun di pojok kanan atas gambar */}
        {cert.date && (
          <div
            style={{
              position: 'absolute',
              top: '0.875rem',
              right: '0.875rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '100px',
              background: 'rgba(10, 14, 25, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            {cert.date}
          </div>
        )}

        {/* Badge Preview Teaser di pojok kanan bawah gambar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            padding: '0.22rem 0.6rem',
            borderRadius: '100px',
            background: 'rgba(8, 11, 20, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(6px)',
            fontSize: '0.68rem',
            fontWeight: 600,
            color: '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            pointerEvents: 'none',
          }}
        >
          <Eye size={11} style={{ color: '#818cf8' }} />
          <span>Klik untuk preview</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Tags / Skills Bar */}
        {displaySkills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
            {displaySkills.slice(0, 2).map((skill, sIdx) => (
              <span
                key={sIdx}
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '100px',
                  border: '1px solid var(--border-glass)',
                  background: 'var(--bg-secondary)',
                }}
              >
                {skill}
              </span>
            ))}
            {displaySkills.length > 2 && (
              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  padding: '0.2rem 0.45rem',
                }}
              >
                +{displaySkills.length - 2}
              </span>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#fbbf24',
                padding: '0.2rem 0.6rem',
                borderRadius: '100px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                background: 'rgba(245, 158, 11, 0.08)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Award size={11} /> Certified
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '1.125rem',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7rem',
          }}
        >
          {cert.title}
        </h3>

        {/* Description / Issuer */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1rem',
          }}
        >
          Sertifikasi resmi diterbitkan oleh <strong style={{ color: 'var(--text-primary)' }}>{cert.issuer}</strong>
          {cert.date ? ` pada tahun ${cert.date}.` : '.'}
        </p>

        {/* Bottom Bar — View Button & Verification Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem' }}>
          <motion.button
            onClick={e => {
              e.stopPropagation();
              onView(cert);
            }}
            aria-label={`Lihat detail sertifikat ${cert.title}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#818cf8',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              padding: '0.35rem 0.85rem',
              borderRadius: '100px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Eye size={13} />
            View
          </motion.button>

          {cert.credential_url ? (
            <motion.a
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '0.35rem 0.7rem',
                borderRadius: '8px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Verify
              <ExternalLink size={12} />
            </motion.a>
          ) : (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Verified
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Main Certificates Section ─────────────────────────────── */
export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const { ref } = useScrollAnimation();

  useEffect(() => {
    supabase
      .from('certificates')
      .select('*')
      .order('order_index')
      .then(({ data, error }) => {
        if (error) {
          console.error('Certificates fetch error:', error);
          setCerts([]);
        } else {
          // Hanya gunakan data murni dari database Supabase
          setCerts(data ?? []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Certificates catch error:', err);
        setCerts([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section id="certificates" className="section-padding" aria-label="Certificates" style={{ position: 'relative' }}>
        {/* Anchor alias untuk backward compatibility */}
        <div id="experience" style={{ position: 'absolute', top: 0, height: 0, width: 0 }} aria-hidden="true" />

        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '3rem' }}
          >
            <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              Credentials
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginTop: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  My <span className="gradient-text">Certificates</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginTop: '0.75rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  Koleksi sertifikasi resmi dan lisensi profesional yang memvalidasi kompetensi serta standar keahlian saya.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Grid */}
          <motion.div
            ref={ref}
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {loading ? (
              [1, 2, 3].map(n => (
                <div
                  key={n}
                  style={{
                    borderRadius: '20px',
                    height: '380px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    opacity: 0.4,
                  }}
                />
              ))
            ) : certs.length === 0 ? (
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
                <Award size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem', opacity: 0.35 }} />
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Belum ada sertifikat yang diunggah.
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Tambahkan sertifikat melalui panel admin agar tampil di halaman ini.
                </p>
              </div>
            ) : (
              certs.map((cert, index) => (
                <CertificateCard
                  key={cert.id || index}
                  cert={cert}
                  index={index}
                  onView={setSelectedCert}
                />
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Modal Detail Pop-up */}
      {selectedCert && (
        <CertificateModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </>
  );
}
