(function () {
  const btn = document.getElementById("reserva-ya-floating");
  const footer = document.querySelector("footer");
  const slot = () => document.getElementById("footer-reserva-slot");
  if (!btn || !footer) return;

  function moveToFooter() {
    const targetEl = slot();
    if (!targetEl || !btn) return;
    btn.classList.remove(
      "fixed",
      "right-4",
      "bottom-20",
      "sm:bottom-24",
      "lg:bottom-28",
      "z-50"
    );
    btn.classList.add("inline-flex");
    // Make full-width on small screens and auto on larger screens
    btn.classList.add("w-full", "sm:w-auto");
    // Center icon/text inside the button
    btn.classList.add("justify-center", "text-center");
    // Improve appearance for footer: compact padding, gap, max width and smaller shadow
    btn.classList.remove(
      "animate-pulse",
      "shadow-lg",
      "font-bold",
      "transform",
      "hover:scale-105",
      "hover:shadow-xl"
    );
    btn.classList.add(
      "items-center",
      "gap-3",
      "max-w-md",
      "px-6",
      "py-3",
      "shadow-md",
      "transition-colors",
      "duration-200"
    );
    targetEl.appendChild(btn);
  }

  function moveToFloating() {
    if (!btn) return;
    const bodyEl = document.body;
    if (!bodyEl) return;
    if (bodyEl.contains(btn) && btn.classList.contains("fixed")) return;
    btn.classList.add("fixed", "right-4", "bottom-20", "z-50");
    btn.classList.remove("inline-flex");
    // remove responsive width classes when floating
    btn.classList.remove("w-full", "sm:w-auto");
    // remove centering classes when floating
    btn.classList.remove("justify-center", "text-center");
    // restore floating visual classes
    btn.classList.add(
      "animate-pulse",
      "shadow-lg",
      "font-bold",
      "transform",
      "hover:scale-105",
      "hover:shadow-xl",
      "py-3",
      "px-4"
    );
    // remove footer-specific classes
    btn.classList.remove(
      "items-center",
      "gap-3",
      "max-w-md",
      "px-6",
      "py-3",
      "shadow-md",
      "transition-colors",
      "duration-200"
    );
    bodyEl.appendChild(btn);
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) moveToFooter();
          else moveToFloating();
        });
      },
      { threshold: 0.1 }
    );
    io.observe(footer);
  } else {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (nearBottom) moveToFooter();
      else moveToFloating();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
