import { motion } from 'framer-motion';
import { Mail, AtSign, Music2, Code, MessageCircle, ArrowUp, Heart } from 'lucide-react';

const SOCIALS = [
  { icon: Mail, href: 'mailto:nascbert043@gmail.com', label: 'Email' },
  { icon: AtSign, href: 'https://instagram.com/khoirul_4nas', label: 'Instagram' },
  { icon: Music2, href: 'https://tiktok.com/@khirlans_', label: 'TikTok' },
  { icon: Code, href: 'https://github.com/khirlans123', label: 'GitHub' },
  { icon: MessageCircle, href: 'https://wa.me/6285738879805', label: 'WhatsApp' },
];

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-glass)',
        padding: '4rem 0 2rem',
      }}
      role="contentinfo"
    >
      <div className="container-custom">
        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '1.75rem',
              letterSpacing: '-0.03em',
            }}>
              <span className="gradient-text">KA</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '220px' }}>
              Creative Designer & Developer yang berpasion menciptakan pengalaman digital yang berkesan.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-blue)';
                    e.currentTarget.style.color = 'var(--accent-blue)';
                    e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Icon size={15} aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Navigation
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={e => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services quick */}
          <div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Services
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {['Graphic Design', 'UI/UX Design', 'Web Development', 'Branding', 'Video Editing', 'Social Media'].map(s => (
                <li key={s}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA card */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.15)',
            }}
          >
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
              Ready to start?
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem' }}>
              Mari diskusikan project kamu dan ciptakan sesuatu yang luar biasa bersama.
            </p>
            <motion.button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.825rem', padding: '0.75rem 1.25rem' }}
            >
              <Mail size={14} aria-hidden="true" />
              Get In Touch
            </motion.button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-glass)', marginBottom: '1.5rem' }} />

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
            © {new Date().getFullYear()} Khoirul Anas. Made with
            <Heart size={13} style={{ color: '#ef4444', fill: '#ef4444' }} aria-hidden="true" />
            and lots of coffee.
          </p>

          <motion.button
            onClick={scrollTop}
            aria-label="Back to top"
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.92 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '100px',
              padding: '0.4rem 0.875rem',
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--accent-blue)';
              e.currentTarget.style.borderColor = 'var(--accent-blue)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <ArrowUp size={14} aria-hidden="true" />
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
