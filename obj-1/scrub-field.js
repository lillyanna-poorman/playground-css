(() => {
  const field = document.querySelector("#obj-1 [data-scrub-field]");
  if (!field) return;

  const chip = field.querySelector(".scrub-field__chip");
  const number = field.querySelector(".scrub-field__number");
  const input = field.querySelector(".scrub-field__input");
  const reset = document.querySelector("#obj-1 .scrub-demo__reset");
  const min = 0;
  const max = 100;
  const initialValue = 42;
  let value = initialValue;
  let startX = 0;
  let startValue = value;
  let scrubbing = false;

  function clamp(valueToClamp) {
    return Math.min(max, Math.max(min, valueToClamp));
  }

  function render(nextValue, rubberOffset = 0) {
    value = clamp(Math.round(nextValue));

    const progress = ((value - min) / (max - min)) * 100;
    number.textContent = String(value);
    field.style.setProperty("--scrub-progress", `${progress}%`);
    field.style.setProperty("--rubber-offset", `${rubberOffset}px`);
    chip.setAttribute(
      "aria-label",
      `Current value: ${value}. Click to type a value`
    );
  }

  function pointerDown(event) {
    if (event.target === input) return;

    scrubbing = true;
    startX = event.clientX;
    startValue = value;
    field.classList.add("is-scrubbing");
    field.setPointerCapture?.(event.pointerId);
  }

  function pointerMove(event) {
    if (!scrubbing) return;

    const rawDelta = event.clientX - startX;
    const step = rawDelta / 4;
    const nextValue = startValue + step;

    if (nextValue < min || nextValue > max) {
      const edge = nextValue < min ? nextValue - min : nextValue - max;
      const rubberOffset = Math.max(-22, Math.min(22, edge * 0.18));
      render(clamp(nextValue), rubberOffset);
    } else {
      render(nextValue);
    }
  }

  function pointerUp() {
    if (!scrubbing) return;

    scrubbing = false;
    field.classList.remove("is-scrubbing");
    field.style.setProperty("--rubber-offset", "0px");
  }

  function startTyping() {
    if (scrubbing) return;

    chip.hidden = true;
    input.hidden = false;
    input.value = String(value);
    input.focus();
    input.select();
  }

  function commitTyping() {
    const parsed = Number.parseInt(input.value, 10);
    render(Number.isFinite(parsed) ? parsed : value);
    input.hidden = true;
    chip.hidden = false;
    chip.focus();
  }

  field.addEventListener("pointerdown", pointerDown);
  field.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointercancel", pointerUp);

  chip.addEventListener("click", (event) => {
    event.stopPropagation();
    startTyping();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") commitTyping();
    if (event.key === "Escape") {
      input.hidden = true;
      chip.hidden = false;
      chip.focus();
    }
  });

  input.addEventListener("blur", commitTyping);

  reset.addEventListener("click", () => {
    render(initialValue);
  });

  render(initialValue);
})();
