import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    // margin kecil agar trigger lebih awal — penting di mobile
    margin: '0px 0px -50px 0px',
    amount: threshold,
  });
  return { ref, isInView };
}
