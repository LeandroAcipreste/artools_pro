import { scrollManager } from '../core/scroll.js';

export const initBackToTop = () => {
  const backToTopBtn = document.getElementById("back-to-top");
  
  if (!backToTopBtn) return;

  gsap.to(backToTopBtn, {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    duration: 0.5,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: "body",
      start: "500px top",
      toggleActions: "play none none reverse",
    }
  });

  backToTopBtn.addEventListener("click", () => {
    if (scrollManager.lenis) {
      scrollManager.scrollTo(0, { 
        duration: 2, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    }
  });
};
