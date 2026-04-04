const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const observerOptions = {
  threshold: 0.14,
  rootMargin: "0px 0px -40px 0px",
};

const revealTargets = [
  ...document.querySelectorAll("main > section"),
  ...document.querySelectorAll("#novidade .novidade-metricas article"),
  ...document.querySelectorAll("#novidade .novidade-pilares article"),
  ...document.querySelectorAll("#sobre .sobre-stack li"),
];

const uniqueTargets = [...new Set(revealTargets)];

if (!prefersReducedMotion) {
  uniqueTargets.forEach((element, index) => {
    const delay = Math.min(index * 18, 220);
    element.style.opacity = "0";
    element.style.transform = "translate3d(0, 2.4rem, 0)";
    element.style.willChange = "transform, opacity";
    element.style.transition = `opacity 0.45s ease-out ${delay}ms, transform 0.45s ease-out ${delay}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translate3d(0, 0, 0)";
        entry.target.style.willChange = "auto";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  uniqueTargets.forEach((element) => {
    observer.observe(element);
  });
}

const header = document.getElementById("header");
const heroCard = document.querySelector(".hero-card");
const hasParallax =
  window.matchMedia("(min-width: 921px)").matches && !prefersReducedMotion;

let isTicking = false;

const updateScrollEffects = () => {
  const scrollTop = window.scrollY;

  if (header) {
    header.style.boxShadow =
      scrollTop > 8 ? "0 8px 24px -16px rgba(0, 0, 0, 0.26)" : "none";
  }

  if (hasParallax && heroCard) {
    const parallaxCardOffset = Math.min(scrollTop * 0.08, 36);
    heroCard.style.transform = `translate3d(0, ${parallaxCardOffset}px, 0)`;
  }

  isTicking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!isTicking) {
      window.requestAnimationFrame(updateScrollEffects);
      isTicking = true;
    }
  },
  { passive: true },
);

updateScrollEffects();
