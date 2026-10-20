"use strict";

// 1. Update the footer copyright year.
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// 2. Mobile navigation menu.
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      menuToggle.textContent = "☰";
    });
  });
}

// 3. Pause other videos when one starts playing.
const portfolioVideos = document.querySelectorAll(".video-frame video");

portfolioVideos.forEach((video) => {
  video.addEventListener("play", () => {
    portfolioVideos.forEach((otherVideo) => {
      if (otherVideo !== video) {
        otherVideo.pause();
      }
    });
  });
});

// 4. Require matching email addresses on the contact form.
const contactEmail = document.getElementById("client-email");
const confirmEmail = document.getElementById("confirm-email");
const contactReplyTo = document.getElementById("client-replyto");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const successModal = document.getElementById("success-modal");
const successModalClose = document.getElementById("success-modal-close");

if (contactEmail && confirmEmail) {
  const validateEmailMatch = () => {
    const emailsMatch =
      contactEmail.value.trim() === confirmEmail.value.trim();

    confirmEmail.setCustomValidity(
      emailsMatch ? "" : "Email addresses do not match."
    );
  };

  contactEmail.addEventListener("input", validateEmailMatch);
  confirmEmail.addEventListener("input", validateEmailMatch);
}

if (contactForm && formMessage && successModal instanceof HTMLDialogElement) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  successModalClose?.addEventListener("click", () => successModal.close());

  successModal.addEventListener("close", () => {
    submitButton?.focus();
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (contactEmail && confirmEmail) {
      confirmEmail.setCustomValidity(
        contactEmail.value.trim() === confirmEmail.value.trim()
          ? ""
          : "Email addresses do not match."
      );
    }

    if (!contactForm.reportValidity()) {
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "SENDING...";
    }
    formMessage.textContent = "Sending your message...";

    try {
      if (contactEmail && contactReplyTo) {
        contactReplyTo.value = contactEmail.value.trim();
      }

      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}.`);
      }

      const result = await response.json();

      if (result.success !== true && result.success !== "true") {
        throw new Error(result.message || "The form service did not accept the message.");
      }

      contactForm.reset();
      formMessage.textContent = "";
      successModal.showModal();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      formMessage.textContent =
        "We couldn't confirm whether your message was sent. Check your inbox before trying again.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "SEND MESSAGE ↗";
      }
    }
  });
}
