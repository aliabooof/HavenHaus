import { CreateDisplyCartItem } from "../componentModules/cart-item.js";

export class Cart{

    static UpdateItemTotalPrice(prodID,price,quantity){
        // get totalPrice object from container
        let totalPrice = JSON.parse(document.getElementById("total-price-holder").dataset.totalPrice); 
        // update prices
        totalPrice[prodID] = price * quantity;
        // calc the totat price and set them
        let newTotalPrice = Object.values(totalPrice).reduce((acc, val) => acc + val, 0).toFixed(2);
        document.querySelectorAll("#subtotal").forEach(item=>item.innerText = newTotalPrice)
        document.querySelectorAll("#total-price").forEach(item=>item.innerText = newTotalPrice)

        // save new totalPrice object on container
        document.getElementById("total-price-holder").dataset.totalPrice = JSON.stringify(totalPrice); 
    }

    static DispalyCartItems(itemsContainer,cart){
        cart.forEach(cartItem => {
            let displayItem = CreateDisplyCartItem(cartItem);
            itemsContainer.appendChild(displayItem)
            // totalPrice[cartItem.id] =  cartItem.quantity * displayItem.dataset.prodPrice;
        });
    }
}