import { useState, useEffect, useCallback } from 'react';
import type { ActiveSection } from '@/types';

export function useActiveSection(): [ActiveSection, (section: ActiveSection) => void] {
  const [activeSection, setActiveSection] = useState<ActiveSection>('hero');

  const navigateTo = useCallback((section: ActiveSection) => {
    setActiveSection(section);
    const el = document.getElementById(`section-${section}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const sections: ActiveSection[] = ['hero', 'insights', 'gallery', 'archive', 'connections', 'stories', 'journey'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('section-', '') as ActiveSection;
            if (sections.includes(id)) {
              setActiveSection(id);
            }
          }
        }
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    for (const section of sections) {
      const el = document.getElementById(`section-${section}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return [activeSection, navigateTo];
}
