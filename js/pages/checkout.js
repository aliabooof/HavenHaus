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

  const fields = [
    { field: firstName, validator: Validation.validateName, message: "Enter a valid first name." },
    { field: lastName, validator: Validation.validateName, message: "Enter a valid last name." },
    { field: email, validator: Validation.validateEmail, message: "Enter a valid email address." },
    { field: phone, validator: Validation.validatePhone, message: "Enter a valid phone number." },
    { field: address, validator: Validation.validateAddress, message: "Address is too short." },
    { field: city, validator: Validation.validateCity, message: "Enter a valid city." },
    { field: country, validator: Validation.validateCountry, message: "Enter a valid country." },
    { field: zip, validator: Validation.validateZipCode, message: "Enter a valid zip code." },
    { field: cnumber, validator: Validation.validateCreditCard, message: "Enter a valid credit card number." },
    { field: cname, validator: Validation.validateName, message: "Enter a valid card name." },
    { field: expiryDate, validator: Validation.validateExpiryDate, message: "Enter a valid expiry date." },
    { field: ccv, validator: Validation.validateCVV, message: "Enter a valid ccv." }
  ];

  for (const { field, validator, message } of fields) {
    if (!validator(field.value)) {
      Validation.showError(field, message);
      isValid = false;
      if (!firstInvalidField) firstInvalidField = field;
    } else {
      Validation.clearError(field);
    }
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
