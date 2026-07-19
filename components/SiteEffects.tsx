'use client';

import { useEffect } from 'react';

// Ported as-is from the original vanilla-JS bottom-of-body <script> so behaviour
// (theme toggle, mobile nav, scroll-based navbar, fade-in-on-scroll, particles)
// stays identical to the static site. Deliberately imperative DOM code rather
// than React state, matching what it replaces.
export default function SiteEffects() {
  useEffect(() => {
    const themeToggle = document.querySelector<HTMLButtonElement>('.theme-toggle');
    const body = document.body;

    const handleThemeToggle = () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      body.classList.add('theme-transitioning');
      setTimeout(() => {
        body.classList.remove('theme-transitioning');
      }, 500);
    };
    themeToggle?.addEventListener('click', handleThemeToggle);

    const navToggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
    const navLinks = document.querySelector<HTMLUListElement>('.nav-links');

    const handleNavToggle = () => {
      navLinks?.classList.toggle('active');
      navToggle?.classList.toggle('active');
    };
    navToggle?.addEventListener('click', handleNavToggle);

    const anchorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const handleAnchorClick = function (this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      if (target) {
        const navbar = document.querySelector<HTMLElement>('.navbar');
        const navHeight = navbar?.offsetHeight ?? 0;
        const targetPosition = (target as HTMLElement).offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
        navLinks?.classList.remove('active');
        navToggle?.classList.remove('active');
      }
    };
    anchorLinks.forEach((anchor) => anchor.addEventListener('click', handleAnchorClick));

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const navbar = document.querySelector<HTMLElement>('.navbar');
      if (!navbar) return;
      const currentScrollY = window.scrollY;

      navbar.classList.toggle('scrolled', currentScrollY > 100);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);

    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('fade-in');
          }, index * 100);
        }
      });
    }, observerOptions);

    const observedEls = document.querySelectorAll('.project-card, .timeline-item, .education-card');
    observedEls.forEach((el) => observer.observe(el));

    const floatingCharts = document.querySelectorAll<HTMLElement>('.floating-chart');
    floatingCharts.forEach((chart, index) => {
      chart.style.animationDelay = `${index * 0.5}s`;
    });

    let particleContainer: HTMLDivElement | null = null;
    if (!document.querySelector('.particle-system')) {
      particleContainer = document.createElement('div');
      particleContainer.className = 'particle-system';
      document.body.appendChild(particleContainer);

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 20) + 's';
        particleContainer.appendChild(particle);
      }
    }

    return () => {
      themeToggle?.removeEventListener('click', handleThemeToggle);
      navToggle?.removeEventListener('click', handleNavToggle);
      anchorLinks.forEach((anchor) => anchor.removeEventListener('click', handleAnchorClick));
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      particleContainer?.remove();
    };
  }, []);

  return null;
}
