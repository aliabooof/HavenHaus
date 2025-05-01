export function getTable(tableName){
    // return JSON.parse(window.localStorage.getItem(tableName));
    const data = JSON.parse(localStorage.getItem(tableName));
    return Array.isArray(data) ? data : [];
}
export function setTable(tableName, table){
    localStorage.setItem(tableName,JSON.stringify(table));
}
export function add(tableName,item){
    const data = getTable(tableName);
    data.push(item);
    setTable(tableName,data);

}

export function deleteTable(tableName){
    localStorage.removeItem(tableName);
}
// export function GetUserByID(id){
//     // return All user with the same ID !! NOT ONLY ONE
//     let users = getTable("user")
//     return users.filter(user=> user.id == id); 
// }
export function GetProductByID(productID){
    // return All Products with the same ID !! NOT ONLY ONE
    // returns array [empty] or [products with product.id = productID]
    let products = getTable("product")
    return products.filter(prod=> prod.id == productID); 
}


export function GetCartByID(userID){
    // return All CartItems with the same userID
    // returns array [empty] or [cartItems,...]
    let carts = getTable("cartItem");
    return carts.filter(item=>  item.userID == userID);
}

export function GetCartItem(userID, productID){
    // return CartItem (userID, productID) []array with cartItems of the same user and product 
    let userCart = GetCartByID(userID);
    return userCart.filter(item=>  item.productID == productID);
}

export function AddCartItem(userID, productID, quantity=1){
    // Adds item to the cart ONLY IF IT'S NOT IN THE CART
    let cartItem = GetCartItem(userID, productID);
    let q = 0;
    if(cartItem.length > 0)
        return
    let carts = getTable("cartItem");
    carts.push(
        {
            userID: userID,
            productID: productID,
            quantity:quantity
        }
    )
    setTable("cartItem", carts)
}

export function ChangeCartItemQuantity(userID, productID, newQuantity){
    // Changes The quantity of an existing item
    // Or Initializes a non-existing item with the newQuantity 
    let cartItem = GetCartItem(userID, productID);
    let q = 0;
    if(cartItem.length == 0){
        AddCartItem(userID, productID, newQuantity);
        return;
    }
    let carts = getTable("cartItem");
    carts.forEach((item,index) => {
        if(item.userID == userID && item.productID == productID){
            carts[index].quantity = newQuantity
        }
    });
    setTable("cartItem", carts)
}

export function RemoveCartItem(userID, productID){
    // Totally removes the item from the cart
    let carts = getTable("cartItem");
    carts.some((item,index) => {
        if(item.userID == userID && item.productID == productID){
            carts.splice(index,1);
            return true;
        }
    });
    setTable("cartItem", carts)
}
