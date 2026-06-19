import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const scrollPositions: Record<string, number> = {};

const ScrollToTop: React.FC = () => {
  const { pathname, key } = useLocation();
  const prevPathname = useRef<string>('');

  useEffect(() => {
    // Save the scroll position of the page we're leaving
    if (prevPathname.current && prevPathname.current !== pathname) {
      scrollPositions[prevPathname.current] = window.scrollY;
    }

    // If we have a saved position for this page, restore it (going back)
    // Otherwise scroll to top (navigating forward to a new page)
    const saved = scrollPositions[pathname];
    if (saved !== undefined) {
      // Small delay to let the page render before restoring
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved, behavior: 'instant' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    prevPathname.current = pathname;
  }, [pathname, key]);

  return null;
};

export default ScrollToTop;