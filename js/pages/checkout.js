// Import Modules
import { add, GetCartByID, GetProductByID } from "../modules/db.js";
import { createAlert, getFormFields, GetUrlField, redirect, fetchComponent, convertToHtmlElement, getFormInputs } from "../util.js";
import { User } from "../modules/userModule.js";
import { Component } from "../componentModules/components.js";
import { Auth } from "../modules/authModule.js";
import { Validation } from "../modules/validation.js";
import { LoadDB } from "../load_db.js";

await LoadDB()
Auth.enforcePageAuthorization();


await Component.renderNavbar();
await Component.renderFooter();
await Component.renderCartOffcanvas();



const currentUser = User.getCurrentUser();
const cart = GetCartByID(currentUser.id);

// Utility Functions

// function validateCheckout() {
//   let isValid = true;
//   let firstInvalidField = null;
// }


let currUser = User.getCurrentUser();
let userID = currUser.id;


// Utility Functions
function GoToCart(event){
  redirect("../../pages/cart.html")
}
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


let creditCardRadio = document.getElementById('pmethod-ccard');
let cashRadio = document.getElementById('cash');
let creditCardDetails = document.getElementById('credit-card-fields');


function toggleCreditCardDetails() {
  creditCardDetails.style.display = creditCardRadio.checked ? 'block' : 'none';
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


creditCardRadio.addEventListener('change', toggleCreditCardDetails);
cashRadio.addEventListener('change', toggleCreditCardDetails);

const checkoutForm = document.getElementById("checkoutform");
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let formInputs = getFormInputs(checkoutForm);
  const validationRules = Validation.checkoutRuls(formInputs,creditCardRadio.checked)
  if (!(Validation.validateForm(checkoutForm, validationRules))) return;
  
  
    createAlert("Successfully ordered", "success");
    checkoutForm.submit();

});

const backToCartBtn= document.getElementById("back-to-cart");
backToCartBtn.addEventListener('click', GoToCart);

await renderCartSummary();
toggleCreditCardDetails();


