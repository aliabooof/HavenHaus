import { add, GetCartByID, GetProductByID } from "../modules/db.js";
import { getFormFields, GetUrlField, redirect } from "../util.js";
import { fetchComponent, convertToHtmlElement } from "../util.js";
import { User } from "../modules/userModule.js";
import { Component } from "../componentModules/components.js";
import { Auth } from "../modules/authModule.js";
import { Validation } from "../modules/validation.js";

await Component.renderNavbar();
await Component.renderFooter();
await Component.renderCartOffcanvas();

function validateCheckout(firstName, lastName, email, phone, address, city, country, zip, cname, cnumber, expiryDate, ccv) {
  let isValid = true;
  let firstInvalidField = null;

  if (!Validation.validateName(firstName.value)) {
    Validation.showError(firstName, "Enter a valid first name.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = firstName;
  } else {
    Validation.clearError(firstName);
  }

  if (!Validation.validateName(lastName.value)) {
    Validation.showError(lastName, "Enter a valid last name.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = lastName;
  } else {
    Validation.clearError(lastName);
  }

  if (!Validation.validateEmail(email.value)) {
    Validation.showError(email, "Enter a valid email address.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = email;
  } else {
    Validation.clearError(email);
  }

  if (!Validation.validatePhone(phone.value)) {
    Validation.showError(phone, "Enter a valid phone number.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = phone;
  } else {
    Validation.clearError(phone);
  }

  if (!Validation.validateAddress(address.value)) {
    Validation.showError(address, "Address is too short.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = address;
  } else {
    Validation.clearError(address);
  }

  if (!Validation.validateCity(city.value)) {
    Validation.showError(city, "Enter a valid city.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = city;
  } else {
    Validation.clearError(city);
  }

  if (!Validation.validateCountry(country.value)) {
    Validation.showError(country, "Enter a valid country.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = country;
  } else {
    Validation.clearError(country);
  }

  if (!Validation.validateZipCode(zip.value)) {
    Validation.showError(zip, "Enter a valid zip code.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = zip;
  } else {
    Validation.clearError(zip);
  }

  if (!Validation.validateCreditCard(cnumber.value)) {
    Validation.showError(cnumber, "Enter a valid credit card number.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = cnumber;
  } else {
    Validation.clearError(cnumber);
  }

  if (!Validation.validateName(cname.value)) {
    Validation.showError(cname, "Enter a valid card name.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = cname;
  } else {
    Validation.clearError(cname);
  }

  if (!Validation.validateExpiryDate(expiryDate.value)) {
    Validation.showError(expiryDate, "Enter a valid expiry date.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = expiryDate;
  } else {
    Validation.clearError(expiryDate);
  }

  if (!Validation.validateCVV(ccv.value)) {
    Validation.showError(ccv, "Enter a valid CVV.");
    isValid = false;
    if (!firstInvalidField) firstInvalidField = ccv;
  } else {
    Validation.clearError(ccv);
  }

  if (!isValid && firstInvalidField) {
    firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
    firstInvalidField.focus();
  }

  return isValid;
}

function createSummaryItem(cartItem) {
  let product = GetProductByID(cartItem.productID)[0];
  let summaryItemHtml = convertToHtmlElement(summaryItemHtmlString);
  summaryItemHtml.querySelector("#price").innerText = (product.price * cartItem.quantity).toFixed(2);
  summaryItemHtml.querySelector("#quantity").innerText = cartItem.quantity;
  summaryItemHtml.querySelector("#prod-name").innerText = product.name;
  summaryItemHtml.querySelector("#desc").innerText = product.desc;
  return summaryItemHtml;
}

if (!Auth.isLoggedIn())
  redirect("../login.html");

let currUser = User.getCurrentUser();
let userID = currUser.id;

let summaryItemHtmlString = await fetchComponent("../components/checkout-summary-item.html");
let cart = GetCartByID(userID);

let emtpyElement = document.getElementById("empty");
let innerContainer = document.getElementById("inner-container");
if (cart.length == 0) {
  emtpyElement.classList.remove("d-none");
  emtpyElement.classList.add("d-flex");
} else {
  innerContainer.classList.remove("d-none");
  let totalPrice = 0;
  cart.forEach(item => {
    let summaryItemContainer = document.getElementById("ordersummary");
    let summaryItem = createSummaryItem(item);
    summaryItemContainer.appendChild(summaryItem);
    totalPrice += Number(summaryItem.querySelector("#price").innerText.trim());
  });
  totalPrice = totalPrice.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
  document.getElementById("subtotal").innerText = totalPrice;
  document.getElementById("total-price").innerText = totalPrice;
}

const form = document.getElementById("checkoutform");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const country = document.getElementById("country");
  const zip = document.getElementById("zip");
  const cnumber = document.getElementById("cnumber");
  const cname = document.getElementById("cname");
  const expiryDate = document.getElementById("expiryDate");
  const ccv = document.getElementById("ccv");

  if (validateCheckout(firstName, lastName, email, phone, address, city, country, zip, cname, cnumber, expiryDate, ccv)) {
    alert("Checkout successful!");
    form.submit();
  }
});
