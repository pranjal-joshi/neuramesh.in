(() => {
  // ==================== STATUS CARD ROTATOR (Crossfade) ====================
  const statusPhrases = [
    { label: "Motion", value: "Presence Detected", icon: "visibility" },
    { label: "Environment", value: "Smart Lighting On", icon: "lightbulb" },
    { label: "Climate Sync", value: "Climate Optimized", icon: "ac_unit" },
    { label: "Perimeter", value: "Security Armed", icon: "security" },
    { label: "Power Usage", value: "Energy Saving Mode", icon: "eco" },
    { label: "Atmosphere", value: "Home Theater Ready", icon: "movie" },
    { label: "Schedule", value: "Morning Routine Set", icon: "wb_sunny" },
    { label: "Sensors", value: "Air Quality: High", icon: "air" },
    { label: "Access", value: "Door Locked", icon: "lock" },
    { label: "Welcome", value: "Welcome Home", icon: "home" }
  ];

  let currentPhraseIndex = 0;
  let iterationCount = 0;
  const statusCard = document.getElementById("dynamic-status-card");
  const statusLabel = document.getElementById("status-label");
  const statusValue = document.getElementById("status-value");
  const statusIcon = document.getElementById("status-icon");
  const statusIconContainer = document.getElementById("status-icon-container");

  if (statusCard && statusLabel && statusValue && statusIconContainer) {
    statusCard.addEventListener("animationiteration", () => {
      iterationCount++;
      if (iterationCount % 2 === 0) {
        updateStatusCard();
      }
    });

    function updateStatusCard() {
      statusLabel.style.opacity = "0";
      statusValue.style.opacity = "0";
      statusIconContainer.style.transform = "scale(0.5) rotate(-45deg)";
      statusIconContainer.style.opacity = "0";

      setTimeout(() => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * statusPhrases.length);
        } while (nextIndex === currentPhraseIndex);

        currentPhraseIndex = nextIndex;
        const phrase = statusPhrases[currentPhraseIndex];

        statusLabel.textContent = phrase.label;
        statusValue.textContent = phrase.value;
        statusIcon.textContent = phrase.icon;

        statusLabel.style.opacity = "1";
        statusValue.style.opacity = "1";
        statusIconContainer.style.transform = "scale(1) rotate(0deg)";
        statusIconContainer.style.opacity = "1";
      }, 500);
    }
  }

  // ==================== SCROLL REVEAL (Multiple Observers) ====================
  const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        scrollObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);
  document.querySelectorAll(".scroll-reveal").forEach((el) => scrollObserver.observe(el));

  const revealUpObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible", "active", "reveal-visible");
        revealUpObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);
  document.querySelectorAll(".animate-reveal, .reveal-up").forEach((el) => revealUpObserver.observe(el));

  // ==================== PARTICLE SYSTEM (Density-Based) ====================
  const canvas = document.getElementById("particle-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    document.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
        this.color = "#4edea3";
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      update() {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;
            this.x -= directionX;
            this.y -= directionY;
          } else {
            if (this.x !== this.baseX) {
              const dx = this.x - this.baseX;
              this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
              const dy = this.y - this.baseY;
              this.y -= dy / 10;
            }
          }
        }
      }
    }

    function initParticles() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const densityDivider = window.innerWidth < 768 ? 20000 : 12000;
      const numberOfParticles = (canvas.width * canvas.height) / densityDivider;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            const opacityValue = 1 - distance / 120;
            ctx.strokeStyle = `rgba(78, 222, 163, ${opacityValue * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      connect();
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
    window.addEventListener("resize", initParticles);
  }

  // ==================== NAVBAR SCROLL HIDE / SHOW ====================
  let lastScrollY = window.scrollY;
  const navbar = document.querySelector("nav");

  if (navbar) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll <= 0) {
        navbar.classList.remove("-translate-y-full");
        return;
      }
      if (currentScroll > lastScrollY && !navbar.classList.contains("-translate-y-full")) {
        navbar.classList.add("-translate-y-full");
      } else if (currentScroll < lastScrollY && navbar.classList.contains("-translate-y-full")) {
        navbar.classList.remove("-translate-y-full");
      }
      lastScrollY = currentScroll;
    });
  }

  // ==================== SCROLL TILT TABLET ====================
  const tiltContainer = document.getElementById("scroll-tilt-tablet");
  if (tiltContainer) {
    const tiltObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            const scale = 0.95 + ratio * 0.1;
            const rotateX = 8 - ratio * 10;
            const translateY = 20 - ratio * 25;
            tiltContainer.style.transform = `perspective(2000px) rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`;
            tiltContainer.style.transition = "transform 0.1s linear";
          }
        });
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    );
    tiltObserver.observe(tiltContainer);
  }

  // ==================== MOBILE MENU TOGGLE ====================
  document.querySelectorAll(".mobile-menu-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const overlay = document.querySelector(".mobile-menu-overlay");
      if (overlay) {
        const isOpen = overlay.style.opacity !== "1";
        overlay.style.opacity = isOpen ? "1" : "0";
        overlay.style.pointerEvents = isOpen ? "all" : "none";
        document.body.classList.toggle("mobile-menu-open", isOpen);
      }
    });
  });

  document.querySelectorAll(".mobile-menu-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const overlay = document.querySelector(".mobile-menu-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        document.body.classList.remove("mobile-menu-open");
      }
    });
  });

  // ==================== PRICING TOGGLE ====================
  const billingToggle = document.getElementById("billing-toggle");
  if (billingToggle) {
    billingToggle.addEventListener("change", function () {
      const isYearly = this.checked;
      document.querySelectorAll(".price-monthly").forEach((el) => {
        el.style.display = isYearly ? "none" : "block";
      });
      document.querySelectorAll(".price-yearly").forEach((el) => {
        el.style.display = isYearly ? "block" : "none";
      });
    });
  }

  // ==================== FORMSPREE CONTACT FORM ====================
  document.querySelectorAll("form.neuramesh-contact-form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : "";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-xl">progress_activity</span> Sending...';
      }

      fetch(this.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            this.innerHTML = `
              <div class="text-center py-16 scroll-reveal visible">
                <span class="material-symbols-outlined text-6xl text-primary mb-4">check_circle</span>
                <h3 class="font-display-lg text-3xl font-bold mb-2">Message Sent!</h3>
                <p class="text-slate-300 text-lg mb-8">We'll get back to you shortly.</p>
                <a href="/" class="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-semibold text-sm hover:scale-105 transition-transform">Back to Home</a>
              </div>
            `;
          } else {
            throw new Error("Form submission failed");
          }
        })
        .catch(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          alert("Something went wrong. Please try again or email us directly at hello@neuramesh.com");
        });
    });
  });

  // ==================== ANIMATED COUNTERS ====================
  const counters = document.querySelectorAll(".counter-value");
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || "";
            let current = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = current.toLocaleString() + suffix;
            }, 25);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  // ==================== FAQ ACCORDION ====================
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", function () {
      const answer = this.nextElementSibling;
      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";
      document.querySelectorAll(".faq-answer").forEach((a) => {
        a.style.maxHeight = "0px";
        a.style.paddingBottom = "0px";
      });
      document.querySelectorAll(".faq-question .material-symbols-outlined").forEach((icon) => {
        icon.style.transform = "rotate(0deg)";
      });
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.style.paddingBottom = "24px";
        this.querySelector(".material-symbols-outlined").style.transform = "rotate(180deg)";
      }
    });
  });
})();
