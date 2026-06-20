import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions: Record<string, number> = {};

const ScrollToTop: React.FC = () => {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const currentPathname = useRef(pathname);

  // Continuously track scroll position for the CURRENT path,
  // so it's always up to date whenever the user navigates away.
  useEffect(() => {
    currentPathname.current = pathname;

    const handleScroll = () => {
      scrollPositions[currentPathname.current] = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (navigationType === 'POP') {
      const saved = scrollPositions[pathname];
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved ?? 0, behavior: 'instant' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, key, navigationType]);

  return null;
};

export default ScrollToTop;