const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navLinks = nav.querySelectorAll('a');
const header = document.getElementById('header');
const sections = document.querySelectorAll('section');

// Hamburger toggle
hamburger.addEventListener('click', () => {
  nav.classList.toggle('show');
  hamburger.classList.toggle('open');
});

// Smooth scroll helper used by nav links and other in-page links
function smoothScrollToHref(linkEl) {
  linkEl.addEventListener('click', e => {
    e.preventDefault();
    const href = linkEl.getAttribute('href') || '';
    const targetId = href.replace(/^#/, '');
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;
    const yOffset = -50; // adjust for header height
    const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });

    // Close menu on mobile
    if(nav.classList.contains('show')) {
      nav.classList.remove('show');
      hamburger.classList.remove('open');
    }
  });
}

// Attach to nav links
navLinks.forEach(link => smoothScrollToHref(link));

// Attach to other in-page links marked with .scroll (e.g., Get in touch)
const scrollLinks = document.querySelectorAll('a.scroll');
scrollLinks.forEach(link => smoothScrollToHref(link));

// Scroll spy with underline
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 70;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if(link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
      // Animate underline
      const linkRect = link.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      const underlineEl = nav;

      underlineEl.style.setProperty('--underline-left', `${link.offsetLeft}px`);
      underlineEl.style.setProperty('--underline-width', `${link.offsetWidth}px`);
    }
  });

  // Logo click should behave like Home link
  const logoEl = document.getElementById('logo');
  if (logoEl) {
    logoEl.addEventListener('click', (e) => {
      // allow normal anchor navigation prevention for smooth scroll
      e.preventDefault();
      const targetSection = document.getElementById('home');
      if (!targetSection) return;
      const yOffset = -50; // same offset as nav links
      const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Close mobile menu if open
      if(nav.classList.contains('show')) {
        nav.classList.remove('show');
        hamburger.classList.remove('open');
      }
    });
  }

  // Shadow on scroll
  if(window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

  // --- Services carousel script ---
  document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.services-carousel');
    if (!carousel) return;

    const slidesEl = carousel.querySelector('.slides');
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    let index = 0;

    // create dots
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(btn);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('button'));

    function update() {
      const offset = -index * carousel.querySelector('.slides-viewport').offsetWidth;
      slidesEl.style.transform = `translateX(${offset}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    // Autoplay every 5 seconds, pause on hover/focus or when page hidden
    let autoplayInterval = 5000;
    let autoplayTimer = null;

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => goTo(index + 1), autoplayInterval);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Pause when user hovers or focuses the carousel
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });

    // Start autoplay
    startAutoplay();

    // keyboard support
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    });

    // resize handler to keep current slide aligned
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(update, 120);
    });

    // init
    goTo(0);
  });
