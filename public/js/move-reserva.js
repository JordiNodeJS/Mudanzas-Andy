(function () {
  // Toggle between floating button and footer button when footer enters viewport.
  const floating = document.getElementById("reserva-ya-floating");
  const footerBtn = document.getElementById("reserva-ya-footer-btn");
  const footer = document.querySelector("footer");
  const contactForm = document.getElementById("contactForm");

  if (!floating || !footerBtn || !footer) return;

  function showFooter() {
    floating.classList.add("hidden");
    footerBtn.classList.remove("hidden");
    footerBtn.classList.add("flex");

    // Also hide contact form when footer is visible to allow access to legal links
    if (contactForm) {
      contactForm.classList.add("translate-y-full");
      // Update toggle button text if it exists
      const toggleBtn = document.getElementById("toggleForm");
      if (toggleBtn) {
        toggleBtn.textContent = "↑";
      }
    }
  }

  function showFloating() {
    footerBtn.classList.add("hidden");
    footerBtn.classList.remove("flex");
    floating.classList.remove("hidden");

    // Show contact form when scrolling up (away from footer)
    if (contactForm) {
      contactForm.classList.remove("translate-y-full");
      // Update toggle button text if it exists
      const toggleBtn = document.getElementById("toggleForm");
      if (toggleBtn) {
        toggleBtn.textContent = "↓";
      }
    }
  }

  // Additional logic to handle contact form visibility near footer
  function handleContactFormNearFooter() {
    if (!contactForm || !footer) return;

    const footerRect = footer.getBoundingClientRect();
    const contactFormRect = contactForm.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // If footer is visible and contact form is also visible, hide contact form
    if (footerRect.top < windowHeight && contactFormRect.top < windowHeight) {
      contactForm.classList.add("translate-y-full");
      const toggleBtn = document.getElementById("toggleForm");
      if (toggleBtn) {
        toggleBtn.textContent = "↑";
      }
    }
  }

  // Initialize contact form state based on current scroll position
  function initializeContactFormState() {
    if (!contactForm || !footer) return;

    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // If footer is already visible on page load, hide contact form
    if (footerRect.top < windowHeight) {
      contactForm.classList.add("translate-y-full");
      const toggleBtn = document.getElementById("toggleForm");
      if (toggleBtn) {
        toggleBtn.textContent = "↑";
      }
    }
  }

  // Run initialization after DOM is loaded
  document.addEventListener("DOMContentLoaded", initializeContactFormState);

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

    // Additional observer for contact form management
    const contactFormObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleContactFormNearFooter();
          }
        });
      },
      { threshold: 0.1 }
    );
    contactFormObserver.observe(footer);
  } else {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 120;
      if (nearBottom) showFooter();
      else showFloating();

      // Also handle contact form visibility
      handleContactFormNearFooter();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
