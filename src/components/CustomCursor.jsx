import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const updatePos = useCallback((e) => {
    setPos({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    window.addEventListener('mousemove', updatePos);
    window.addEventListener('mouseleave', () => setIsVisible(false));
    window.addEventListener('mouseenter', () => setIsVisible(true));

    const handleHover = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);

    const interactables = document.querySelectorAll('a, button, [data-cursor]');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', updatePos);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, [updatePos]);

  // Delayed ring follows with spring
  useEffect(() => {
    let raf;
    let currentX = ring.x;
    let currentY = ring.y;
    const ease = 0.12;

    const animate = () => {
      currentX += (pos.x - currentX) * ease;
      currentY += (pos.y - currentY) * ease;
      setRing({ x: currentX, y: currentY });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos]);

  if (!isVisible) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="cursor-dot"
        style={{
          left: pos.x,
          top: pos.y,
          width: isHovering ? '14px' : '8px',
          height: isHovering ? '14px' : '8px',
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovering ? 'var(--accent-cyan)' : 'var(--accent-blue)',
        }}
        aria-hidden="true"
      />
      {/* Ring */}
      <motion.div
        className="cursor-ring"
        style={{
          left: ring.x,
          top: ring.y,
          width: isHovering ? '54px' : '36px',
          height: isHovering ? '54px' : '36px',
          borderColor: isHovering ? 'rgba(34,211,238,0.5)' : 'rgba(99,102,241,0.5)',
          opacity: isVisible ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </>
  );
}
