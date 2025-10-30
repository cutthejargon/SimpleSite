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

// Smooth scroll & active menu
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const targetSection = document.getElementById(targetId);
    const yOffset = -50; // adjust for header height
    const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });

    // Close menu on mobile
    if(nav.classList.contains('show')) {
      nav.classList.remove('show');
      hamburger.classList.remove('open');
    }
  });
});

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
