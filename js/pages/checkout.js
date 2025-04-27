// Import Modules
import { add, GetCartByID, GetProductByID } from "../modules/db.js";
import { createAlert, getFormFields, GetUrlField, redirect, fetchComponent, convertToHtmlElement } from "../util.js";
import { User } from "../modules/userModule.js";
import { Component } from "../componentModules/components.js";
import { Auth } from "../modules/authModule.js";
import { Validation } from "../modules/validation.js";

// Render Layout Components
await Component.renderNavbar();
await Component.renderFooter();
await Component.renderCartOffcanvas();

// DOM Elements
const fields = {
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  address: document.getElementById("address"),
  city: document.getElementById("city"),
  country: document.getElementById("country"),
  zip: document.getElementById("zip"),
  cnumber: document.getElementById("cnumber"),
  cname: document.getElementById("cname"),
  expiryDate: document.getElementById("expiryDate"),
  ccv: document.getElementById("ccv"),
  creditCardRadio: document.getElementById('pmethod-ccard'),
  cashRadio: document.getElementById('cash'),
  creditCardDetails: document.getElementById('credit-card-fields')
};

// Authentication Check
if (!Auth.isLoggedIn()) {
  redirect("../login.html");
}

const currentUser = User.getCurrentUser();
const cart = GetCartByID(currentUser.id);

// Utility Functions

function validateCheckout() {
  let isValid = true;
  let firstInvalidField = null;

  const validations = [
    { field: fields.firstName, method: Validation.validateName, message: "Enter a valid first name." },
    { field: fields.lastName, method: Validation.validateName, message: "Enter a valid last name." },
    { field: fields.email, method: Validation.validateEmail, message: "Enter a valid email address." },
    { field: fields.phone, method: Validation.validatePhone, message: "Enter a valid phone number." },
    { field: fields.address, method: Validation.validateAddress, message: "Address is too short." },
    { field: fields.city, method: Validation.validateCity, message: "Enter a valid city." },
    { field: fields.country, method: Validation.validateCountry, message: "Enter a valid country." },
    { field: fields.zip, method: Validation.validateZipCode, message: "Enter a valid zip code." }
  ];

  // Credit Card Validations (if selected)
  if (fields.creditCardRadio.checked) {
    validations.push(
      { field: fields.cnumber, method: Validation.validateCreditCard, message: "Enter a valid credit card number." },
      { field: fields.cname, method: Validation.validateName, message: "Enter a valid cardholder name." },
      { field: fields.expiryDate, method: Validation.validateExpiryDate, message: "Enter a valid expiry date." },
      { field: fields.ccv, method: Validation.validateCVV, message: "Enter a valid CVV." }
    );
  }

  // Run validations
  validations.forEach(({ field, method, message }) => {
    if (!method(field.value)) {
      Validation.showError(field, message);
      isValid = false;
      if (!firstInvalidField) firstInvalidField = field;
    } else {
      Validation.clearError(field);
    }
  });

  if (!isValid && firstInvalidField) {
    firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
    firstInvalidField.focus();
  }

  return isValid;
}

function toggleCreditCardDetails() {
  fields.creditCardDetails.style.display = fields.creditCardRadio.checked ? 'block' : 'none';
}

function createSummaryItem(cartItem, summaryItemTemplate) {
  const product = GetProductByID(cartItem.productID)[0];
  const summaryItemElement = convertToHtmlElement(summaryItemTemplate);

  summaryItemElement.querySelector("#price").innerText = (product.price * cartItem.quantity).toFixed(2);
  summaryItemElement.querySelector("#quantity").innerText = cartItem.quantity;
  summaryItemElement.querySelector("#prod-name").innerText = product.name;
  summaryItemElement.querySelector("#desc").innerText = product.desc;

  return summaryItemElement;
}

async function renderCartSummary() {
  const summaryItemTemplate = await fetchComponent("../components/checkout-summary-item.html");

  const emptyElement = document.getElementById("empty");
  const container = document.getElementById("inner-container");

  if (cart.length === 0) {
    emptyElement.classList.replace("d-none", "d-flex");
    return;
  }

  container.classList.remove("d-none");

  let totalPrice = 0;
  const summaryContainer = document.getElementById("ordersummary");

  cart.forEach(item => {
    const summaryItem = createSummaryItem(item, summaryItemTemplate);
    summaryContainer.appendChild(summaryItem);
    totalPrice += parseFloat(summaryItem.querySelector("#price").innerText);
  });

  const formattedTotal = totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("subtotal").innerText = formattedTotal;
  document.getElementById("total-price").innerText = formattedTotal;
}


fields.creditCardRadio.addEventListener('change', toggleCreditCardDetails);
fields.cashRadio.addEventListener('change', toggleCreditCardDetails);

const checkoutForm = document.getElementById("checkoutform");
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateCheckout()) {
    createAlert("Successfully ordered", "success");
    checkoutForm.submit();
  }
});


await renderCartSummary();
toggleCreditCardDetails();
