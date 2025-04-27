import { GetProductByID, getTable } from "./db.js";
import {Product } from "./productModule.js";

export class OrderItem {
    constructor({ productId, quantity, price }) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price; 
        this.id = this.#generateId();
    }

    #generateId() {
        return 'item_' + Math.random().toString(36).substring(2, 10);
    }
    static getAllOrderItems() {
            return getTable("orderItem") || [];
    }
    static getOrderItemsBySellerId(sellerId) {
        return this.getAllOrderItems().filter(item => item.sellerID === sellerId );
    }
    static getOrderItemsByProductId(productId) {
        this.getAllOrderItems().filter(item => item.productID == productId )
        return this.getAllOrderItems().filter(item => item.productID === productId );
    }
    // static getProductQuantityByProductId(productId) {
    //     let product = Product.getProductById();
    //     return this.getOrderItemsByProductId()
    //                 .map(item => item.quantity )
    //                 .map(quantity => product.price * quantity);
    // }
    static getProductSellsById(productId) {
        let product = Product.getProductById(productId);
        return this.getOrderItemsByProductId(productId)
                    .map(item => item.quantity )
                    .map(quantity => product.price * quantity);
    }
    // static getTotalProductSellsById(productId) {
    //     return this.getProductSellsById(productId).reduce((prev,curr)=> prev+curr);
    // }
    static getTotalProductSellsById(productId) {
        return this.getProductSellsById(productId).reduce((prev,curr)=> prev+curr , 0);
    }

}
