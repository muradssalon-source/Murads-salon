const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
const header = document.querySelector(".site-header");
const heroContent = document.querySelector(".hero-content");

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Gold progress line at the top of the page.
const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.prepend(progress);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Assign elegant reveal directions and stagger delays automatically.
const revealGroups = [
  [".intro > div", "from-left"],
  [".intro > p", "from-right"],
  [".section-heading", "from-left"],
  [".price-panel > .section-heading", "from-left"],
  [".rating-box", "zoom-in"],
  [".booking-content", "zoom-in"],
  [".contact-card > div", "from-left"],
  [".map-placeholder", "from-right"],
  ["footer > *", ""]
];

revealGroups.forEach(([selector, direction]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add("reveal");
    if (direction) element.classList.add(direction);
    element.style.setProperty("--reveal-delay", `${index * 90}ms`);
  });
});

[
  ".service-card",
  ".price-row"
].forEach((selector) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${index * 105}ms`);
  });
});

if (reduceMotion) {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("is-visible");
  });
} else {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

let ticking = false;
function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  progress.style.width = `${percentage}%`;
  header?.classList.toggle("scrolled", scrollTop > 30);

  // Gentle hero parallax—premium rather than distracting.
  if (!reduceMotion && heroContent && scrollTop < window.innerHeight) {
    heroContent.style.transform = `translate3d(0, ${scrollTop * 0.16}px, 0)`;
    heroContent.style.opacity = String(Math.max(0.3, 1 - scrollTop / 900));
  }

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });

updateScrollEffects();
