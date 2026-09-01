document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Animação de Entrada/Saída na Rolagem (Sobe e Desce)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // 2. Destaque do Menu durante a Rolagem (Scrollspy)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Menu Hambúrguer Mobile
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

});