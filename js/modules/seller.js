import {OrderItem} from "./OrderItem.js"
import { Product } from "./productModule.js"

export class Seller{
    
    static getTotalSells(sellerId)
    {
        let products =  Product.getProductsBySeller(sellerId)
        // console.log(products.map(prod=>prod.id))
        
        return Product.getProductsBySeller(sellerId).map(
            product=>
                OrderItem.getTotalProductSellsById(product.id)
        )
                        
    }
}