/**
 * Dumentre Website JS Logic
 * Pure Vanilla JavaScript for high-performance and accessibility.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initFAQAccordion();
  initHeaderScroll();
  initScrollHighlight();
  initScrollAnimations();
  initHeaderCTAObserver();
});

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!toggleBtn || !navMenu) return;

  function toggleMenu() {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", !isExpanded);
    navMenu.classList.toggle("active");
    
    // Prevent background scrolling when menu is open on mobile
    if (!isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  function closeMenu() {
    toggleBtn.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("active");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu if user clicks outside of it
  document.addEventListener("click", (e) => {
    const isClickInside = navMenu.contains(e.target) || toggleBtn.contains(e.target);
    if (!isClickInside && navMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      closeMenu();
    }
  });
}

/**
 * FAQ Accordion Panel Transitions
 */
function initFAQAccordion() {
  const triggers = document.querySelectorAll(".faq-trigger");

  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const parent = trigger.parentElement;
      const panel = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      // Toggle active status
      parent.classList.toggle("active");
      trigger.setAttribute("aria-expanded", !isExpanded);

      if (!isExpanded) {
        // Expand: set max-height to scrollHeight
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        // Collapse: reset max-height
        panel.style.maxHeight = null;
      }
      
      // Accessible state for screens: toggle hidden visibility
      panel.setAttribute("aria-hidden", isExpanded);
    });
  });
}

/**
 * Header Styling on Scroll
 */
function initHeaderScroll() {
  const header = document.querySelector(".main-header");
  if (!header) return;

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add("header-scrolled");
      header.style.paddingTop = "0px";
      header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
      header.style.backgroundColor = "rgba(4, 7, 14, 0.95)";
    } else {
      header.classList.remove("header-scrolled");
      header.style.boxShadow = "";
      header.style.backgroundColor = "rgba(6, 10, 19, 0.85)";
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Initial check on load
}

/**
 * Highlight Current Section in Nav Links on Scroll
 */
function initScrollHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length === 0 || navLinks.length === 0) return;

  function highlightNav() {
    const scrollPosition = window.scrollY + 100; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active-nav");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active-nav");
            link.style.color = "#ffffff";
            link.style.borderBottom = "1px solid var(--accent-cyan)";
          } else {
            link.style.color = "";
            link.style.borderBottom = "";
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();
}

/**
 * Scroll Animations using Intersection Observer (wow factor)
 */
function initScrollAnimations() {
  // Add animation CSS classes programmatically to avoid HTML clutter
  const animateElements = document.querySelectorAll(".card, .step-item, .difference-item, .section-header");
  
  if (!("IntersectionObserver" in window)) {
    // Fallback if browser doesn't support IntersectionObserver
    animateElements.forEach(el => el.style.opacity = "1");
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -50px 0px",
    threshold: 0.15
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-visible");
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, observerOptions);

  animateElements.forEach(el => {
    el.classList.add("animate-ready");
    animationObserver.observe(el);
  });
}

/**
 * Control visibility of Header CTA to avoid duplication with Hero CTA
 */
function initHeaderCTAObserver() {
  const hero = document.querySelector(".hero-section");
  const headerCTA = document.querySelector(".nav-cta-wrapper");
  
  if (!hero || !headerCTA) return;
  
  if (!("IntersectionObserver" in window)) {
    // Fallback if IntersectionObserver is not supported
    return;
  }
  
  const observerOptions = {
    root: null,
    // Discards visibility when hero is less than 10% visible
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Hero is visible, hide header CTA to avoid redundancy
        headerCTA.classList.add("cta-hidden");
      } else {
        // Hero is scrolled out, show header CTA
        headerCTA.classList.remove("cta-hidden");
      }
    });
  }, observerOptions);
  
  observer.observe(hero);
}
