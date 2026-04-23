// ========================================
// Pre-loader
// ========================================
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');
  if (!preloader || !bar) return;

  let progress = 0;
  const duration = 1800; // ms total
  const interval = 30;   // ms per tick
  const steps = duration / interval;
  const increment = 100 / steps;

  const timer = setInterval(() => {
    progress = Math.min(progress + increment + (Math.random() * 1.5), 100);
    bar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(timer);
      // Wait for bar to reach end, then dismiss
      setTimeout(() => {
        preloader.classList.add('hide');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 700);
      }, 200);
    }
  }, interval);
})();

// ========================================
// DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initParticles();
  initTypewriter();
  initNavigation();
  initProject3DHover();
  initScrollAnimations();
  initSkillBars();
  initContactForm();
  initBackToTop();
  initPageTransitions();
});

// ========================================
// Theme Toggle
// ========================================
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const sunIcon = btn.querySelector('.sun-icon');
  const moonIcon = btn.querySelector('.moon-icon');

  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }

    // Dispatch event for components that need to react (like particles)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  applyTheme(initialTheme);

  btn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// ========================================
// Particle Background
// ========================================
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };
  let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('themeChanged', (e) => {
    currentTheme = e.detail.theme;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseSize = Math.random() * 2 + 1;
      this.size = this.baseSize;
      // Faster movement
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      // Natural float behavior
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      // Mouse interaction (Repel effect)
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;

          this.x -= directionX;
          this.y -= directionY;
          this.size = this.baseSize * 1.5; // Grow slightly near mouse
        } else {
          if (this.size > this.baseSize) {
            this.size -= 0.1;
          }
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      const isLight = currentTheme === 'light';
      ctx.fillStyle = isLight ? `rgba(0, 184, 212, ${this.opacity})` : `rgba(0, 229, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    // Increase particle density slightly
    const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 9000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const isLight = currentTheme === 'light';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = isLight ? `rgba(101, 31, 255, ${opacity})` : `rgba(0, 229, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();

  window.addEventListener('resize', () => {
    resize();
    init();
  });
}

// ========================================
// Typewriter Effect
// ========================================
function initTypewriter() {
  const element = document.getElementById('typewriter');
  const words = ['AI & ML Engineer', 'Python Developer', 'Data Analyst'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2500; // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// ========================================
// Navigation
// ========================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Progressive blur on scroll
  function updateNavbar() {
    const scrollY = window.scrollY;
    const maxScroll = 500;
    const progress = Math.min(scrollY / maxScroll, 1);

    const minBlur = 0;
    const maxBlur = 24;
    const blurValue = minBlur + (maxBlur - minBlur) * progress;

    const minBgOpacity = 0;
    const maxBgOpacity = 0.85;
    const bgOpacity = minBgOpacity + (maxBgOpacity - minBgOpacity) * progress;

    const minBorderOpacity = 0;
    const maxBorderOpacity = 0.3;
    const borderOpacity = minBorderOpacity + (maxBorderOpacity - minBorderOpacity) * progress;

    navbar.style.backdropFilter = `blur(${blurValue}px)`;
    navbar.style.webkitBackdropFilter = `blur(${blurValue}px)`;
    navbar.style.backgroundColor = `rgba(15, 23, 42, ${bgOpacity})`;
    navbar.style.borderBottom = `1px solid rgba(100, 116, 139, ${borderOpacity})`;
    navbar.style.boxShadow = progress > 0.1 ? `0 4px 30px rgba(0, 0, 0, ${progress * 0.3})` : 'none';
    navbar.style.padding = progress > 0.1 ? '0.75rem 0' : '1.25rem 0';
  }

  // Active section highlighting
  function updateActiveSection() {
    let currentSection = 'home';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Trigger page transition
        triggerPageTransition(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });
  });

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveSection();
  }, { passive: true });

  updateNavbar();
  updateActiveSection();
}

// ========================================
// Page Transitions (GSAP)
// ========================================
function initPageTransitions() {
  // Initial page load animation
  gsap.from('main', {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  });
}

function triggerPageTransition(callback) {
  const transitionLayer = document.querySelector('.transition-layer');

  const tl = gsap.timeline();

  tl.to(transitionLayer, {
    scaleX: 1,
    transformOrigin: 'left',
    duration: 0.4,
    ease: 'power2.inOut'
  })
    .to('main', {
      scale: 0.95,
      opacity: 0.8,
      duration: 0.2,
      ease: 'power2.in'
    }, '-=0.2')
    .add(() => {
      if (callback) callback();
    })
    .to(transitionLayer, {
      scaleX: 0,
      transformOrigin: 'right',
      duration: 0.4,
      ease: 'power2.inOut',
      delay: 0.1
    })
    .to('main', {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.3');
}

// ========================================
// 3D Hover Effect for Project Cards
// ========================================
function initProject3DHover() {
  const cards = document.querySelectorAll('.project-card');

  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on mobile

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation based on cursor position (-20 to 20 deg)
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
    });
  });
}

// ========================================
// Scroll Animations (GSAP)
// ========================================
function initScrollAnimations() {
  // Register ScrollTrigger if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax background shapes
    gsap.utils.toArray('.skills-bg-shape, .contact-bg-shape').forEach(shape => {
      gsap.to(shape, {
        y: "30%",
        ease: "none",
        scrollTrigger: {
          trigger: shape.parentElement.parentElement, // The section
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    });

    // Stagger slide up for project cards (Advanced reveal)
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      // Mark all visible immediately so CSS doesn't hide them
      document.querySelectorAll('.project-card').forEach(card => {
        card.classList.add('visible');
      });

      gsap.fromTo('.project-card',
        { y: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: projectsGrid,
            start: "top 85%",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.2)"
        }
      );
    }

    // Profile animation (Scale from 0 with bounce effect)
    const profileWrapper = document.querySelector('.profile-wrapper');
    if (profileWrapper) {
      gsap.fromTo(profileWrapper,
        { scale: 0, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.about-section',
            start: "top 70%",
          },
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "bounce.out",
          onComplete: () => {
            // Start continuous subtle floating (yoyo effect) using GSAP after entry
            gsap.to(profileWrapper, {
              y: -20,
              duration: 3,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1
            });
          }
        }
      );
    }

    // Silhouette SVG tracing animation
    const silhouettePath = document.querySelector('.silhouette-path');
    if (silhouettePath) {
      // Calculate length for dynamic dash effect
      const length = silhouettePath.getTotalLength();
      gsap.set(silhouettePath, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(silhouettePath, {
        scrollTrigger: {
          trigger: '.about-section',
          start: "top 60%", // Triggers slightly after the profile bounces in
        },
        strokeDashoffset: 0,
        duration: 3, // Slow, purposeful drawing speed
        ease: "power2.inOut",
        delay: 0.8,
        repeat: -1,         // Infinite loop
        yoyo: true,         // Draw and undraw
        repeatDelay: 0.5    // Slight pause before reversing
      });
    }
  }

  // Fallback / Standard Intersection Observer for other elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe sections and animated elements
  document.querySelectorAll('.section, .timeline-item, .contact-form-wrapper, .skill-category').forEach(el => {
    observer.observe(el);
  });
}

// ========================================
// Skill Bars Animation (Deprecated for Category Layout)
// ========================================
function initSkillBars() {
  // Logic removed since progress bars transitioned to glowing tags
}



// ========================================
// Contact Form with GSAP Stagger
// ========================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formFields = document.querySelectorAll('.form-field');
  const submitBtn = document.getElementById('submit-btn');
  let hasAnimated = false;

  // Staggered reveal animation for form fields
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        // Just animate a subtle scale/glow on the form when it enters view
        if (typeof gsap !== 'undefined') {
          gsap.from(form, {
            scale: 0.97,
            duration: 0.5,
            ease: 'back.out(1.2)'
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (form) {
    observer.observe(form);

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <div class="spinner" style="width: 20px; height: 20px; border: 2px solid rgba(15, 23, 42, 0.3); border-top-color: #0f172a; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        Sending...
      `;
      submitBtn.disabled = true;

      // Add spinner animation
      const style = document.createElement('style');
      style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);

      // Send actual email via FormSubmit AJAX API
      try {
        const response = await fetch("https://formsubmit.co/ajax/parsanashyam1310@gmail.com", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            _subject: "New Message from Portfolio!"
          })
        });

        if (response.ok) {
          submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M5 13l4 4L19 7"/>
            </svg>
            Message Sent!
          `;
          submitBtn.style.background = '#22c55e';
        } else {
          throw new Error("Failed to send");
        }
      } catch (error) {
        submitBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Delivery Failed
        `;
        submitBtn.style.background = '#ef4444';
      }

      // Reset after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalContent;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        form.reset();
      }, 3000);
    });
  }
}

// ========================================
// Back to Top Button
// ========================================
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
