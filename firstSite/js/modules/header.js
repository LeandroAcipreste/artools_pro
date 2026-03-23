export const initHeader = () => {
  const header = document.getElementById("navbar");
  const heroContainer = document.querySelector(".hero-scrub-container");

  if (header && heroContainer) {
    gsap.to(header, {
      backdropFilter: "blur(20px)",
      scrollTrigger: {
        trigger: heroContainer,
        start: "top top",
        end: "50% top",
        scrub: 1.2
      }
    });
  }
};
