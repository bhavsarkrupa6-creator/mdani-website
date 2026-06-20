import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions: Record<string, number> = {};

const ScrollToTop: React.FC = () => {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const prevPathname = useRef<string>('');

  useEffect(() => {
    // Save the scroll position of the page we're leaving
    if (prevPathname.current && prevPathname.current !== pathname) {
      scrollPositions[prevPathname.current] = window.scrollY;
    }

    if (navigationType === 'POP') {
      // Browser back/forward — restore previous scroll position
      const saved = scrollPositions[pathname];
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved ?? 0, behavior: 'instant' });
      });
    } else {
      // PUSH or REPLACE — fresh navigation, always scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    prevPathname.current = pathname;
  }, [pathname, key, navigationType]);

  return null;
};

export default ScrollToTop;