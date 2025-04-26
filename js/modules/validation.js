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

  static validateAddress(address) {
    const regex = /^[A-Za-z0-9\s,'-.]{5,100}$/;
    return typeof address === 'string' && regex.test(address.trim());
  }

  static validateCity(city) {
    const regex = /^[A-Za-z\s'-]{2,50}$/;
    return typeof city === 'string' && regex.test(city.trim());
  }

  static validateCountry(country) {
    const regex = /^[A-Za-z\s'-]{2,50}$/;
    return typeof country === 'string' && regex.test(country.trim());
  }

  static validateZipCode(zip) {
    const regex = /^(\d{5}(-\d{4})?|[A-Za-z0-9\s]{4,10})$/;
    return typeof zip === 'string' && regex.test(zip.trim());
  }

  static validateCreditCard(cardNumber) {
    const regex = /^\d{16}$/;
    if (typeof cardNumber !== 'string' || !regex.test(cardNumber.trim())) return false;
    return this.luhnCheck(cardNumber);
  }

  static luhnCheck(cardNumber) {
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  static validateExpiryDate(expiry) {

    // works well with this html line 
    // <label for="expiry">Expiry Date</label>
{/* <input type="month" id="expiry" name="expiry" min="2025-04" required></input> */}
    
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (typeof expiry !== 'string' || !regex.test(expiry.trim())) return false;

    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    let year = parseInt(yearStr, 10);
    year = year < 100 ? 2000 + year : year; 

    const now = new Date();
    const expiryDate = new Date(year, month);

    return expiryDate > now;
  }

  static validateCVV(cvv) {
    const regex = /^\d{3,4}$/;
    return typeof cvv === 'string' && regex.test(cvv.trim());
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
