(function () {
  // Toggle between floating button and footer button when footer enters viewport.
  const floating = document.getElementById("reserva-ya-floating");
  const footerBtn = document.getElementById("reserva-ya-footer-btn");
  const footer = document.querySelector("footer");
  if (!floating || !footerBtn || !footer) return;

  function showFooter() {
    floating.classList.add("hidden");
    footerBtn.classList.remove("hidden");
  }

  function showFloating() {
    footerBtn.classList.add("hidden");
    floating.classList.remove("hidden");
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) showFooter();
          else showFloating();
        });
      },
      { threshold: 0.1 }
    );
    io.observe(footer);
  } else {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 120;
      if (nearBottom) showFooter();
      else showFloating();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
