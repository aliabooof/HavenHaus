
import { redirect, createAlert, getFormFields } from "../util.js";
import { Auth } from "../modules/authModule.js";
import { Validation } from "../modules/validation.js";

function validateRegistration( firstName, lastName, email, phone, password ) {
  let isValid = true;
  console.log("heey");
  console.log(firstName.value)

  if (!Validation.validateName(firstName.value)) {
    Validation.showError(firstName, "First name is required (e.g., Ahmed)");
    isValid = false;
  } else {
    Validation.clearError(firstName);
  }

  if (!Validation.validateName(lastName.value)) {
    Validation.showError(lastName, "Last name is required (e.g., Ali)");
    isValid = false;
  } else {
    Validation.clearError(lastName);
  }

  if (!Validation.validateEmail(email.value)) {
    Validation.showError(email, "Enter a valid email address (e.g., user@example.com)");
    isValid = false;
  } else {
    Validation.clearError(email);
  }

  if (phone.value.trim() !== "" && !Validation.validatePhone(phone.value)) {
    Validation.showError(phone, "Phone must be 10 to 15 digits (e.g., 0123456789)");
    isValid = false;
  } else {
    Validation.clearError(phone);
  }

  if (!Validation.validatePassword(password.value)) {
    Validation.showError(password, "Password must be at least 6 characters (e.g., 123456)");
    isValid = false;
  } else {
    Validation.clearError(password);
  }

  return isValid;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerform');
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const userType = document.getElementById("userType");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = getFormFields("registerform"); 

    let flag = validateRegistration(firstName,lastName,email,phone,password)
    if (!flag) return;

    if (Auth.register(data)) {
      const alert = createAlert(
        "You have been registered successfully!",
        "success",
        "You will be redirected to the login page in 5 seconds."
      );

      Array.from(form.elements).forEach(element => element.disabled = true);

      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        redirect(form.getAttribute('action'));
      }, 5000);
    } else {
      const alert = createAlert("Account already exists!", "warning");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => alert.remove(), 5000);
    }
  });
});
