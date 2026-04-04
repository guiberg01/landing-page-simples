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
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  uniqueTargets.forEach((element) => {
    observer.observe(element);
  });
}

const header = document.getElementById("header");
const headerNavLinks = [
  ...document.querySelectorAll('header nav a[href^="#"]'),
];
const pageSections = [...document.querySelectorAll("main > section[id]")];
const navLinkMap = new Map(
  headerNavLinks.map((link) => [link.getAttribute("href")?.slice(1), link]),
);
const isLowEndDevice =
  Boolean(navigator.connection?.saveData) ||
  (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4);

let isTicking = false;
let lastScrollTop = -1;
let headerIsScrolled = false;
let lastScrollProgress = -1;
let activeSectionId = "";
let maxScrollable = 0;
let activeSectionMarker = 0;

const setActiveNavLink = (sectionId) => {
  if (!sectionId || sectionId === activeSectionId) {
    return;
  }

  if (activeSectionId) {
    const previousLink = navLinkMap.get(activeSectionId);
    if (previousLink) {
      previousLink.classList.remove("is-active");
    }
  }

  const nextLink = navLinkMap.get(sectionId);
  if (nextLink) {
    nextLink.classList.add("is-active");
    activeSectionId = sectionId;
  }
};

const updateLayoutMetrics = () => {
  maxScrollable = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    0,
  );
  activeSectionMarker = Math.max((header?.offsetHeight ?? 0) + 24, 0);
};

const updateActiveSection = () => {
  if (!pageSections.length) {
    return;
  }

  const scrollMarker = window.scrollY + activeSectionMarker;
  let nextSectionId = pageSections[0].id;

  for (const section of pageSections) {
    if (section.offsetTop <= scrollMarker) {
      nextSectionId = section.id;
      continue;
    }

    break;
  }

  setActiveNavLink(nextSectionId);
};

const updateScrollEffects = () => {
  const scrollTop = window.scrollY;
  const previousScrollTop = lastScrollTop;
  const delta = Math.abs(scrollTop - previousScrollTop);
  const crossedHeaderThreshold =
    (previousScrollTop <= 8 && scrollTop > 8) ||
    (previousScrollTop > 8 && scrollTop <= 8);

  if (scrollTop === previousScrollTop) {
    isTicking = false;
    return;
  }

  if (delta < 1.2 && !crossedHeaderThreshold) {
    isTicking = false;
    return;
  }

  lastScrollTop = scrollTop;

  if (header) {
    const shouldHeaderBeScrolled = scrollTop > 8;

    if (shouldHeaderBeScrolled !== headerIsScrolled) {
      header.classList.toggle("is-scrolled", shouldHeaderBeScrolled);
      headerIsScrolled = shouldHeaderBeScrolled;
    }

    const scrollProgress =
      maxScrollable > 0 ? Math.min(scrollTop / maxScrollable, 1) : 0;
    const progressThreshold = isLowEndDevice ? 0.012 : 0.0075;

    if (Math.abs(scrollProgress - lastScrollProgress) >= progressThreshold) {
      header.style.setProperty("--scroll-progress", scrollProgress.toFixed(4));
      lastScrollProgress = scrollProgress;
    }
  }

  updateActiveSection();

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

window.addEventListener(
  "resize",
  () => {
    updateLayoutMetrics();
    lastScrollTop = -1;
    updateScrollEffects();
  },
  { passive: true },
);

if (navLinkMap.size) {
  updateActiveSection();
}

updateLayoutMetrics();
updateScrollEffects();
