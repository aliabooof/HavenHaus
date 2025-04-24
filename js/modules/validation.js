export class Validation {
    static validateName(firstName) {
      const regex = /^[A-Za-z\s'-]{3,50}$/;
      return typeof firstName === 'string' && firstName.trim().length > 0 && regex.test(firstName);
    }
  
   
  
    static validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return typeof email === 'string' && regex.test(email);
    }
  
    static validatePassword(password, minLength = 6) {
      return typeof password === 'string' && password.length >= minLength;
    }
    static validatePhone(phone) {
        const regex = /^\d{10,15}$/;
        return typeof phone === 'string' && regex.test(phone);
    }

    static showError(input, message) {
        input.classList.add("is-invalid");
      
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains("invalid-feedback")) {
          error = document.createElement("div");
          error.className = "invalid-feedback";
          input.parentNode.appendChild(error);
        }
      
        error.textContent = message;
      }


    static clearError(input) {
        input.classList.remove("is-invalid");
      
        let error = input.nextElementSibling;
        if (error && error.classList.contains("invalid-feedback")) {
          error.textContent = "";
        }
      }
  }
  