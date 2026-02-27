import { useEffect } from "react";

/**
 * Observes all elements with `data-reveal` attribute and adds
 * a `revealed` class when they scroll into view, triggering CSS animations.
 */
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.15 },
    );

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

export default useScrollReveal;
