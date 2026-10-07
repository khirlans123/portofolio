import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.slice(1));
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: '-60px 0px -60px 0px' }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNav = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '0.75rem 0' : '1.25rem 0',
          background: scrolled
            ? 'rgba(8, 11, 20, 0.88)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-glass)' : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNav('#home'); }}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '1.5rem',
              letterSpacing: '-0.03em',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="gradient-text">KA</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Portfolio
            </span>
          </motion.a>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile" aria-label="Desktop navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                style={{
                  padding: '0.5rem 0.875rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: activeSection === link.href.slice(1)
                    ? 'var(--accent-blue)'
                    : 'var(--text-secondary)',
                  textDecoration: 'none',
                  borderRadius: '100px',
                  transition: 'color 0.2s, background 0.2s',
                  background: activeSection === link.href.slice(1)
                    ? 'rgba(99,102,241,0.08)'
                    : 'transparent',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (activeSection !== link.href.slice(1)) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (activeSection !== link.href.slice(1)) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Admin Login */}
            <motion.a
              href="/admin/login"
              aria-label="Admin Login"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              <User size={16} />
            </motion.a>

            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>

            {/* CTA */}
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNav('#contact'); }}
              className="btn-primary hidden-mobile"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Hire Me
            </motion.a>

            {/* Hamburger */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                background: menuOpen ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="hamburger-btn"
            >
              <AnimatePresence mode="wait">
                {menuOpen
                  ? <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}><X size={18} /></motion.span>
                  : <motion.span key="m" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}><Menu size={18} /></motion.span>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '70px',
              left: '1rem',
              right: '1rem',
              background: 'rgba(8, 11, 20, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid var(--border-glass)',
              borderRadius: '20px',
              padding: '1.25rem',
              zIndex: 999,
            }}
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                  style={{
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: activeSection === link.href.slice(1)
                      ? 'var(--accent-blue)'
                      : 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    background: activeSection === link.href.slice(1)
                      ? 'rgba(99,102,241,0.1)'
                      : 'transparent',
                    transition: 'background 0.2s, color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {link.label}
                  {activeSection === link.href.slice(1) && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
                  )}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
