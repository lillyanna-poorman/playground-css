(() => {
  const folder = document.querySelector("#obj-2 .folder");
  const toggle = document.querySelector("#obj-2 .folder-demo__toggle");
  if (!folder || !toggle) return;

  let isPinnedOpen = false;

  function setOpen(open) {
    isPinnedOpen = open;
    folder.classList.toggle("is-open", open);
    folder.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Open";

    document
      .querySelectorAll("#obj-2 .folder__note")
      .forEach((note) => note.setAttribute("aria-hidden", String(!open)));
  }

  folder.addEventListener("click", () => {
    setOpen(!isPinnedOpen);
  });

  toggle.addEventListener("click", () => {
    setOpen(!isPinnedOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isPinnedOpen) {
      setOpen(false);
      toggle.focus();
    }
  });

  setOpen(false);
})();
