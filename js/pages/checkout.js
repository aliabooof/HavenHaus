import {GetCartByID, GetProductByID} from "../modules/db.js";
import {GetUrlField, redirect} from "../util.js";
import {fetchComponent, convertToHtmlElement} from "../util.js"
import {Navbar} from  "../componentModules/navbar.js"
function createSummaryItem(cartItem){
    let product = GetProductByID(cartItem.productID)[0];
    let summaryItemHtml = convertToHtmlElement(summaryItemHtmlString)
    summaryItemHtml.querySelector("#price").innerText = product.price * cartItem.quantity
    summaryItemHtml.querySelector("#quantity").innerText = cartItem.quantity
    summaryItemHtml.querySelector("#prod-name").innerText = product.name
    summaryItemHtml.querySelector("#desc").innerText = product.desc
    return summaryItemHtml;
}

Navbar.renderNavbar();

let userID = GetUrlField("id");
if(!userID)
    redirect("../login.html")
let summaryItemHtmlString = await fetchComponent("../components/checkout-summary-item.html");
let cart = GetCartByID(userID);


if(cart.length == 0){
    let notFound = document.getElementById("not-found");
    let innerContainer = document.getElementById("inner-container");
    notFound.classList.remove("d-none")
    notFound.classList.add("d-flex");
    innerContainer.classList.add("d-none");
}else
{
    let totalPrice = 0;
    cart.forEach(item => {
        let summaryItemContainer = document.getElementById("ordersummary");
        let summaryItem = createSummaryItem(item);
        summaryItemContainer.appendChild(summaryItem);
        totalPrice+= Number(summaryItem.querySelector("#price").innerText.trim());
    });
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