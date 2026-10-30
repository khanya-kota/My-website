/* Green Roots Organics — Part 3 interactive features and custom form validation. */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Responsive navigation menu.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "Close" : "Menu";
    });
    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "Menu";
      });
    });
  }

  // Product catalogue: keyword search, category filtering and sorting.
  const productGrid = document.querySelector("#product-grid");
  if (productGrid) {
    const cards = Array.from(productGrid.querySelectorAll(".product-card"));
    const searchInput = document.querySelector("#product-search");
    const sortSelect = document.querySelector("#product-sort");
    const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
    const resultCount = document.querySelector("#product-count");
    const emptyMessage = document.querySelector("#no-products");
    let selectedCategory = "all";

    const updateProducts = () => {
      const searchTerm = (searchInput?.value || "").trim().toLocaleLowerCase();
      const visibleCards = [];

      cards.forEach(card => {
        const matchesCategory = selectedCategory === "all" || card.dataset.category === selectedCategory;
        const searchableText = (card.dataset.name + " " + card.textContent).toLocaleLowerCase();
        const matchesSearch = searchableText.includes(searchTerm);
        card.hidden = !(matchesCategory && matchesSearch);
        if (!card.hidden) visibleCards.push(card);
      });

      const sortOrder = sortSelect?.value || "default";
      visibleCards.sort((first, second) => {
        if (sortOrder === "az") return (first.dataset.name || "").localeCompare(second.dataset.name || "");
        if (sortOrder === "za") return (second.dataset.name || "").localeCompare(first.dataset.name || "");
        return cards.indexOf(first) - cards.indexOf(second);
      });
      visibleCards.forEach(card => productGrid.appendChild(card));

      if (resultCount) {
        resultCount.textContent = visibleCards.length === 1
          ? "Showing 1 product"
          : "Showing " + visibleCards.length + " of " + cards.length + " products";
      }
      if (emptyMessage) emptyMessage.hidden = visibleCards.length !== 0;
    };

    searchInput?.addEventListener("input", updateProducts);
    sortSelect?.addEventListener("change", updateProducts);
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        selectedCategory = button.dataset.filter || "all";
        filterButtons.forEach(item => {
          const isSelected = item === button;
          item.classList.toggle("active", isSelected);
          item.setAttribute("aria-pressed", String(isSelected));
        });
        updateProducts();
      });
    });
    updateProducts();
  }

  // Site-wide image lightbox. Any meaningful page image opens at a larger size.
  const pageImages = Array.from(document.querySelectorAll("main img"))
    .filter(image => image.id !== "lightbox-image" && image.getAttribute("src"));
  let activeImageIndex = 0;
  let lastFocusedElement = null;
  let lightbox = document.querySelector("#image-lightbox");

  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "image-lightbox";
    lightbox.className = "lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image preview");
    lightbox.innerHTML = `
      <div class="lightbox-panel">
        <button class="lightbox-close" type="button" aria-label="Close image preview">&times;</button>
        <button class="lightbox-previous" type="button" aria-label="Previous image">&#10094;</button>
        <figure><img id="lightbox-image" src="" alt=""><figcaption class="lightbox-caption"></figcaption></figure>
        <button class="lightbox-next" type="button" aria-label="Next image">&#10095;</button>
        <p class="lightbox-help">Use the arrow keys to browse. Press Escape to close.</p>
      </div>`;
    document.body.appendChild(lightbox);
  }

  const previewImage = lightbox.querySelector("#lightbox-image");
  const previewCaption = lightbox.querySelector(".lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  let previousButton = lightbox.querySelector(".lightbox-previous");
  let nextButton = lightbox.querySelector(".lightbox-next");

  // Add navigation controls to the existing product-page lightbox if needed.
  const panel = lightbox.querySelector(".lightbox-panel") || lightbox;
  if (!previousButton) {
    previousButton = document.createElement("button");
    previousButton.className = "lightbox-previous";
    previousButton.type = "button";
    previousButton.setAttribute("aria-label", "Previous image");
    previousButton.textContent = "‹";
    panel.appendChild(previousButton);
  }
  if (!nextButton) {
    nextButton = document.createElement("button");
    nextButton.className = "lightbox-next";
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "Next image");
    nextButton.textContent = "›";
    panel.appendChild(nextButton);
  }
  if (!previewCaption) {
    const caption = document.createElement("p");
    caption.className = "lightbox-caption";
    panel.appendChild(caption);
  }
  const captionElement = lightbox.querySelector(".lightbox-caption");

  const showImage = index => {
    if (!pageImages.length || !previewImage) return;
    activeImageIndex = (index + pageImages.length) % pageImages.length;
    const source = pageImages[activeImageIndex];
    previewImage.src = source.currentSrc || source.src;
    previewImage.alt = source.alt || "Enlarged website image";
    if (captionElement) captionElement.textContent = source.alt || "";
    lightbox.hidden = false;
    closeButton?.focus();
  };
  const closeImage = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (previewImage) previewImage.removeAttribute("src");
    lastFocusedElement?.focus();
  };

  pageImages.forEach((image, index) => {
    image.style.cursor = "zoom-in";
    image.setAttribute("tabindex", "0");
    image.setAttribute("aria-label", "Open larger image: " + (image.alt || "image"));
    image.addEventListener("click", event => {
      event.preventDefault();
      lastFocusedElement = image;
      showImage(index);
    });
    image.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        lastFocusedElement = image;
        showImage(index);
      }
    });
  });

  closeButton?.addEventListener("click", closeImage);
  previousButton.addEventListener("click", () => showImage(activeImageIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeImageIndex + 1));
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeImage();
  });
  document.addEventListener("keydown", event => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeImage();
    if (event.key === "ArrowLeft") showImage(activeImageIndex - 1);
    if (event.key === "ArrowRight") showImage(activeImageIndex + 1);
  });

  // Shared helpers for custom JavaScript-only form validation.
  const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validPhone = value => /^[0-9+() -]{7,20}$/.test(value);
  const setFieldError = (form, field, message) => {
    if (!field) return;
    let error = form.querySelector("#" + field.id + "-error");
    if (!error) {
      error = document.createElement("small");
      error.className = "field-error";
      error.id = field.id + "-error";
      error.setAttribute("aria-live", "polite");
      field.insertAdjacentElement("afterend", error);
    }
    error.textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
  };
  const validateFields = (form, definitions) => {
    let firstInvalid = null;
    definitions.forEach(definition => {
      const field = form.querySelector(definition.selector);
      if (!field) return;
      const value = field.value.trim();
      let message = value ? "" : "Please complete this field.";\n      if (!message && field.checkValidity && !field.checkValidity()) {\n        message = field.validity.typeMismatch ? "Please enter a valid email address." :\n          field.validity.tooShort ? "Please enter more characters." :\n          field.validity.tooLong ? "Please shorten this entry." :\n          field.validity.patternMismatch ? "Please use the requested format." : "Please check this field.";\n      }
      if (value && definition.validate && !definition.validate(value)) message = definition.error;
      if (message && !firstInvalid) firstInvalid = field;
      setFieldError(form, field, message);
    });
    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return !firstInvalid;
  };

  // Product enquiry: collect product, quantity and delivery details and give a relevant response.
  const enquiryForm = document.querySelector("#enquiry-form");
  if (enquiryForm) {
    enquiryForm.noValidate = true; // Keep browser pop-ups off; HTML5 constraints are checked through the Validity API below.
    const productFromLink = new URLSearchParams(window.location.search).get("product");
    const enquiryMessage = enquiryForm.querySelector("#message");
    if (productFromLink && enquiryMessage && !enquiryMessage.value) {
      enquiryMessage.value = "I would like to enquire about " + productFromLink + ". ";
    }

    const enquiryDefinitions = [
      { selector: "#name" },
      { selector: "#email", validate: validEmail, error: "Please enter a valid email address." },
      { selector: "#phone", validate: validPhone, error: "Please enter a valid phone number." },
      { selector: "#enquiry" },
      { selector: "#area" },
      { selector: "#message", validate: value => value.length >= 10, error: "Please enter at least 10 characters." }
    ];

    enquiryForm.querySelectorAll("input, select, textarea").forEach(field => {
      field.addEventListener("input", () => {
        const error = enquiryForm.querySelector("#" + field.id + "-error");
        if (error && field.value.trim()) setFieldError(enquiryForm, field, "");
      });
      field.addEventListener("change", () => {
        const error = enquiryForm.querySelector("#" + field.id + "-error");
        if (error && field.value.trim()) setFieldError(enquiryForm, field, "");
      });
    });

    enquiryForm.addEventListener("submit", event => {
      event.preventDefault();
      const feedback = enquiryForm.querySelector("#enquiry-feedback");
      const isValid = validateFields(enquiryForm, enquiryDefinitions);
      if (!isValid) {
        if (feedback) feedback.textContent = "";
        return;
      }
      if (feedback) {
        feedback.textContent = "Thank you, " + enquiryForm.querySelector("#name").value.trim() +
          ". Your " + enquiryForm.querySelector("#enquiry").value.toLowerCase() +
          " enquiry has been checked. Green Roots Organics will need to confirm current stock, prices and delivery availability before an order is finalised.";
      }
    });
  }

  // General contact: prepare a message for the organisation's configured email recipient.
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.noValidate = true; // Keep browser pop-ups off; HTML5 constraints are checked through the Validity API below.
    const contactDefinitions = [
      { selector: "#contact-name" },
      { selector: "#contact-email", validate: validEmail, error: "Please enter a valid email address." },
      { selector: "#message-type" },
      { selector: "#contact-message", validate: value => value.length >= 10, error: "Please enter at least 10 characters." }
    ];

    contactForm.querySelectorAll("input, select, textarea").forEach(field => {
      field.addEventListener("input", () => {
        const error = contactForm.querySelector("#" + field.id + "-error");
        if (error && field.value.trim()) setFieldError(contactForm, field, "");
      });
      field.addEventListener("change", () => {
        const error = contactForm.querySelector("#" + field.id + "-error");
        if (error && field.value.trim()) setFieldError(contactForm, field, "");
      });
    });

    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const feedback = contactForm.querySelector("#contact-feedback");
      const isValid = validateFields(contactForm, contactDefinitions);
      const phone = contactForm.querySelector("#contact-phone");
      if (phone && phone.value.trim() && !validPhone(phone.value.trim())) {
        setFieldError(contactForm, phone, "Please enter a valid phone number or leave this field blank.");
        if (isValid) {
          phone.focus();
          phone.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (feedback) feedback.textContent = "";
        return;
      }
      if (!isValid) {
        if (feedback) feedback.textContent = "";
        return;
      }

      const recipient = "YOUR_BUSINESS_EMAIL@example.com";
      if (recipient === "YOUR_BUSINESS_EMAIL@example.com") {
        if (feedback) feedback.textContent = "Your message is valid. The business email address must be configured before it can be prepared for sending.";
        return;
      }

      const formData = new FormData(contactForm);
      const subject = encodeURIComponent("Green Roots Organics - " + formData.get("messageType"));
      const body = encodeURIComponent(
        "Name: " + formData.get("name") +
        "\nEmail: " + formData.get("email") +
        "\nPhone: " + (formData.get("phone") || "Not supplied") +
        "\nMessage type: " + formData.get("messageType") +
        "\n\nMessage:\n" + formData.get("message")
      );
      window.location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
      if (feedback) feedback.textContent = "Your email application should open with your message ready to review and send.";
    });
  }
});
