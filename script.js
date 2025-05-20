/**
 * TinyPaws Landing Page JavaScript
 * Adds interactivity to the TinyPaws landing page
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Feather icons
  if (typeof feather !== "undefined") {
    feather.replace();
  }

  // Waitlist Popup Functionality
  const waitlistOverlay = document.getElementById("waitlist-overlay");
  const openWaitlistBtn = document.getElementById("open-waitlist");
  const heroWaitlistBtn = document.getElementById("hero-waitlist-btn");
  const closePopupBtn = document.getElementById("close-popup");
  const waitlistBtns = document.querySelectorAll(".waitlist-btn");
  const waitlistForm = document.getElementById("waitlist-form");
  const formError = document.getElementById("form-error");
  const formSuccess = document.getElementById("form-success");

  // Waitlist ID from the provided code

  function openWaitlistPopup() {
    waitlistOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling when popup is open
  }

  function closeWaitlistPopup() {
    waitlistOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable scrolling
  }

  // Open popup when clicking on any waitlist button
  if (openWaitlistBtn) {
    openWaitlistBtn.addEventListener("click", openWaitlistPopup);
  }

  // Hero section join waitlist button
  const heroJoinWaitlistBtn = document.getElementById("hero-join-waitlist");
  if (heroJoinWaitlistBtn) {
    heroJoinWaitlistBtn.addEventListener("click", openWaitlistPopup);
  }

  // Mobile menu waitlist button
  const mobileWaitlistBtn = document.getElementById("mobile-waitlist");
  if (mobileWaitlistBtn) {
    mobileWaitlistBtn.addEventListener("click", function () {
      // First close the mobile menu
      if (navMenu && hamburger) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      }
      // Then open the waitlist popup
      openWaitlistPopup();
    });
  }

  if (heroWaitlistBtn) {
    heroWaitlistBtn.addEventListener("click", openWaitlistPopup);
  }

  waitlistBtns.forEach((btn) => {
    btn.addEventListener("click", openWaitlistPopup);
  });

  // Close popup when clicking the close button
  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", closeWaitlistPopup);
  }

  // Close popup when clicking outside the popup
  waitlistOverlay.addEventListener("click", function (e) {
    if (e.target === waitlistOverlay) {
      closeWaitlistPopup();
    }
  });

  // Handle main form submission
  const mainWaitlistForm = document.querySelector(".hero-cta .waitlist-form");
  const mainFormError = document.getElementById("main-form-error");
  const mainFormSuccess = document.getElementById("main-form-success");

  if (mainWaitlistForm) {
    mainWaitlistForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Clear previous messages
      mainFormError.textContent = "";
      mainFormSuccess.textContent = "";

      // Get form data
      const email = document.getElementById("email").value.trim();
      const name = document.getElementById("name").value.trim();
      const petName = document.getElementById("pet-name").value.trim();
      const petType = document.getElementById("pet-type").value;

      // Basic validation
      if (!email) {
        mainFormError.textContent = "Please enter your email address";
        return;
      }

      if (!name) {
        mainFormError.textContent = "Please enter your name";
        return;
      }

      if (!petName) {
        mainFormError.textContent = "Please enter your pet's name";
        return;
      }

      if (!petType) {
        mainFormError.textContent = "Please select your pet type";
        return;
      }

      // Disable submit button during API call
      const submitBtn = mainWaitlistForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Joining...";

      try {
        // Call the new API endpoint
        const response = await fetch("/api/join-waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            petName,
            petType,
          }),
        });

        const data = await response.json();

        if (!data.success) { // Check the 'success' field from our worker
          throw new Error(
            data.message || "Something went wrong. Please try again."
          );
        }

        mainFormSuccess.textContent = data.message || "Successfully joined! We'll be in touch.";
        mainWaitlistForm.reset();
      } catch (error) {
        mainFormError.textContent =
          error.message || "Something went wrong. Please try again.";
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = "JOIN THE WAITLIST";
      }
    });
  }

  // Handle popup form submission
  if (waitlistForm) {
    waitlistForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Clear previous messages
      formError.textContent = "";
      formSuccess.textContent = "";

      // Get form data
      const email = document.getElementById("popup-email").value.trim();
      const name = document.getElementById("popup-name").value.trim();
      const petName = document.getElementById("popup-pet-name").value.trim();
      const petType = document.getElementById("popup-pet-type").value;

      // Basic validation
      if (!email) {
        formError.textContent = "Please enter your email address";
        return;
      }

      if (!name) {
        formError.textContent = "Please enter your name";
        return;
      }

      if (!petName) {
        formError.textContent = "Please enter your pet's name";
        return;
      }

      if (!petType) {
        formError.textContent = "Please select your pet type";
        return;
      }

      // Disable submit button during API call
      const submitBtn = waitlistForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Joining...";

      try {
        // Call the new API endpoint
        const response = await fetch("/api/join-waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            petName,
            petType,
          }),
        });

        const data = await response.json();

        if (!data.success) { // Check the 'success' field from our worker
          throw new Error(
            data.message || "Something went wrong. Please try again."
          );
        }

        formSuccess.textContent = data.message || "Successfully joined! We'll be in touch.";
        waitlistForm.reset();

        // After 3 seconds, close the popup
        setTimeout(() => {
          closeWaitlistPopup();
        }, 3000);
      } catch (error) {
        formError.textContent =
          error.message || "Something went wrong. Please try again.";
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = "JOIN THE WAITLIST";
      }
    });
  }
  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", function () {
      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle current FAQ item
      item.classList.toggle("active");
    });
  });

  // Smooth scrolling for all anchor links including 'See How It Works'
  function smoothScrollTo(targetId) {
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const header = document.querySelector(".header");
      const headerHeight = header.offsetHeight;
      const headerTop = parseInt(window.getComputedStyle(header).top, 10) || 0;
      const headerBottom = headerHeight + headerTop;
      const headerBottomWithPadding = headerBottom + 20; // Add some extra spacing
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        headerBottomWithPadding;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }

  // Apply smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      smoothScrollTo(targetId);
    });
  });

  // We've already handled the main waitlist form above, so this is no longer needed
  // If there are any other waitlist forms on the page that aren't handled yet
  const otherWaitlistForms = document.querySelectorAll(
    ".waitlist-form:not(.hero-cta .waitlist-form)"
  );

  otherWaitlistForms.forEach((form) => {
    if (form !== mainWaitlistForm) {
      // Avoid handling the same form twice
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        // Open the popup instead
        openWaitlistPopup();
      });
    }
  });

  // Helper function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper function to show form error
  function showFormError(inputElement, message) {
    // Remove any existing error message
    const existingError =
      inputElement.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Create and append error message
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    errorElement.style.color = "var(--primary-color)";
    errorElement.style.fontSize = "0.9rem";
    errorElement.style.marginTop = "0.5rem";

    inputElement.parentElement.appendChild(errorElement);

    // Highlight input
    inputElement.style.borderColor = "var(--primary-color)";

    // Remove error when input changes
    inputElement.addEventListener(
      "input",
      function () {
        const error = this.parentElement.querySelector(".error-message");
        if (error) {
          error.remove();
        }
        this.style.borderColor = "";
      },
      { once: true }
    );
  }

  // Testimonial Carousel (simple version)
  const testimonials = document.querySelectorAll(".testimonial");
  let currentTestimonial = 0;

  if (testimonials.length > 1) {
    // Hide all testimonials except the first one
    testimonials.forEach((testimonial, index) => {
      if (index !== 0) {
        testimonial.style.display = "none";
      }
    });

    // Create carousel controls
    const carouselContainer = document.querySelector(".testimonials-carousel");
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "carousel-controls";
    controlsContainer.style.display = "flex";
    controlsContainer.style.justifyContent = "center";
    controlsContainer.style.marginTop = "1rem";

    testimonials.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Testimonial ${index + 1}`);
      dot.style.width = "12px";
      dot.style.height = "12px";
      dot.style.borderRadius = "50%";
      dot.style.border = "none";
      dot.style.margin = "0 5px";
      dot.style.cursor = "pointer";
      dot.style.backgroundColor =
        index === 0 ? "var(--primary-color)" : "var(--border-color)";

      dot.addEventListener("click", function () {
        showTestimonial(index);
      });

      controlsContainer.appendChild(dot);
    });

    carouselContainer.appendChild(controlsContainer);

    // Auto-rotate testimonials
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    }, 5000);
  }

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.style.display = i === index ? "block" : "none";
    });

    // Update dots
    const dots = document.querySelectorAll(".carousel-dot");
    dots.forEach((dot, i) => {
      dot.style.backgroundColor =
        i === index ? "var(--primary-color)" : "var(--border-color)";
    });

    currentTestimonial = index;
  }

  // Animated counter for waitlist
  const counter = document.querySelector(".counter-number");

  if (counter) {
    const targetCount = parseInt(counter.textContent);
    let currentCount = 0;
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms
    const increment = Math.ceil(targetCount / (duration / interval));

    const counterAnimation = setInterval(() => {
      currentCount += increment;

      if (currentCount >= targetCount) {
        currentCount = targetCount;
        clearInterval(counterAnimation);
      }

      counter.textContent = currentCount;
    }, interval);
  }

  // Add scroll reveal animation with improved performance
  const revealElements = document.querySelectorAll(
    ".feature-card, .step, .plan-card, .point"
  );

  function checkReveal() {
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 50) {
        element.classList.add("revealed");
      }
    });
  }

  // Initialize reveal elements with CSS classes instead of inline styles
  revealElements.forEach((element) => {
    element.classList.add("reveal-element");
  });

  // Immediately reveal elements that are already in view
  setTimeout(checkReveal, 100);

  // Check on load and scroll
  window.addEventListener("load", checkReveal);
  window.addEventListener("scroll", checkReveal);
});
