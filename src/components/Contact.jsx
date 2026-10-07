import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AtSign, Code, MessageCircle, Send, CheckCircle2, AlertCircle, Music2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { supabase } from '../lib/supabase';

const SOCIAL_LINKS = [
  { icon: Mail, label: 'Email', value: 'nascbert043@gmail.com', href: 'mailto:nascbert043@gmail.com', color: '#6366f1' },
  { icon: AtSign, label: 'Instagram', value: '@khoirul_4nas', href: 'https://instagram.com/khoirul_4nas', color: '#ec4899' },
  { icon: Music2, label: 'TikTok', value: '@khirlans_', href: 'https://tiktok.com/@khirlans_', color: '#00f2ea' },
  { icon: Code, label: 'GitHub', value: 'khirlans123', href: 'https://github.com/khirlans123', color: '#a855f7' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+62 857-3887-9805', href: 'https://wa.me/6285738879805', color: '#22c55e' },
];

function ContactLink({ item }) {
  const Icon = item.icon;
  return (
    <motion.a
      href={item.href}
      aria-label={`${item.label}: ${item.value}`}
      whileHover={{ x: 6 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.875rem 1rem',
        borderRadius: '14px',
        border: '1px solid var(--border-glass)',
        background: 'var(--bg-card)',
        textDecoration: 'none',
        transition: 'border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = item.color + '50';
        e.currentTarget.style.background = item.color + '08';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-glass)';
        e.currentTarget.style.background = 'var(--bg-card)';
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `${item.color}15`,
        border: `1px solid ${item.color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} style={{ color: item.color }} aria-hidden="true" />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>{item.label}</div>
        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.value}</div>
      </div>
    </motion.a>
  );
}

export default function Contact() {
  const { ref, isInView } = useScrollAnimation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('https://formspree.io/f/xnpneeek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (res.ok) {
        // Simpan juga ke Supabase
        await supabase.from('messages').insert({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        });
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: `1px solid ${errors[field] ? 'rgba(239,68,68,0.5)' : 'var(--border-glass)'}`,
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: field === 'message' ? 'vertical' : 'none',
  });

  return (
    <section id="contact" className="section-padding" aria-label="Contact">
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
            Contact
          </span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginTop: '1rem',
            marginBottom: '1rem',
          }}>
            Let's create something{' '}
            <span className="gradient-text">great together.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Siap untuk memulai project bersama? Hubungi saya dan mari kita diskusikan visi kamu.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '1.25rem',
                marginBottom: '0.5rem',
              }}>
                Get In Touch
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Saya biasanya merespons dalam 24 jam. Jangan ragu untuk menghubungi melalui channel manapun.
              </p>
            </div>
            {SOCIAL_LINKS.map(item => <ContactLink key={item.label} item={item} />)}
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card"
            style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    padding: '3rem 1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'rgba(34,197,94,0.15)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle2 size={36} style={{ color: '#22c55e' }} aria-hidden="true" />
                  </motion.div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.25rem' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Terima kasih! Saya akan menghubungi kamu secepatnya.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                    Send a Message
                  </h3>

                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                      Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                      style={inputStyle('name')}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
                      onBlur={e => e.target.style.borderColor = errors.name ? 'rgba(239,68,68,0.5)' : 'var(--border-glass)'}
                    />
                    {errors.name && <p role="alert" style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12} />{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      autoComplete="email"
                      style={inputStyle('email')}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
                      onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.5)' : 'var(--border-glass)'}
                    />
                    {errors.email && <p role="alert" style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12} />{errors.email}</p>}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="contact-subject" style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                      Subject *
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Project inquiry..."
                      style={inputStyle('subject')}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
                      onBlur={e => e.target.style.borderColor = errors.subject ? 'rgba(239,68,68,0.5)' : 'var(--border-glass)'}
                    />
                    {errors.subject && <p role="alert" style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12} />{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      style={{ ...inputStyle('message'), resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
                      onBlur={e => e.target.style.borderColor = errors.message ? 'rgba(239,68,68,0.5)' : 'var(--border-glass)'}
                    />
                    {errors.message && <p role="alert" style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12} />{errors.message}</p>}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary"
                    whileHover={status !== 'loading' ? { scale: 1.02, y: -2 } : {}}
                    whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: '0.5rem',
                      opacity: status === 'loading' ? 0.7 : 1,
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {status === 'loading' ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
                          aria-hidden="true"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} aria-hidden="true" />
                        Send Message
                      </>
                    )}
                  </motion.button>

                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      style={{ color: '#ef4444', fontSize: '0.825rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.5rem' }}
                    >
                      <AlertCircle size={14} />
                      Gagal mengirim pesan. Coba lagi.
                    </motion.p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
