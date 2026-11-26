(() => {
  const heart = document.querySelector("#obj-3 .pulse-heart");
  const countElement = heart?.querySelector(".pulse-heart__count");
  const reset = document.querySelector("#obj-3 .pulse-demo__reset");
  if (!heart || !countElement || !reset) return;

  const initialCount = 128;
  let count = initialCount;
  let liked = false;
  let animationTimer = null;

  function renderCount() {
    countElement.textContent = String(count);
  }

  function clearPulseClasses() {
    heart.classList.remove(
      "is-contracting",
      "is-pulsing",
      "is-ticking",
      "is-liked"
    );
  }

  function toggleLiked() {
    if (animationTimer) window.clearTimeout(animationTimer);

    heart.classList.add("is-contracting");
    heart.classList.remove("is-pulsing", "is-ticking");

    animationTimer = window.setTimeout(() => {
      liked = !liked;
      count = liked ? count + 1 : count - 1;

      clearPulseClasses();
      heart.classList.toggle("is-liked", liked);
      heart.classList.add("is-pulsing", "is-ticking");
      heart.setAttribute("aria-pressed", String(liked));
      heart.setAttribute(
        "aria-label",
        `${liked ? "Unlike" : "Like"}, ${count} likes`
      );
      renderCount();

      animationTimer = window.setTimeout(() => {
        heart.classList.remove("is-pulsing", "is-ticking");
      }, 540);
    }, 180);
  }

  heart.addEventListener("click", toggleLiked);

  reset.addEventListener("click", () => {
    if (animationTimer) window.clearTimeout(animationTimer);
    liked = false;
    count = initialCount;
    clearPulseClasses();
    heart.setAttribute("aria-pressed", "false");
    heart.setAttribute("aria-label", `Like, ${count} likes`);
    renderCount();
  });

  renderCount();
})();
