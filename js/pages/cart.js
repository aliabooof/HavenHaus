// redirect if not logged in
import { Auth } from "../modules/authModule.js";
if(!Auth.isLoggedIn())
    redirect("../../login.html");



import {GetCartByID, GetProductByID, ChangeCartItemQuantity,RemoveCartItem} from "../modules/db.js"
import {IncreaseQuantity as IncQ, DecreaseQuantity as DecQ, redirect, fetchComponent, convertToHtmlElement} from "../util.js"
import { User } from "../modules/userModule.js";
// import { CreateDisplyCartItem } from "../componentModules/cart-item.js";


import { Component } from "../componentModules/components.js";
import { Cart } from "../modules/cartModule.js";
await Component.renderNavbar();
await Component.renderFooter();
document.querySelectorAll(".fa-cart-shopping").forEach(element=>{
    element.parentElement.classList.add("d-none")
})
// await Component.renderCartOffcanvas();

document.getElementById("cart-items-container").dataset.totalPrice = "{}"




// if not logged in redirect to login
    
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
    Cart.showEmpty("main-container")
else{
    
    Cart.showCartContainer("main-container")
    mainContainer.classList.remove("d-none");
    let itemsContainer;
    itemsContainer = document.getElementById("cart-items-container");
    Cart.DispalyCartItems(itemsContainer,cart);
    // Cart.UpdateItemTotalPrice(cart.prodID,)
    
}


