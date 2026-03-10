const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

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
  });
});

window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navAnchors.forEach((anchor) => {
    anchor.classList.remove('active');
    if (anchor.getAttribute('href') === `#${currentSection}`) {
      anchor.classList.add('active');
    }
  });
});

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
