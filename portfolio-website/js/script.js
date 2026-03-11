const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const hashNavAnchors = Array.from(navAnchors).filter((anchor) => anchor.getAttribute('href')?.startsWith('#'));
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleIcon = themeToggle?.querySelector('i');
const themeToggleText = themeToggle?.querySelector('span');
const THEME_KEY = 'preferred-theme';

const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  if (themeToggleIcon) {
    themeToggleIcon.classList.remove('fa-moon', 'fa-sun');
    themeToggleIcon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
  }

  if (themeToggleText) {
    themeToggleText.textContent = isDark ? 'Light' : 'Dark';
  }
};

const savedTheme = localStorage.getItem(THEME_KEY);
const initialTheme = savedTheme || 'light';
applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    const nextTheme = isDark ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navAnchors.forEach((anchor) => {
  anchor.addEventListener('click', () => {
    if (navLinks) {
      navLinks.classList.remove('open');
    }

    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

navAnchors.forEach((anchor) => {
  const href = anchor.getAttribute('href') || '';
  const linkPage = href.split('#')[0] || 'index.html';

  if (linkPage && !href.startsWith('#') && linkPage === currentPage) {
    anchor.classList.add('active');
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') {
      return;
    }

    const targetElement = document.querySelector(targetId);
    if (!targetElement) {
      return;
    }

    event.preventDefault();

    const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset + 1;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });

    if (navLinks) {
      navLinks.classList.remove('open');
    }

    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

if (hashNavAnchors.length > 0 && currentPage === 'index.html') {
  window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    hashNavAnchors.forEach((anchor) => {
      anchor.classList.remove('active');
      if (anchor.getAttribute('href') === `#${currentSection}`) {
        anchor.classList.add('active');
      }
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const contactForm = document.querySelector('.contact-form');
const formMessage = document.querySelector('.form-message');

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    formMessage.className = 'form-message success';
    formMessage.textContent = 'Sending your message...';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
      });

      const result = await response.json();
      if (result.success) {
        formMessage.className = 'form-message success';
        formMessage.textContent = 'Message sent successfully. I will get back to you soon.';
        contactForm.reset();
      } else {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Unable to send message right now. Please try WhatsApp.';
      }
    } catch (error) {
      formMessage.className = 'form-message error';
      formMessage.textContent = 'Network issue. Please try again or message on WhatsApp.';
    }
  });
}
