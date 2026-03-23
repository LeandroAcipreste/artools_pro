import { scrollManager } from './core/scroll.js';
import { initPreloader } from './modules/preloader.js';
import { initHero } from './modules/hero.js';
import { initHeader } from './modules/header.js';
import { initNavigation } from './modules/navigation.js';
import { initVisualGrid } from './modules/visual-grid.js';
import { initBentoCards } from './modules/bento-cards.js';
import { initSphereCard } from './modules/sphere-card.js';
import { initSphere3D } from './modules/sphere-3d.js';
import { initCheckout } from './modules/checkout.js';
import { initNeonFooter } from './modules/neon-footer.js';
import { initBackToTop } from './modules/back-to-top.js';

function bootstrap() {
  // 1. Validação de bibliotecas externas
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof Lenis === "undefined") {
    console.error("GSAP, ScrollTrigger ou Lenis não carregados corretamente. Verifique importação (CDN).");
    return;
  }

  // Comportamentos Globais
  window.onbeforeunload = () => window.scrollTo(0, 0);
  if (history.scrollRestoration) history.scrollRestoration = 'manual';

  gsap.registerPlugin(ScrollTrigger);

  // 2. Inicialização Essencial do Scroll (Lenis)
  scrollManager.init();
  
  // 3. Inicialização de Módulos Independentes Menores
  initHeader();
  initNavigation();
  initVisualGrid();
  initBentoCards();
  initSphereCard();
  initNeonFooter();
  initBackToTop();
  
  // 4. Módulos Complexos e Componentes
  initSphere3D();
  initCheckout();

  // 5. Hero Timeline Configuration
  const heroModule = initHero();

  // 6. Preloader (Sempre por último, inicia Timeline do Hero ao fim)
  initPreloader(() => {
    if (heroModule && heroModule.playIntro) {
      heroModule.playIntro(); // Trigger texto de introdução
    }
  });

  // Garante reflow adequado da altura virtual
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
