export const initBentoCards = () => {
  const bentoCards = gsap.utils.toArray(".bento-card");

  if (!bentoCards.length) return;

  bentoCards.forEach((card) => {
    // Estado inicial de cada card
    gsap.set(card, { opacity: 0, y: 80, scale: 0.95, filter: "blur(10px)" });

    // Animação individual acionada pelo scroll do próprio card
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%", // Aparece quando o topo do card atinge 85% da tela
        end: "bottom 15%", // Some quando o final do card passa de 15% do topo
        toggleActions: "play reverse play reverse",
        // invalidateOnRefresh: true,
      }
    });
  });

  gsap.to(".bento-pen-anim", {
    y: "-=15px",
    rotation: "-=2",
    ease: "sine.inOut",
    duration: 4,
    repeat: -1,
    yoyo: true
  });
};
