export const initSphereCard = () => {
  const sphereCard = document.getElementById('sphere-card');
  if (!sphereCard) return;

  // 1. Entrance and Exit Animation
  gsap.fromTo(sphereCard,
    {
      opacity: 0,
      y: 150,
      scale: 0.9,
      rotationX: 15,
      transformOrigin: "bottom center"
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: "#sphere-section",
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play reverse play reverse",
        invalidateOnRefresh: true,
      }
    }
  );

  // 2. 3D Mouse Tilt Effect
  sphereCard.addEventListener("mousemove", (e) => {
    const rect = sphereCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    gsap.to(sphereCard, {
      rotationX: rotateX,
      rotationY: rotateY,
      transformPerspective: 1200,
      ease: "power2.out",
      duration: 0.4
    });
  });

  sphereCard.addEventListener("mouseleave", () => {
    gsap.to(sphereCard, {
      rotationX: 0,
      rotationY: 0,
      ease: "power3.out",
      duration: 0.8
    });
  });
};
