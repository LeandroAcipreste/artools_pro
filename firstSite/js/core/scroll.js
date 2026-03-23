// Wrapper Singleton para o Lenis Scroll

let lenisInstance = null;

export const scrollManager = {
  get lenis() { 
    return lenisInstance; 
  },
  
  init() {
    if (lenisInstance) return; // evita dupla inicialização
    
    // Supondo que o Lenis já esteja carregado globalmente no HTML
    lenisInstance = new Lenis({
      duration: 3.2,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    lenisInstance.on("scroll", ScrollTrigger.update);
  },
  
  stop() { 
    if (lenisInstance) lenisInstance.stop(); 
  },
  
  start() { 
    if (lenisInstance) lenisInstance.start(); 
  },
  
  scrollTo(target, options) { 
    if (lenisInstance) lenisInstance.scrollTo(target, options); 
  }
};
