import {GetCartByID, GetProductByID} from "../modules/db.js";
import {GetUrlField, redirect} from "../util.js";
import {fetchComponent, convertToHtmlElement} from "../util.js"
import { User } from "../modules/userModule.js";
import { Component } from "../componentModules/components.js";
import { Auth } from "../modules/authModule.js";
  

await Component.renderNavbar();
await Component.renderFooter();
await Component.renderCartOffcanvas();

function createSummaryItem(cartItem){
    let product = GetProductByID(cartItem.productID)[0];
    let summaryItemHtml = convertToHtmlElement(summaryItemHtmlString)
    summaryItemHtml.querySelector("#price").innerText = (product.price * cartItem.quantity).toFixed(2)
    summaryItemHtml.querySelector("#quantity").innerText = cartItem.quantity
    summaryItemHtml.querySelector("#prod-name").innerText = product.name
    summaryItemHtml.querySelector("#desc").innerText = product.desc
    return summaryItemHtml;
}

if(!Auth.isLoggedIn())
    redirect("../login.html");

let currUser = User.getCurrentUser();
let userID = currUser.id;


let summaryItemHtmlString = await fetchComponent("../components/checkout-summary-item.html");
let cart = GetCartByID(userID);


let emtpyElement = document.getElementById("empty");
let innerContainer = document.getElementById("inner-container");
if(cart.length == 0){
    emtpyElement.classList.remove("d-none")
    emtpyElement.classList.add("d-flex");
}
else
{
    innerContainer.classList.remove("d-none")
    let totalPrice = 0;
    cart.forEach(item => {
        let summaryItemContainer = document.getElementById("ordersummary");
        let summaryItem = createSummaryItem(item);
        summaryItemContainer.appendChild(summaryItem);
        totalPrice+= Number(summaryItem.querySelector("#price").innerText.trim());
    });
    totalPrice = totalPrice.toLocaleString('en-US',{
        maximumFractionDigits:2,
        minimumFractionDigits:2
    })
    document.getElementById("subtotal").innerText = totalPrice;
    document.getElementById("total-price").innerText = totalPrice;
    console.log(totalPrice);


    document.getElementById('checkoutform').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent actual form submission
    
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        // console.log(data); // { username: 'value', email: 'value' }
      });
}


// console.log(cart)