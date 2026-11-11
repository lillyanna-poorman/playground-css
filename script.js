/* hero movement on scroll */
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

/* theme toggle */
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

/* style toggle */
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

/* style toggle modal */
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

/* skills orbit */
const skills = [
  {
    name: "HTML",
    icon: "5",
    color: "#e67c35",
    description: "Learning best practices for semantic markup, accessibility, and structure."
  },
  {
    name: "CSS",
    icon: "3",
    color: "#1676dc",
    description: "Learning to use CSS libraries, design system tokens, and responsive layout techniques."
  },
  {
    name: "JavaScript",
    icon: "JS",
    color: "#f1d44b",
    description: "Learning basic JavaScript as well as exploring React and other frameworks for building interactive web applications."
  },
  {
    name: "Git",
    icon: "Git",
    color: "#f05032",
    description: "Learning the most commonly used git commands, branch utilization, and GitHub workflows for version control and collaboration."
  }
];
const section = document.getElementById("skills");
const orbitTrack = document.getElementById("orbitTrack");
const skillButtons = document.querySelectorAll(".orbit-badge");
const featuredTitle = document.getElementById("featuredTitle");
const featuredDescription = document.getElementById("featuredDescription");
const desktopSkillsLayout = window.matchMedia("(min-width: 40rem)");
let currentRotation = 0;
let selectedSkillIndex = null;
function rotateSelectedSkill(index) {
  const angle = [0, 90, 180, 270][index];
  const targetPosition = desktopSkillsLayout.matches ? 90 : 180;
  const targetRotation = targetPosition - angle;
  const clockwiseDelta = ((targetRotation - currentRotation) % 360 + 360) % 360;
  currentRotation += clockwiseDelta;
  orbitTrack.style.setProperty("--rotation", `${currentRotation}deg`);
}
function selectSkill(index) {
  const skill = skills[index];
  if (!skill) return;
  selectedSkillIndex = index;
  rotateSelectedSkill(index);
  section.style.setProperty("--accent", skill.color);
  section.classList.add("has-selected-skill");
  featuredTitle.textContent = skill.name;
  featuredDescription.textContent = skill.description;
  skillButtons.forEach((button, buttonIndex) => {
    button.setAttribute("aria-pressed", String(buttonIndex === index));
  });
}
skillButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectSkill(Number(button.dataset.skill));
  });
});
desktopSkillsLayout.addEventListener("change", () => {
  if (selectedSkillIndex !== null) {
    rotateSelectedSkill(selectedSkillIndex);
  }
});

/* header offset for scroll snapping */
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

/* section link highlighting */
const sectionLinks = [...document.querySelectorAll('header nav a[href^="#"]')];
const sections = sectionLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
// contact section exception where anchors to bottom of section instead of top so that text is fully unscrambled
const contactLink = sectionLinks.find(link => link.hash === "#contact");
const contactSection = document.getElementById("contact");
if (contactLink && contactSection) {
  contactLink.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", contactLink.hash);
    contactSection.scrollIntoView({ block: "end", behavior: "smooth" });
  });
}
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

/* contact link enabled on unscramble */
const unscramble = document.getElementById("contact-link");
if (unscramble) {
  const hasScrollTimeline = CSS.supports("animation-timeline: --contact-timeline");
  if (!hasScrollTimeline) {
    unscramble.inert = false;
  } else {
    unscramble.inert = true;
    const updateScrambleLink = () => {
      const offset = Number.parseFloat(
        getComputedStyle(unscramble).getPropertyValue("--page-offset")
      );

      if (Number.isFinite(offset)) {
        unscramble.inert = offset > 0.01;
      }
    };
    window.addEventListener("scroll", updateScrambleLink, { passive: true });
    window.addEventListener("resize", updateScrambleLink);
    updateScrambleLink();
  }
}