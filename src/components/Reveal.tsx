'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Marks [data-reveal] elements as shown when they scroll into view. CSS skips the effect under reduced motion. */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="shown"])');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => (el.dataset.reveal = 'shown'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.reveal = 'shown';
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
