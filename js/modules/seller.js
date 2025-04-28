import { Order } from "./order.js"
import {OrderItem} from "./OrderItem.js"
import { Product } from "./productModule.js"

export class Seller{
    
    static getTotalSells(sellerId)
    {
        // console.log(products.map(prod=>prod.id))
        
        return Product.getProductsBySeller(sellerId).map(
            product=>
                OrderItem.getTotalProductSellsById(product.id)
        )
                        
    }

    static getSellerOrderItemsById(sellerId)
    {        
        let sellerProductIds = Product.getProductsBySeller(sellerId).map(product=> product.id)
        return  OrderItem.getAllOrderItems().filter(orderItem=> sellerProductIds.includes(orderItem.productID))
    }
    static getSellerOrdersById(sellerId)
    {        
        let sellerOrderItems = this.getSellerOrderItemsById(sellerId);
        let sellerOrderItemsIds = sellerOrderItems.map(orderItem=> orderItem.orderID)
        return  Order.getAllOrders().filter(order=> sellerOrderItemsIds.includes(order.id))
    }
    static getSortedSellerOrdersById(sellerId)
    {   
        let sellerOrderItems = this.getSellerOrderItemsById(sellerId);
        let sellerOrdersIds = sellerOrderItems.map(orderItem=> orderItem.orderID)
        let orders = Order.getAllOrders()
        // .filter(orderItem=> )
    }
}