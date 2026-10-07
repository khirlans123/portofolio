import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 600);
          }, 200);
          return 100;
        }
        return p + Math.random() * 18 + 4;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-primary)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '2.5rem',
              fontWeight: 800,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              marginBottom: '0.25rem',
            }}>
              KA
            </div>
            <div style={{
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}>
              Portfolio
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              width: '200px',
              height: '2px',
              background: 'var(--border-glass)',
              borderRadius: '1px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'var(--gradient-primary)',
                borderRadius: '1px',
                transformOrigin: 'left',
                scaleX: progress / 100,
              }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          {/* Percentage */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
