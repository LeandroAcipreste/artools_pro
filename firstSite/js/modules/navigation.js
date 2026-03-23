import { scrollManager } from '../core/scroll.js';

export const initNavigation = () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target && scrollManager.lenis) {
        scrollManager.scrollTo(target, { 
          duration: 2.5, 
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
        });
      }
    });
  });
};
