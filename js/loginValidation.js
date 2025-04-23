// login Validation
document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const signInBtn = document.querySelector("button");
  
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/; 
  
    const showError = (input, message) => {
      let error = input.nextElementSibling;
      if (!error || !error.classList.contains("text-danger")) {
        error = document.createElement("div");
        error.className = "text-danger mt-1";
        input.parentNode.appendChild(error);
      }
      error.innerText = message;
      input.classList.add("is-invalid");
    };
  
    const clearError = (input) => {
      let error = input.parentNode.querySelector(".text-danger");
      if (error) error.remove();
      input.classList.remove("is-invalid");
    };
  
    const validate = () => {
      let isValid = true;
  
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, "Please enter a valid email (e.g. name@example.com)");
        isValid = false;
      } else {
        clearError(emailInput);
      }
  
      if (!passwordRegex.test(passwordInput.value.trim())) {
        showError(passwordInput, "Password must be at least 6 characters");
        isValid = false;
      } else {
        clearError(passwordInput);
      }
  
      return isValid;
    };
  
    signInBtn.addEventListener("click", (e) => {
      e.preventDefault(); 
      if (validate()) {
        
        console.log("Form is valid ");
        
      }
    });
  });
  