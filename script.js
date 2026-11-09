const hero = document.querySelector(".hero-move");
let heroFrame = null;
function updateHeroPosition() {
  if (!hero || heroFrame !== null) return;

  heroFrame = requestAnimationFrame(() => {
    const progress = Math.min(window.scrollY / 300, 1);
    hero.style.transform = `translateX(${progress * -800}px)`;
    heroFrame = null;
  });
}
window.addEventListener("scroll", updateHeroPosition, { passive: true });
updateHeroPosition();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function spinIcon(icon, className) {
  if (prefersReducedMotion.matches) return Promise.resolve();

  icon.classList.remove(className);
  void icon.offsetWidth;
  icon.classList.add(className);

  const animation = icon.getAnimations().find(
    (item) => item.animationName === "theme-spin"
  );
  if (!animation) {
    icon.classList.remove(className);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => {
      icon.classList.remove(className);
      resolve();
    };
    animation.addEventListener("finish", finish, { once: true });
    animation.addEventListener("cancel", finish, { once: true });
  });
}

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
function updateThemeButton() {
  const themeMode = document.body.classList.contains("dark");
  const action = themeMode ? "light" : "dark";
  themeIcon.src = themeMode ? "icons/sun.svg" : "icons/moon.svg";
  themeToggle.setAttribute("aria-label", `Switch to ${action} mode`);
}
updateThemeButton();
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  updateThemeButton();
  void spinIcon(themeIcon, "theme-spin");
});

const styleToggle = document.getElementById("style-toggle");
const styleIcon = document.getElementById("style-icon");
const styleToggleModal = document.getElementById("styleToggleModel");
const closeStyleToggleModal = document.getElementById("styleToggleClose");
const proceedStyleToggle = document.getElementById("proceedStyleToggle");
function updateStyleToggleLabel() {
  const plainMode = document.documentElement.classList.contains("plain-mode");
  const action = plainMode ? "on" : "off";
  styleToggle.setAttribute("aria-label", `Turn styles ${action}`);
}
updateStyleToggleLabel();
function openStyleToggleModal() {
  styleToggleModal.hidden = false;
  proceedStyleToggle.focus();
}
function hideStyleToggleModal() {
  styleToggleModal.hidden = true;
  styleToggle.focus();
}
async function toggleStyles() {
  const plainMode = document.documentElement.classList.contains("plain-mode");
  const animationFinished = spinIcon(styleIcon, "style-spin");
  styleToggle.disabled = true;

  if (!plainMode) {
    await animationFinished;
  }

  document.documentElement.classList.toggle("plain-mode");
  updateStyleToggleLabel();

  if (plainMode) {
    await animationFinished;
  }
  styleToggle.disabled = false;
}
styleToggle.addEventListener("click", () => {
  if (document.documentElement.classList.contains("plain-mode")) {
    void toggleStyles();
    return;
  }
  openStyleToggleModal();
});
closeStyleToggleModal.addEventListener("click", hideStyleToggleModal);
proceedStyleToggle.addEventListener("click", () => {
  hideStyleToggleModal();
  void toggleStyles();
});
styleToggleModal.addEventListener("click", (event) => {
  if (event.target === styleToggleModal) {
    hideStyleToggleModal();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !styleToggleModal.hidden) {
    hideStyleToggleModal();
  }
});

const header = document.querySelector("header");
if (header) {
  const updateScrollOffset = () => {
    const height = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty(
      "--header-offset",
      `${height}px`
    );
  };
  new ResizeObserver(updateScrollOffset).observe(header);
  updateScrollOffset();
}

const sectionLinks = [...document.querySelectorAll('header nav a[href^="#"]')];
const sections = sectionLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
function updateCurrentSection() {
  const activationLine = header.getBoundingClientRect().bottom + 1;
  let currentSection = null;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= activationLine) {
      currentSection = section;
    }
  }
  for (const link of sectionLinks) {
    if (currentSection && link.hash === `#${currentSection.id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}
window.addEventListener("scroll", updateCurrentSection, { passive: true });
window.addEventListener("resize", updateCurrentSection);
updateCurrentSection();

const scramble = document.querySelector(".scramble");
if (scramble) {
  const hasScrollTimeline = CSS.supports("animation-timeline: --contact-timeline");
  if (!hasScrollTimeline) {
    scramble.inert = false;
  } else {
    scramble.inert = true;
    const updateScrambleLink = () => {
      const offset = Number.parseFloat(
        getComputedStyle(scramble).getPropertyValue("--page-offset")
      );

      if (Number.isFinite(offset)) {
        scramble.inert = offset > 0.01;
      }
    };
    window.addEventListener("scroll", updateScrambleLink, { passive: true });
    window.addEventListener("resize", updateScrambleLink);
    updateScrambleLink();
  }
}