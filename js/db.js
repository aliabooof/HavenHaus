function GetTable(tableName){
    return JSON.parse(window.localStorage.getItem(tableName));
}
function SetTable(tableName, table){
    localStorage.setItem(tableName,JSON.stringify(table));
}
export function GetUserByID(id){
    // return All user with the same ID !! NOT ONLY ONE
    let users = GetTable("user")
    return users.filter(user=> user.id == id); 
}
export function GetProductByID(productID){
    // return All Products with the same ID !! NOT ONLY ONE
    // returns array [empty] or [products with product.id = productID]
    let products = GetTable("product")
    return products.filter(prod=> prod.id == productID); 
}


export function GetCartByID(userID){
    // return All CartItems with the same userID
    // returns array [empty] or [cartItems,...]
    let carts = GetTable("cartItem");
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
    let carts = GetTable("cartItem");
    carts.push(
        {
            userID: userID,
            productID: productID,
            quantity:quantity
        }
    )
    SetTable("cartItem", carts)
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
    let carts = GetTable("cartItem");
    carts.forEach((item,index) => {
        if(item.userID == userID && item.productID == productID){
            carts[index].quantity = newQuantity
        }
    });
    SetTable("cartItem", carts)
}

export function RemoveCartItem(userID, productID){
    // Totally removes the item from the cart
    let carts = GetTable("cartItem");
    carts.some((item,index) => {
        if(item.userID == userID && item.productID == productID){
            carts.splice(index,1);
            return true;
        }
    });
    SetTable("cartItem", carts)
}

