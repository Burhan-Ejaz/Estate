import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls back to the top whenever the route changes, so a new page
// never opens half-way down. The admin and agent layouts scroll inside
// their own panel, so those are reset as well.
const SCROLL_PANELS = [".right-side", ".agent-rightside"];

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    SCROLL_PANELS.forEach((selector) => {
      const panel = document.querySelector(selector);
      if (panel) panel.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

