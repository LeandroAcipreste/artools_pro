export const initNeonFooter = () => {
  const neonGroup = document.getElementById('neon-lines');
  const footer = document.querySelector('footer');

  if (!neonGroup || !footer) return;

  const colors = [
    'rgba(0, 255, 255, 0.9)',   // Cyan
    'rgba(255, 0, 255, 0.9)',   // Magenta
    'rgba(255, 255, 255, 1)',   // White
    'rgba(100, 200, 255, 0.9)', // Light Blue
    'rgba(200, 100, 255, 0.9)'  // Purple
  ];

  const numLines = 200;

  for (let i = 0; i < numLines; i++) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    const startX = -300 - Math.random() * 300;
    const startY = Math.random() * 800;
    const endX = 1100 + Math.random() * 400;
    const endY = Math.random() * 800;

    const cp1X = 200 + Math.random() * 200;
    const cp1Y = startY + (Math.random() - 0.5) * 800;

    const cp2X = 600 + Math.random() * 200;
    const cp2Y = endY + (Math.random() - 0.5) * 800;

    const d = `M${startX},${startY} C${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;

    path.setAttribute("d", d);
    path.setAttribute("stroke", colors[Math.floor(Math.random() * colors.length)]);
    path.setAttribute("class", "neon-line");
    path.style.strokeWidth = 0.5 + Math.random() * 2.5;

    neonGroup.appendChild(path);
  }

  const neonLines = neonGroup.querySelectorAll('.neon-line');

  neonLines.forEach((line) => {
    let length = 1500;
    try {
      length = line.getTotalLength();
    } catch (e) { }

    const dashLength = 50 + Math.random() * 250;

    gsap.set(line, {
      strokeDasharray: `${dashLength} ${length}`,
      strokeDashoffset: length,
      opacity: 0
    });

    const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 6 });
    const duration = 2.5 + Math.random() * 4;

    tl.to(line, { opacity: 0.6 + Math.random() * 0.4, duration: 0.4, ease: "power1.inOut" })
      .to(line, { strokeDashoffset: -dashLength, duration: duration, ease: "power2.inOut" }, "<")
      .to(line, { opacity: 0, duration: 0.4, ease: "power1.inOut" }, "-=0.4");
  });

  footer.addEventListener('mousemove', (e) => {
    const rect = footer.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(neonLines, {
      x: x * 80,
      y: y * 80,
      stagger: { amount: 0.6, from: "random" },
      duration: 1,
      ease: "power2.out"
    });

    const wavePaths = footer.querySelectorAll('.wave-path');
    if (wavePaths.length) {
      gsap.to(wavePaths, { x: x * -25, y: y * -25, stagger: 0.03, duration: 1.2, ease: "power2.out" });
    }
  });

  footer.addEventListener('mouseleave', () => {
    gsap.to(neonLines, { x: 0, y: 0, duration: 2, ease: "power2.out" });
    const wavePaths = footer.querySelectorAll('.wave-path');
    if (wavePaths.length) {
      gsap.to(wavePaths, { x: 0, y: 0, duration: 2, ease: "power2.out" });
    }
  });
};
