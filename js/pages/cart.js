import {GetCartByID, GetProductByID, ChangeCartItemQuantity,RemoveCartItem} from "../modules/db.js"
import {IncreaseQuantity as IncQ, DecreaseQuantity as DecQ, redirect, fetchComponent, convertToHtmlElement} from "../util.js"
import { User } from "../modules/userModule.js";
import { Component } from "../componentModules/components.js";
// import { CreateDisplyCartItem } from "../componentModules/cart-item.js";
import { CreateDisplyCartItem } from "../componentModules/cart-item.js";
import { Auth } from "../modules/authModule.js";
import { Cart } from "../modules/cart.js";
await Component.renderNavbar();
await Component.renderFooter();
await Component.renderCartOffcanvas();

document.getElementById("items-container").dataset.totalPrice = "{}"




// if not logged in redirect to login
if(!Auth.isLoggedIn())
     redirect("../../login.html");
    
let cartID= User.getCurrentUser().id;
let totalPrice = {};


let cart = GetCartByID(cartID)

function showEmptyCart(){
    emtpyElement.classList.remove("d-none")
    emtpyElement.classList.add("d-flex");  
    mainContainer.classList.add("d-none")
}
function showCart(){
    emtpyElement.classList.remove("d-flex");  
    emtpyElement.classList.add("d-none")
    mainContainer.classList.remove("d-none")
    
}
let emtpyElement = document.getElementById("empty");
let mainContainer = document.getElementById("main-container");
if(cart.length == 0)
  showEmptyCart()
else{
    
    showCart()
    mainContainer.classList.remove("d-none");
    let itemsContainer;
    itemsContainer = document.getElementById("items-container");
    Cart.DispalyCartItems(itemsContainer,cart);
    
}


