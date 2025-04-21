export function GetUserByID(id){
    // return All user with the same ID !! NOT ONLY ONE
    let users = JSON.parse(window.localStorage.getItem("user"));
    return users.filter(user=> user.id == id); 
}
export function GetProductByID(id){
    // return All Products with the same ID !! NOT ONLY ONE
    let products = JSON.parse(window.localStorage.getItem("product"));
    return products.filter(prod=> prod.id == id); 
}