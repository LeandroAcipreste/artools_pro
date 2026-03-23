export const initHero = () => {
  const heroRevealItems = document.querySelectorAll(".reveal-up");
  const heroContainer = document.querySelector(".hero-scrub-container");
  const canvas = document.getElementById("hero-canvas");
  const context = canvas ? canvas.getContext("2d") : null;
  const scrollHint = document.querySelector(".hero-scroll-hint");

  // -------- TIMELINE DE INTRO --------
  if (heroRevealItems.length) {
    gsap.set(heroRevealItems, { opacity: 0, y: 40, filter: "blur(10px)" });
  }

  const playIntro = () => {
    if (!heroRevealItems.length) return;
    const introTl = gsap.timeline();
    introTl.to(heroRevealItems, {
      y: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      duration: 1.5,
      stagger: 0.1,
      ease: "expo.out",
      onComplete: () => {
        gsap.set(heroRevealItems, { clearProps: "filter" });
      }
    });
  };

  // -------- SCROLL EXIT --------
  if (heroContainer && heroRevealItems.length) {
    gsap.to(heroRevealItems, {
      y: -100,
      autoAlpha: 0,
      filter: "blur(10px)",
      stagger: 0.05,
      ease: "none",
      scrollTrigger: {
        trigger: heroContainer,
        start: "10% top",
        end: "40% top",
        scrub: 1.5,
        invalidateOnRefresh: true,
      }
    });
  }

  if (scrollHint && heroContainer) {
    gsap.set(scrollHint, { autoAlpha: 0, y: 20 });
    gsap.to(scrollHint, { autoAlpha: 0.6, y: 0, duration: 1, delay: 1 });
    gsap.to(scrollHint, {
      autoAlpha: 0,
      y: 30,
      scrollTrigger: {
        trigger: heroContainer,
        start: "top top",
        end: "15% top",
        scrub: 1.5
      }
    });
  }

  // -------- CANVAS SCRUBBING --------
  if (canvas && context && heroContainer) {
    const frameCount = 192;
    const currentFrame = { index: 0 };
    const images = [];

    const getFrameSrc = (i) => {
      const frameNumber = i.toString().padStart(4, "0");
      return `../video_frames/frame_${frameNumber}.jpg`;
    };

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderCanvas();
    };

    const drawImageCover = (img) => {
      const cw = canvas.width / (window.devicePixelRatio || 1);
      const ch = canvas.height / (window.devicePixelRatio || 1);
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      context.clearRect(0, 0, cw, ch);
      context.drawImage(img, dx, dy, dw, dh);
    };

    const renderCanvas = () => {
      const frameIndex = Math.min(frameCount - 1, Math.floor(currentFrame.index));
      const img = images[frameIndex];
      if (img && img.complete) drawImageCover(img);
    };

    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
        images.push(img);
      }
      if (images[0]) {
        images[0].onload = () => {
          setCanvasSize();
          ScrollTrigger.refresh();
        };
      }
    };

    preloadImages();

    gsap.to(currentFrame, {
      index: frameCount - 1,
      ease: "none",
      scrollTrigger: {
        trigger: heroContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: renderCanvas
      }
    });

    window.addEventListener("resize", () => {
      setCanvasSize();
      ScrollTrigger.refresh();
    });
  }

  // Retorna a função que inicia a intro para ser chamada pelo Preloader
  return { playIntro };
};
