// Form validation and handling
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("jobApplicationForm");
  const messageTextarea = document.getElementById("message");
  const characterCount = document.querySelector(".character-count");
  const fileInput = document.getElementById("resume");
  const fileName = document.querySelector(".file-name");
  const startDateInput = document.getElementById("startDate");

  // Set minimum date for start date (today)
  const today = new Date().toISOString().split("T")[0];
  startDateInput.setAttribute("min", today);

  // Validation patterns
  const validationRules = {
    fullName: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      message: "Please enter a valid name (2-50 characters, letters only)",
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    phone: {
      pattern: /^[\d\s\+\-\(\)]{10,}$/,
      message: "Please enter a valid phone number (minimum 10 digits)",
    },
    linkedin: {
      pattern: /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i,
      message: "Please enter a valid LinkedIn URL",
    },
    portfolio: {
      pattern: /^(https?:\/\/)?(www\.)?[\w\-]+\.[\w\-\.]+.*$/i,
      message: "Please enter a valid URL",
    },
    experience: {
      min: 0,
      max: 50,
      message: "Experience must be between 0 and 50 years",
    },
    message: {
      minLength: 0,
      maxLength: 1000,
      message: "Message must be between 0 and 1000 characters",
    },
  };

  // Character counter for message
  messageTextarea.addEventListener("input", function () {
    const length = this.value.length;
    characterCount.textContent = `${length} / 1000 characters`;

    if (length > 1000) {
      this.value = this.value.substring(0, 1000);
      characterCount.textContent = "1000 / 1000 characters";
    }
  });

  // File input handling
  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      const file = this.files[0];
      const fileSize = file.size / 1024 / 1024; // Convert to MB

      if (fileSize > 5) {
        showError(this, "File size must be less than 5MB");
        this.value = "";
        fileName.textContent = "No file chosen";
      } else {
        fileName.textContent = file.name;
        clearError(this);
      }
    } else {
      fileName.textContent = "No file chosen";
    }
  });

  // Real-time validation for each field
  const formInputs = form.querySelectorAll(
    'input:not([type="file"]):not([type="checkbox"]), select, textarea'
  );
  formInputs.forEach((input) => {
    // Validate on blur (when user leaves the field)
    input.addEventListener("blur", function () {
      if (this.value.trim() !== "" || this.hasAttribute("required")) {
        validateField(this);
      }
    });

    // Clear error on input
    input.addEventListener("input", function () {
      if (this.classList.contains("error")) {
        clearError(this);
      }
    });
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    const formData = new FormData(form);

    // Validate all fields
    formInputs.forEach((input) => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    // Validate file upload
    if (!fileInput.files.length) {
      showError(fileInput, "Please upload your resume");
      isValid = false;
    }

    // Validate terms checkbox
    const termsCheckbox = document.getElementById("terms");
    if (!termsCheckbox.checked) {
      showError(termsCheckbox, "You must agree to the terms and conditions");
      isValid = false;
    }

    if (isValid) {
      // Show loading state
      const submitBtn = form.querySelector(".btn-primary");
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting... <span class="btn-icon">⏳</span>';

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        // Log form data (in production, send to server)
        console.log("Form submitted successfully!");
        console.log("Form Data:");
        for (let [key, value] of formData.entries()) {
          if (key === "resume") {
            console.log(
              `${key}: ${value.name} (${(value.size / 1024).toFixed(2)} KB)`
            );
          } else {
            console.log(`${key}: ${value}`);
          }
        }

        // Hide form and show success message with smooth transition
        form.style.opacity = "0";
        form.style.transform = "translateY(-20px)";

        setTimeout(() => {
          form.style.display = "none";
          const successMsg = document.getElementById("successMessage");
          successMsg.style.display = "block";

          // Trigger animation
          setTimeout(() => {
            successMsg.style.opacity = "1";
            successMsg.style.transform = "translateY(0)";
          }, 10);
        }, 300);

        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 2000);
    } else {
      // Scroll to first error
      const firstError = form.querySelector(".error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  // Reset form handler
  form.addEventListener("reset", function () {
    // Clear all error messages
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => {
      msg.textContent = "";
      msg.classList.remove("show");
    });

    // Remove error and success classes
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.classList.remove("error", "success");
    });

    // Reset file input display
    fileName.textContent = "No file chosen";

    // Reset character count
    characterCount.textContent = "0 / 1000 characters";
  });

  // Validation function for individual fields
  function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();

    // Skip validation for optional fields that are empty
    if (!field.hasAttribute("required") && value === "") {
      clearError(field);
      return true;
    }

    // Check if field is required and empty
    if (field.hasAttribute("required") && value === "") {
      showError(field, "This field is required");
      return false;
    }

    // Specific field validations
    switch (fieldName) {
      case "fullName":
        if (!validationRules.fullName.pattern.test(value)) {
          showError(field, validationRules.fullName.message);
          return false;
        }
        break;

      case "email":
        if (!validationRules.email.pattern.test(value)) {
          showError(field, validationRules.email.message);
          return false;
        }
        break;

      case "phone":
        if (!validationRules.phone.pattern.test(value)) {
          showError(field, validationRules.phone.message);
          return false;
        }
        break;

      case "linkedin":
        if (value !== "" && !validationRules.linkedin.pattern.test(value)) {
          showError(field, validationRules.linkedin.message);
          return false;
        }
        break;

      case "portfolio":
        if (value !== "" && !validationRules.portfolio.pattern.test(value)) {
          showError(field, validationRules.portfolio.message);
          return false;
        }
        break;

      case "experience":
        const exp = parseInt(value);
        if (
          isNaN(exp) ||
          exp < validationRules.experience.min ||
          exp > validationRules.experience.max
        ) {
          showError(field, validationRules.experience.message);
          return false;
        }
        break;

      case "message":
        if (value.length < validationRules.message.minLength) {
          showError(
            field,
            `Message must be at least ${validationRules.message.minLength} characters`
          );
          return false;
        }
        if (value.length > validationRules.message.maxLength) {
          showError(
            field,
            `Message must not exceed ${validationRules.message.maxLength} characters`
          );
          return false;
        }
        break;

      case "position":
        if (value === "") {
          showError(field, "Please select a position");
          return false;
        }
        break;

      case "startDate":
        const selectedDate = new Date(value);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
          showError(field, "Start date must be today or in the future");
          return false;
        }
        break;
    }

    // If all validations pass
    clearError(field);
    field.classList.add("success");
    return true;
  }

  // Show error message
  function showError(field, message) {
    field.classList.add("error");
    field.classList.remove("success");

    const errorElement = field
      .closest(".form-group")
      .querySelector(".error-message");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
    }
  }

  // Clear error message
  function clearError(field) {
    field.classList.remove("error");

    const errorElement = field
      .closest(".form-group")
      .querySelector(".error-message");
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("show");
    }
  }
});
