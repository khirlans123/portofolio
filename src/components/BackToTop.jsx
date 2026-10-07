import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollTop}
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9990,
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          }}
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
