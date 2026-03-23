import { scrollManager } from '../core/scroll.js';

export const initPreloader = (onCompleteCallback) => {
  const preloader = document.getElementById('preloader');
  const loadingBar = document.getElementById('loading-bar');
  const loadingPct = document.getElementById('loading-pct');
  const preloaderVideo = document.getElementById('preloader-video');

  if (!preloader) {
    if (onCompleteCallback) onCompleteCallback();
    return;
  }

  // Interrompe scroll durante carregamento
  scrollManager.stop();
  document.body.style.overflow = 'hidden';

  if (preloaderVideo) {
    preloaderVideo.play().catch(() => {});
  }

  // Animação fake de loading
  let progressObj = { value: 0 };
  
  gsap.to(progressObj, {
    value: 100,
    duration: 3, 
    ease: "power2.inOut",
    onUpdate: () => {
      let MathPct = Math.floor(progressObj.value);
      if (loadingBar) loadingBar.style.width = MathPct + "%";
      if (loadingPct) loadingPct.textContent = MathPct + "%";
    },
    onComplete: () => {
      // Ocultar preloader e destravar rolagem
      gsap.to(preloader, {
        yPercent: -100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.inOut",
        onComplete: () => {
          preloader.style.display = "none";
          document.body.style.overflow = '';
          scrollManager.start();
          
          if (onCompleteCallback) onCompleteCallback();
        }
      });
    }
  });
};
