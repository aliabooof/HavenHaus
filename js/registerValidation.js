// vaidation 


  
  
  
// vaidation 

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePhone(phone) {
  const regex = /^\d{10,15}$/;
  return regex.test(phone);
}

function showError(input, message) {
  input.classList.add("is-invalid");

  let error = input.nextElementSibling;
  if (!error || !error.classList.contains("invalid-feedback")) {
    error = document.createElement("div");
    error.className = "invalid-feedback";
    input.parentNode.appendChild(error);
  }

  error.textContent = message;
}

function clearError(input) {
  input.classList.remove("is-invalid");

  let error = input.nextElementSibling;
  if (error && error.classList.contains("invalid-feedback")) {
    error.textContent = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerform");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const userType = document.getElementById("userType");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");

    let isValid = true;

    // First Name
    if (firstName.value.trim() === "") {
      showError(firstName, "First name is required (e.g., Ahmed)");
      isValid = false;
    } else {
      clearError(firstName);
    }

    // Last Name
    if (lastName.value.trim() === "") {
      showError(lastName, "Last name is required (e.g., Ali)");
      isValid = false;
    } else {
      clearError(lastName);
    }

    // Email
    if (!validateEmail(email.value)) {
      showError(email, "Enter a valid email address (e.g., user@example.com)");
      isValid = false;
    } else {
      clearError(email);
    }

    // User Type
    if (!userType.value) {
      showError(userType, "Please select an account type (e.g., Customer)");
      isValid = false;
    } else {
      clearError(userType);
    }

    // Phone
    if (phone.value.trim() !== "" && !validatePhone(phone.value)) {
      showError(phone, "Phone must be 10 to 15 digits (e.g., 0123456789)");
      isValid = false;
    } else {
      clearError(phone);
    }

    // Password
    if (password.value.length < 6) {
      showError(password, "Password must be at least 6 characters (e.g., 123456)");
      isValid = false;
    } else {
      clearError(password);
    }

    if (isValid) {
      alert("Account created successfully!");
      form.submit(); // or form.reset() if you don't want to submit
    }
  });
});
  
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerform");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const firstName = document.getElementById("firstName");
      const lastName = document.getElementById("lastName");
      const email = document.getElementById("email");
      const userType = document.getElementById("userType");
      const phone = document.getElementById("phone");
      const password = document.getElementById("password");
  
      let isValid = true;
  
      // First Name
      if (firstName.value.trim() === "") {
        showError(firstName, "First name is required (e.g., Ahmed)");
        isValid = false;
      } else {
        clearError(firstName);
      }
  
      // Last Name
      if (lastName.value.trim() === "") {
        showError(lastName, "Last name is required (e.g., Ali)");
        isValid = false;
      } else {
        clearError(lastName);
      }
  
      // Email
      if (!validateEmail(email.value)) {
        showError(email, "Enter a valid email address (e.g., user@example.com)");
        isValid = false;
      } else {
        clearError(email);
      }
  
      // User Type
      if (!userType.value) {
        showError(userType, "Please select an account type (e.g., Customer)");
        isValid = false;
      } else {
        clearError(userType);
      }
  
      // Phone
      if (phone.value.trim() !== "" && !validatePhone(phone.value)) {
        showError(phone, "Phone must be 10 to 15 digits (e.g., 0123456789)");
        isValid = false;
      } else {
        clearError(phone);
      }
  
      // Password
      if (password.value.length < 6) {
        showError(password, "Password must be at least 6 characters (e.g., 123456)");
        isValid = false;
      } else {
        clearError(password);
      }
  
      if (isValid) {
        alert("Account created successfully!");
        form.submit(); // or form.reset() if you don't want to submit
      }
    });
  });
  