
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

// 4. Contact form.
// Replace this with your real email address before publishing.
const CONTACT_EMAIL = "roniebaban7@gmail.com";

const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const project = String(formData.get("project") || "").trim();
    const details = String(formData.get("details") || "").trim();

    if (!contactForm.reportValidity()) {
      return;
    }

    if (
      !CONTACT_EMAIL ||
      CONTACT_EMAIL === "roniebaban7@gmail.com"
    ) {
      formMessage.textContent =
        "Please configure CONTACT_EMAIL in script.js with your real email address before using this form.";

      return;
    }

    const subject = encodeURIComponent(
      `Video Editing Inquiry - ${project}`
    );

    const body = encodeURIComponent(
      `Hi Ronie,

My name: ${name}
My email: ${email}
Project type: ${project}

Project details:
${details}

Looking forward to discussing this project.`
    );

    formMessage.textContent =
      "Opening your email app. Review your message and press Send to contact Ronie.";

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
}
