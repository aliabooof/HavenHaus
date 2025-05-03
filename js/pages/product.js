import {ChangeCartItemQuantity, GetCartItem, GetProductByID} from "../modules/db.js"
import {IncreaseQuantity, DecreaseQuantity, GetUrlField, redirect, getFormFields, createAlert} from "../util.js"
import { User } from "../modules/userModule.js";
import { Component } from "../componentModules/components.js";
import { Product } from "../modules/productModule.js";
import { Auth } from "../modules/authModule.js";
import { LoadDB } from "../load_db.js";

console.log("hello3")
await LoadDB();
// redirect if prod-id is not set properly in url (id is wrong)
let productId = GetUrlField("prod-id")
if(!productId) redirect("../../pages/not-found.html")   

let product = Product.getProductById(productId);

// if(!product) redirect("../../pages/not-found.html")


Auth.enforcePageAuthorization();
await Component.renderNavbar();
await Component.renderFooter();
await Component.renderCartOffcanvas();


let user = User.getCurrentUser();
if(user.role != 2){
    document.getElementById("addToCartBtn").classList.add("d-none")
    document.getElementById("review-submit-container").classList.add("d-none")
    document.getElementById("quantity-control-container").classList.add("d-none")

}



function AddToCart(event){
    if(!user){
        createAlert("Please Log In", "primary", "You must be logged in to add items to your cart. Please log in to continue.");
        return;
    }    
    let quantityElement = document.querySelector(".quantity");
    ChangeCartItemQuantity(user.id, product.id, Number(quantityElement.innerText.trim()));
    redirect("../../pages/cart.html");    
}


let seller = User.getUserById(product.sellerID)
// redirect if product not found (id is wrong)

    
// add product details to page
document.querySelector("#product-name").innerText = product.name
document.querySelector("#product-price").innerText = product.price
document.querySelector("#product-description").innerText = product.desc
document.querySelector("#stock-count").innerText = product.stock
document.querySelector(".stock").innerText = product.stock
if(seller)
    document.querySelector("strong").innerText= `${seller.firstName} ${seller.lastName}`
document.querySelector("img").src=`../../assets/images/Products/${product.name}.png`;
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


console.log(product.reviews.length);
if(product.reviews.length !== 0){
    document.getElementById("review-count").innerText = product.reviews.length;
    for (const review of product.reviews) {
        await Component.renderReviews(review);
    }
}

let reviewForm = document.getElementById("addReviewForm");

reviewForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(!Auth.isLoggedIn() && !currUser){
        createAlert("Please Log In to Submit a Review","primary","You must be logged in to leave a review. Please log in to share your thoughts.");
        return;
    }
    const review = getFormFields("addReviewForm");
    review.customerName = [currUser.firstName,currUser.lastName].join(' ');
    review.date = new Date().toLocaleDateString('en-GB');
    
    Product.addReview(productId,review);
    
    redirect(`../../pages/product.html?prod-id=${productId}`);
})