document.addEventListener("DOMContentLoaded", () => {
  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined" ||
    typeof Lenis === "undefined"
  ) {
    console.error("GSAP, ScrollTrigger ou Lenis não foram carregados.");
    return;
  }

  // Force scroll to top on reload
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }

  gsap.registerPlugin(ScrollTrigger);

  // =========================================================
  // 1) LENIS
  // =========================================================
  const lenis = new Lenis({
    duration: 3.2,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  lenis.on("scroll", ScrollTrigger.update);

  // Parar o scroll durante o preloader
  lenis.stop();
  document.body.style.overflow = 'hidden';

  // Custom Anchor Links Smooth Scrolling
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { duration: 2.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      }
    });
  });

  // =========================================================
  // 2) ELEMENTOS
  // =========================================================
  const canvas = document.getElementById("hero-canvas");
  const context = canvas ? canvas.getContext("2d") : null;
  const heroContainer = document.querySelector(".hero-scrub-container");
  const heroContent = document.getElementById("hero-content");
  const heroRevealItems = heroContent ? heroContent.querySelectorAll(".reveal-up") : [];
  const header = document.getElementById("navbar");
  const scrollHint = document.querySelector(".hero-scroll-hint");
  const snakeSection = document.getElementById("snake-section");
  const snakeContainer = document.getElementById("snakes-container");
  const bentoTitle = document.getElementById("bento-title");
  const bentoCards = gsap.utils.toArray(".bento-card");

  // =========================================================
  // 3) ESTADOS INICIAIS
  // =========================================================
  let introTl;
  if (heroRevealItems.length) {
    gsap.set(heroRevealItems, { opacity: 0, y: 40, filter: "blur(10px)" });
  }

  // =========================================================
  // 4) ENTRADA E SAÍDA DO HERO (TIMELINE UNIFICADA)
  // =========================================================
  if (heroRevealItems.length) {
    // 1. Intro Animation (Pageload)
    introTl = gsap.timeline({ paused: true });

    introTl.to(heroRevealItems, {
      y: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      duration: 1.5,
      stagger: 0.1,
      ease: "expo.out",
      onComplete: () => {
        // Clear properties so ScrollTrigger has a clean slate
        gsap.set(heroRevealItems, { clearProps: "filter" });
      }
    });

    // 2. Scroll Exit Animation (Scrub)
    if (heroContainer) {
      gsap.to(heroRevealItems, {
        y: -100,
        autoAlpha: 0,
        filter: "blur(10px)",
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: heroContainer,
          start: "10% top", // Só começa a sumir após 10% do scroll
          end: "40% top",
          scrub: 1.5,
          invalidateOnRefresh: true,
        }
      });
    }
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

  // =========================================================
  // 6) HEADER REACTIVO
  // =========================================================
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

  // =========================================================
  // 7) CANVAS HERO SCRUB
  // =========================================================
  if (canvas && context && heroContainer) {
    const frameCount = 192;
    const currentFrame = { index: 0 };
    const images = [];
    let firstFrameLoaded = false;

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
          firstFrameLoaded = true;
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
  } else if (!canvas) {
    console.warn("Canvas do hero não encontrado.");
  }

  // =========================================================
  // 8) SNAKE GRID
  // =========================================================
  if (snakeContainer) {
    const gridSize = 80;
    const numRows = 25;
    const numCols = 40;
    const totalHorizontalSnakes = 70;
    const totalVerticalSnakes = 90;

    for (let i = 0; i < totalHorizontalSnakes; i++) {
      const randomRow = Math.floor(Math.random() * numRows);
      const topPos = randomRow * gridSize;
      const snake = document.createElement("div");
      const duration = 12 + Math.random() * 12;
      const delay = -(Math.random() * 20);
      const isRev = Math.random() > 0.5;
      const cellsLength = 2 + Math.floor(Math.random() * 3);
      snake.className = `snake h-snake ${isRev ? "rev" : ""}`;
      snake.style.top = `${topPos}px`;
      snake.style.width = `${cellsLength * gridSize}px`;
      snake.style.animationDuration = `${duration}s`;
      snake.style.animationDelay = `${delay}s`;
      if (isRev) snake.style.animationDirection = "reverse";
      snakeContainer.appendChild(snake);
    }

    for (let j = 0; j < totalVerticalSnakes; j++) {
      const randomCol = Math.floor(Math.random() * numCols);
      const leftPos = randomCol * gridSize;
      const snake = document.createElement("div");
      const duration = 14 + Math.random() * 12;
      const delay = -(Math.random() * 20);
      const isRev = Math.random() > 0.5;
      const cellsLength = 2 + Math.floor(Math.random() * 4);
      snake.className = `snake v-snake ${isRev ? "rev" : ""}`;
      snake.style.left = `${leftPos}px`;
      snake.style.height = `${cellsLength * gridSize}px`;
      snake.style.animationDuration = `${duration}s`;
      snake.style.animationDelay = `${delay}s`;
      if (isRev) snake.style.animationDirection = "reverse";
      snakeContainer.appendChild(snake);
    }
  }

  // =========================================================
  // 9) BENTO ANIMATIONS
  // =========================================================
  // (Title is now a .bento-card and handled below)

  // Cards Animation
  if (bentoCards.length) {
    gsap.set(bentoCards, { opacity: 0, y: 80, scale: 0.95, filter: "blur(10px)" });

    gsap.to(bentoCards, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#snake-section",
        start: "top 50%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse",
        invalidateOnRefresh: true,
      }
    });

    gsap.to(".bento-pen-anim", {
      y: "-=15px",
      rotation: "-=2",
      ease: "sine.inOut",
      duration: 4,
      repeat: -1,
      yoyo: true
    });
  }




  // =========================================================
  // 12) INTERACTIVE ROTATING SPHERE (4th Fold)
  // =========================================================
  const container = document.getElementById('canvas-container');
  if (container) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xF5F5F7, 0.04);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 20);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    const geometry = new THREE.IcosahedronGeometry(7, 40);
    const uniforms = {
      uTime: { value: 0 },
      uDistortion: { value: 0.15 },
      uSize: { value: 1.6 },
      uColor: { value: new THREE.Color('#111111') },
      uMouse: { value: new THREE.Vector2(0, 0) }
    };

    const vertexShaderEl = document.getElementById('vertexShader');
    const fragmentShaderEl = document.getElementById('fragmentShader');

    if (vertexShaderEl && fragmentShaderEl) {
      const material = new THREE.ShaderMaterial({
        vertexShader: vertexShaderEl.textContent,
        fragmentShader: fragmentShaderEl.textContent,
        uniforms: uniforms,
        transparent: true,
        blending: THREE.NormalBlending
      });
      const points = new THREE.Points(geometry, material);
      objectGroup.add(points);

      let time = 0;
      let mouseX = 0, mouseY = 0;
      let basePosX = 0, basePosY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        uniforms.uMouse.value.x += (mouseX - uniforms.uMouse.value.x) * 0.03;
        uniforms.uMouse.value.y += (mouseY - uniforms.uMouse.value.y) * 0.03;
      });

      function adjustLayout() {
        const w = window.innerWidth;
        if (w < 1024) {
          basePosX = 0;
          basePosY = 2;
          objectGroup.position.set(basePosX, basePosY, -10);
          objectGroup.scale.set(0.6, 0.6, 0.6);
        } else {
          basePosX = -6;
          basePosY = 0;
          objectGroup.position.set(basePosX, basePosY, 0);
          objectGroup.scale.set(0.8, 0.8, 0.8);
        }
      }

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        adjustLayout();
      });

      adjustLayout();

      function animate() {
        requestAnimationFrame(animate);
        time += 0.005;

        // Calculate target rotation and position based on mouse
        const targetRotX = mouseY * 0.6;
        const targetRotY = (time * 0.1) + (mouseX * 0.6);
        const targetPosX = basePosX + (mouseX * 2);
        const targetPosY = basePosY + (mouseY * 2);

        // Smoothly interpolate current values to targets
        objectGroup.rotation.x += (targetRotX - objectGroup.rotation.x) * 0.05;
        objectGroup.rotation.y += (targetRotY - objectGroup.rotation.y) * 0.05;
        objectGroup.position.x += (targetPosX - objectGroup.position.x) * 0.05;
        objectGroup.position.y += (targetPosY - objectGroup.position.y) * 0.05;

        uniforms.uTime.value = time;
        renderer.render(scene, camera);
      }
      animate();
    }
  }

  // =========================================================
  // 12.5) SPHERE CARD ANIMATION & 3D TILT
  // =========================================================
  const sphereCard = document.getElementById('sphere-card');
  if (sphereCard) {
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

      // Calculate max rotation of 12 degrees
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
  }

  // =========================================================
  // 13) CART COUNTER & CHECKOUT MODAL LOGIC
  // =========================================================
  const cartCounter = document.getElementById('cart-counter');
  const buyNowBtn = document.getElementById('buy-now-btn');
  const cartIconBtn = document.getElementById('cart-icon-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutOverlay = document.getElementById('checkout-overlay');
  const checkoutPanel = document.getElementById('checkout-panel');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const checkoutTotal = document.getElementById('checkout-total');

  const checkoutFormState = document.getElementById('checkout-form-state');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutSuccessState = document.getElementById('checkout-success-state');
  const successOkBtn = document.getElementById('success-ok-btn');
  const checkoutBody = document.getElementById('checkout-body');

  // Input fields for masks & API
  const cpfInput = document.getElementById('cpf-input');
  const telInput = document.getElementById('tel-input');
  const cepInput = document.getElementById('cep-input');
  const ruaInput = document.getElementById('rua-input');
  const cidadeInput = document.getElementById('cidade-input');
  const estadoInput = document.getElementById('estado-input');
  const cartaoInput = document.getElementById('cartao-input');
  const validadeInput = document.getElementById('validade-input');
  const cvvInput = document.getElementById('cvv-input');

  // Input Masks
  if (cpfInput) {
    cpfInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = v;
    });
  }

  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      v = v.replace(/(\d)(\d{4})$/, '$1-$2');
      e.target.value = v;
    });
  }

  if (cartaoInput) {
    cartaoInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 16) v = v.slice(0, 16);
      v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = v;
    });
  }

  if (validadeInput) {
    validadeInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 4) v = v.slice(0, 4);
      v = v.replace(/^(\d{2})(\d)/, '$1/$2');
      e.target.value = v;
    });
  }

  if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 3) v = v.slice(0, 3);
      e.target.value = v;
    });
  }

  // ViaCEP Integration
  if (cepInput) {
    cepInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 8) v = v.slice(0, 8);
      e.target.value = v.replace(/^(\d{5})(\d)/, '$1-$2');

      if (v.length === 8) {
        fetch(`https://viacep.com.br/ws/${v}/json/`)
          .then(res => res.json())
          .then(data => {
            if (!data.erro) {
              if (ruaInput) ruaInput.value = data.logradouro;
              if (cidadeInput) cidadeInput.value = data.localidade;
              if (estadoInput) estadoInput.value = data.uf;
            }
          })
          .catch(err => console.error('Erro ao buscar CEP:', err));
      }
    });
  }

  let currentCount = 0;
  const unitPrice = 299;

  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const checkoutQty = document.getElementById('checkout-qty');

  function updateTotal() {
    if (currentCount > 0) {
      checkoutTotal.textContent = `R$ ${currentCount * unitPrice},00`;
    } else {
      checkoutTotal.textContent = `R$ 0,00`;
    }

    if (checkoutQty) checkoutQty.textContent = currentCount;

    cartCounter.textContent = currentCount;
    if (currentCount > 0) {
      cartCounter.classList.remove('opacity-0');
      cartCounter.classList.add('opacity-100');
    } else {
      cartCounter.classList.add('opacity-0');
      cartCounter.classList.remove('opacity-100');
    }
  }

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      if (currentCount > 0) {
        currentCount--;
        updateTotal();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      currentCount++;
      updateTotal();
    });
  }

  function openModal() {
    updateTotal();

    checkoutModal.classList.remove('hidden');

    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('overflow-hidden');

    if (typeof lenis !== 'undefined') {
      lenis.stop();
    }

    requestAnimationFrame(() => {
      checkoutOverlay.classList.remove('opacity-0');
      checkoutPanel.classList.remove('translate-x-full');
    });
  }

  function closeModal() {
    checkoutOverlay.classList.add('opacity-0');
    checkoutPanel.classList.add('translate-x-full');

    setTimeout(() => {
      checkoutModal.classList.add('hidden');

      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');

      if (typeof lenis !== 'undefined') {
        lenis.start();
      }
    }, 500);
  }

  if (buyNowBtn && cartCounter) {
    buyNowBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentCount++;

      updateTotal();

      gsap.fromTo(cartCounter,
        { scale: 0.9, y: 5 },
        { scale: 1, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
      );
    });
  }

  if (cartIconBtn) {
    cartIconBtn.addEventListener('click', () => {
      openModal();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (checkoutOverlay) {
    checkoutOverlay.addEventListener('click', closeModal);
  }

  // Handle Form Submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Hide form, show success message
      checkoutFormState.classList.add('opacity-0', 'pointer-events-none');
      checkoutSuccessState.classList.remove('opacity-0', 'pointer-events-none');

      // Scroll modal to top so the success message is visible
      if (checkoutBody) {
        checkoutBody.scrollTop = 0;
      }
    });
  }

  // Handle OK Button in Success State
  if (successOkBtn) {
    successOkBtn.addEventListener('click', () => {
      // Reset Cart
      currentCount = 0;
      cartCounter.textContent = '0';
      cartCounter.classList.remove('opacity-100');
      cartCounter.classList.add('opacity-0');

      // Close modal
      closeModal();

      // Reset Form States after modal closes
      setTimeout(() => {
        checkoutForm.reset();
        checkoutFormState.classList.remove('opacity-0', 'pointer-events-none');
        checkoutSuccessState.classList.add('opacity-0', 'pointer-events-none');
      }, 500);
    });
  }

  // =========================================================
  // 14) NEON WAVE ANIMATION (Footer)
  // =========================================================
  const neonGroup = document.getElementById('neon-lines');
  if (neonGroup) {
    const colors = [
      'rgba(0, 255, 255, 0.9)',   // Cyan
      'rgba(255, 0, 255, 0.9)',   // Magenta
      'rgba(255, 255, 255, 1)',   // White
      'rgba(100, 200, 255, 0.9)', // Light Blue
      'rgba(200, 100, 255, 0.9)'  // Purple
    ];

    const numLines = 200;

    // Criação dinâmica de 200 linhas de neon cruzando a tela
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

      // Espessuras variadas para efeito de profundidade
      path.style.strokeWidth = 0.5 + Math.random() * 2.5;

      neonGroup.appendChild(path);
    }

    const neonLines = neonGroup.querySelectorAll('.neon-line');

    neonLines.forEach((line) => {
      // Usando um fallback caso getTotalLength falhe antes do layout estar pronto
      let length = 1500;
      try {
        length = line.getTotalLength();
      } catch (e) { }

      // Tamanho do "cometa"
      const dashLength = 50 + Math.random() * 250;

      // Confguração inicial do dash longo o suficiente para sumir da linha
      gsap.set(line, {
        strokeDasharray: `${dashLength} ${length}`,
        strokeDashoffset: length,
        opacity: 0
      });

      // As 200 linhas tocam com delays aleatórios em looping
      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 6 });
      const duration = 2.5 + Math.random() * 4;

      // dashoffset animando do final (length) até o outro lado extremo (-dashLength)
      tl.to(line, { opacity: 0.6 + Math.random() * 0.4, duration: 0.4, ease: "power1.inOut" })
        .to(line, {
          strokeDashoffset: -dashLength,
          duration: duration,
          ease: "power2.inOut"
        }, "<")
        .to(line, { opacity: 0, duration: 0.4, ease: "power1.inOut" }, "-=0.4");
    });

    // Interatividade com o mouse no footer
    const footer = document.querySelector('footer');
    if (footer) {
      footer.addEventListener('mousemove', (e) => {
        const rect = footer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Move as 200 linhas com um stagger incrível e orgânico
        gsap.to(neonLines, {
          x: x * 80,
          y: y * 80,
          stagger: {
            amount: 0.6,
            from: "random"
          },
          duration: 1,
          ease: "power2.out"
        });

        const wavePaths = footer.querySelectorAll('.wave-path');
        if (wavePaths.length) {
          gsap.to(wavePaths, {
            x: x * -25,
            y: y * -25,
            stagger: 0.03,
            duration: 1.2,
            ease: "power2.out"
          });
        }
      });

      footer.addEventListener('mouseleave', () => {
        gsap.to(neonLines, {
          x: 0,
          y: 0,
          duration: 2,
          ease: "power2.out"
        });
        const wavePaths = footer.querySelectorAll('.wave-path');
        if (wavePaths.length) {
          gsap.to(wavePaths, {
            x: 0,
            y: 0,
            duration: 2,
            ease: "power2.out"
          });
        }
      });
    }
  }

  // =========================================================
  // 15) BACK TO TOP BUTTON
  // =========================================================
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    // Reveal button after scrolling 500px
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
      lenis.scrollTo(0, { duration: 2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    });
  }

  // Refresh ScrollTrigger at the end
  ScrollTrigger.refresh();

  // =========================================================
  // 16) PRELOADER LOGIC
  // =========================================================
  const preloader = document.getElementById('preloader');
  const loadingBar = document.getElementById('loading-bar');
  const loadingPct = document.getElementById('loading-pct');
  const preloaderVideo = document.getElementById('preloader-video');

  if (preloaderVideo) preloaderVideo.play().catch(()=>{});

  let progressObj = { value: 0 };
  
  gsap.to(progressObj, {
    value: 100,
    duration: 3, 
    ease: "power2.inOut",
    onUpdate: () => {
      let pct = Math.floor(progressObj.value);
      if (loadingBar) loadingBar.style.width = pct + "%";
      if (loadingPct) loadingPct.textContent = pct + "%";
    },
    onComplete: () => {
      gsap.to(preloader, {
        yPercent: -100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.inOut",
        onComplete: () => {
          preloader.style.display = "none";
          document.body.style.overflow = '';
          lenis.start();
          
          if (typeof introTl !== "undefined" && introTl) {
            introTl.play();
          }
        }
      });
    }
  });
});