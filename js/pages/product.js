import {ChangeCartItemQuantity, GetCartItem, GetProductByID} from "../modules/db.js"
import {IncreaseQuantity, DecreaseQuantity, GetUrlField, redirect} from "../util.js"
import { User } from "../modules/userModule.js";
import { Navbar } from "../componentModules/navbar.js";
import { renderFooter} from "../componentModules/footer.js";
await Navbar.renderNavbar();
await renderFooter()


function AddToCart(event){
    let user = User.getCurrentUser();
    if(!user) redirect("../../login.html");    
    let quantityElement = document.querySelector(".quantity");
    ChangeCartItemQuantity(user.id, product.id, Number(quantityElement.innerText.trim()));
    redirect("../../pages/cart.html");    
}

let productId = GetUrlField("prod-id")
// redirect if prod-id is not set properly in url (id is wrong)
if(!productId) redirect("../../pages/not-found.html")
    
let product = GetProductByID(productId);
// redirect if product not found (id is wrong)
if(product.length == 0) redirect("../../pages/not-found.html")
product = product[0]
    
// add product details to page
document.querySelector("#product-name").innerText = product.name
document.querySelector("#product-price").innerText = product.price
document.querySelector("#product-description").innerText = product.desc
document.querySelector("#stock-count").innerText = product.stock
document.querySelector(".stock").innerText = product.stock


if(product.stock < 1){
    document.querySelector("#stock-label").classList.remove("text-success")
    document.querySelector("#stock-label").classList.add("text-danger")
}
let currUser = User.getCurrentUser();
let cartItem, quantity=1 ;
if(currUser) {
      cartItem = GetCartItem(currUser.id,product.id)
      if(cartItem.length > 0 )
        quantity = cartItem[0].quantity;
}

document.querySelector(".quantity").innerText = quantity
document.getElementById("increaseQuantityBtn").addEventListener("click",IncreaseQuantity)
document.getElementById("decreaseQuantityBtn").addEventListener("click",DecreaseQuantity)
document.getElementById("addToCartBtn").addEventListener("click",AddToCart)
// window.addEventListener("load",function(event){

// })