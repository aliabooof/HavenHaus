import { Auth } from "../modules/authModule.js";
import { User } from "../modules/userModule.js";
import { fetchComponent , convertToHtmlElement } from "../util.js";
import { CreateDisplyCartItem } from "./cart-item.js";
import { GetCartByID } from "../modules/db.js";
import { Cart } from "../modules/cart.js";
export class Component{


    static async  renderFooter(){
        let footer = await fetchComponent("../../components/footer.html")
        footer = convertToHtmlElement(footer)
        document.body.insertAdjacentElement("beforeend",footer);
    
    }

    static async renderCartOffcanvas(){
        let cartOffcanvas = await fetchComponent("../../components/cart-offcanvas.html")
        cartOffcanvas = convertToHtmlElement(cartOffcanvas)
        let cartItems = GetCartByID(User.getCurrentUser().id)
        document.body.insertAdjacentElement("beforeend",cartOffcanvas);

        cartItems.forEach((item)=>{
            let dispalyItem = CreateDisplyCartItem(item);
            let prodID = dispalyItem.dataset.prodId
            let prodPrice =  dispalyItem.dataset.prodPrice

            cartOffcanvas.querySelector("#total-price-container").insertAdjacentElement("beforebegin",dispalyItem);
            Cart.UpdateItemTotalPrice(prodID, prodPrice,item.quantity)
        })
        

    }
    
    static async renderNavbar() {
    
            
            const body = document.body;
    
            if (Auth.isLoggedIn()) {
                const user = User.getCurrentUser();
                body.insertAdjacentElement("afterbegin",await this.#getAuthNavbar());
    
    
                const userName = `${user.firstName} ${user.lastName}`.trim() || "User";
    
    
                body.querySelectorAll(".username-placeholder").forEach(el => {
                    el.textContent = userName;
                });
                const logoutLinks = body.querySelectorAll(".logout-link");
                logoutLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        console.log("logout");
                        Auth.logout();
                    });
                });
            } else {
                body.insertAdjacentElement("afterbegin",await this.#getGuestNavbar());
            }
        }
    
    
    
    
        static async  #getGuestNavbar() {
            const nav = await fetchComponent("../../components/guestNavbar.html")
            return convertToHtmlElement(nav);
    
        }
    
        static async #getAuthNavbar(){
            const nav = await fetchComponent("../../components/navbar.html");
            return convertToHtmlElement(nav);
    
        }
    
    
    
}