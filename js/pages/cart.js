import {GetCartByID, GetProductByID, ChangeCartItemQuantity,RemoveCartItem} from "../modules/db.js"
import {IncreaseQuantity as IncQ, DecreaseQuantity as DecQ, redirect} from "../util.js"
import { User } from "../modules/userModule.js";
import { Component } from "../componentModules/components.js";
  

await Component.renderNavbar();
await Component.renderFooter();
await Component.renderCartOffcanvas();




function CreateDisplyCartItem(cartItem){
    let product = GetProductByID(cartItem.productID)[0];
    totalPrice[product.id] =  cartItem.quantity * product.price;
    let cartString = `<div class="card mb-3" data-prod-id="${product.id}" data-prod-price="${product.price}">
                            <div class="row g-0 align-items-center">
                                <div class="col-4">
                                    <img src="../assets/images/banner.jpeg" class="img-fluid rounded-start" alt="Product">
                                </div>
                                <div class="col-8">
                                    <div class="card-body">
                                        <h5 class="card-title mb-1">${product.name}</h5>
                                        <p class="card-text text-muted mb-2">${product.desc}</p>
                                        <p class="card-text fw-bold text-primary">
                                            <span class="fas fa-dollar-sign"></span>${product.price}
                                        </p>

                                        <div class="d-flex align-items-center" data-card-prod-id="${product.id}">
                                            <button class="decreaseQuantityBtn btn btn-outline-secondary btn-sm me-2">−</button>
                                            <span class ="quantity">${cartItem.quantity}</span>
                                            <button class="increaseQuantityBtn btn btn-outline-secondary btn-sm ms-2">+</button>
                                            <button class="delete-card-btn bi bi-trash btn btn-link text-danger ms-auto" ">
                                            </button>
                                            <span class="d-none stock">${product.stock}</span>
                                        </div>
                                        <div> <span class="small">Stock: ${product.stock}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
    const parser = new DOMParser();
    let cartDiv = parser.parseFromString(cartString, 'text/html');
    cartDiv = cartDiv.body.firstElementChild;
    cartDiv.querySelector(".increaseQuantityBtn").addEventListener("click",IncreaseQuantity)
    cartDiv.querySelector(".decreaseQuantityBtn").addEventListener("click",DecreaseQuantity)
    cartDiv.querySelector(".delete-card-btn").addEventListener("click",DeleteCard)
    return cartDiv;
}
function UpdateItemTotalPrice(prodID,price,quantity){
    totalPrice[prodID] = price * quantity
    let newTotalPrice = Object.values(totalPrice).reduce((acc, val) => acc + val, 0).toFixed(2);
    document.getElementById("subtotal").innerText = newTotalPrice
    document.getElementById("total-price").innerText = newTotalPrice
}

function DecreaseQuantity(event){
    let card = event.target.closest(".card")
    let prodID = card.dataset.prodId
    let prodPrice =  card.dataset.prodPrice
    // console.log(cartID,prodID)
    
    DecQ(event)
    let quantity = Number(event.target.nextElementSibling.innerText.trim())
    ChangeCartItemQuantity(cartID, prodID, quantity)

    UpdateItemTotalPrice(prodID,prodPrice,quantity)
}

function IncreaseQuantity(event){
    let card = event.target.closest(".card")
    let prodID = card.dataset.prodId
    let prodPrice =  card.dataset.prodPrice

    IncQ(event)
    let quantity = Number(event.target.previousElementSibling.innerText.trim())
    ChangeCartItemQuantity(cartID, prodID, quantity)

    UpdateItemTotalPrice(prodID,prodPrice,quantity)
}
function DeleteCard(event){
    let card= event.target.closest(".card")
    let prodID = card.dataset.prodId;
    let prodPrice = card.dataset.prodPrice;
    document.querySelector(`[data-prod-id="${prodID}"]`).remove()
    RemoveCartItem(cartID, prodID)
    UpdateItemTotalPrice(prodID,prodPrice,0)
        
    if(document.getElementById("items-container").children.length ==0)
        showEmptyCart()
}

function DispalyCartItems(itemsContainer){
    
    cart.forEach(cartItem => {
        itemsContainer.appendChild( CreateDisplyCartItem(cartItem) )
    });
}

// if not logged in redirect to login
let user = User.getCurrentUser();
if(!user)
     redirect("../../login.html");
    
let cartID = user.id
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
    DispalyCartItems(itemsContainer);
    let price = Object.values(totalPrice).reduce((acc, val) => acc + val, 0).toFixed(2);
    document.getElementById("subtotal").innerText = price
    document.getElementById("total-price").innerText = price
}


