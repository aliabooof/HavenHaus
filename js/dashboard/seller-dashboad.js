import {Order} from "../modules/order.js";
import { OrderItem } from "../modules/OrderItem.js";
import { Product } from "../modules/productModule.js";
import {Seller} from "../modules/seller.js"

// let seller id = 6
console.log(Product.getProductsBySeller(2   ))
console.log(Seller.getSellerOrderItemsById(2))

let sellerOrders = Seller.getSellerOrdersById(2)
console.log(sellerOrders);
// Order.getAllOrders().filter(order=>order.productId)
// console.log(OrderItem.getOrderItemsBySellerId(2).map().sort(
//     (order1,order2)=>
//         new Date(order1.date) < new Date(order2.date)
// ))

