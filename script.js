"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
  document.body.classList.toggle("menu-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll(".service-card .card-link").forEach((link) => {
  link.addEventListener("click", () => {
    const service = link.closest(".service-card").dataset.service;
    const serviceField = document.querySelector('[name="service"]');
    if (serviceField) serviceField.value = service;
  });
});

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [...contactForm.querySelectorAll("input[required], textarea[required]")];
    const invalidFields = fields.filter((field) => !field.checkValidity());

    fields.forEach((field) => {
      field.setAttribute("aria-invalid", String(!field.checkValidity()));
      field.addEventListener("input", () => {
        field.setAttribute("aria-invalid", String(!field.checkValidity()));
      }, { once: true });
    });

    if (invalidFields.length) {
      formFeedback.textContent = "Please enter your name, a valid business email, and a message of at least 10 characters.";
      invalidFields[0].focus();
      return;
    }

    const formData = new FormData(contactForm);
    const subject = `Website enquiry from ${formData.get("name")}`;
    const message = [
      `Name: ${formData.get("name")}`,
      `Business email: ${formData.get("email")}`,
      `Company: ${formData.get("company") || "Not provided"}`,
      `Service required: ${formData.get("service") || "Not specified"}`,
      "",
      "Message:",
      formData.get("message")
    ].join("\n");
    const mailto = `mailto:cybersoftgaurd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    formFeedback.textContent = "Opening your default email app with the enquiry. You’ll need to send it there.";
    window.location.href = mailto;
  });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
