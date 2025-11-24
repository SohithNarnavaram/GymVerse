import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls to the top of the page
 * whenever the route changes. This fixes the UX issue where
 * scroll position persists when navigating between pages.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Instant scroll for better UX on page navigation
    });

    // Also scroll the document element to top (for some browsers)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Scroll main content area if it exists
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

