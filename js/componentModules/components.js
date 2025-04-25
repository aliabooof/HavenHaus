import { Auth } from "../modules/authModule.js";
import { User } from "../modules/userModule.js";
import { fetchComponent, convertToHtmlElement, redirect } from "../util.js";
import { CreateDisplyCartItem } from "./cart-item.js";
import { GetCartByID } from "../modules/db.js";
import { Cart } from "../modules/cartModule.js";

export class Component {



    static async renderFooter() {
        let footer = await fetchComponent("../../components/footer.html")
        footer = convertToHtmlElement(footer)
        document.body.insertAdjacentElement("beforeend", footer);

    }



    static async renderCartOffcanvas() {
        if (!Auth.isLoggedIn())
            return;
        let cartOffcanvas = await fetchComponent("../../components/cart-offcanvas.html")
        cartOffcanvas = convertToHtmlElement(cartOffcanvas)
        document.body.insertAdjacentElement("beforeend", cartOffcanvas);
        cartOffcanvas.querySelector(".btn-go-to-cart").addEventListener("click",()=>{
            redirect("../../pages/cart.html")
        })
        let cartItems = GetCartByID(User.getCurrentUser().id)
        if (cartItems.length == 0) {
           Cart.showEmpty("main-container");
            return;
        }
        cartItems.forEach((item) => {
            let dispalyItem = CreateDisplyCartItem(item);
            let prodID = dispalyItem.dataset.prodId
            let prodPrice = dispalyItem.dataset.prodPrice

            cartOffcanvas.querySelector("#cart-items-container").insertAdjacentElement("beforeend", dispalyItem);
            Cart.UpdateItemTotalPrice(prodID, prodPrice, item.quantity)
        })


    }

    static async renderNavbar() {


        const body = document.body;

        if (Auth.isLoggedIn()) {
            const user = User.getCurrentUser();
            const cart = GetCartByID(user.id);
            body.insertAdjacentElement("afterbegin", await this.#getAuthNavbar());

            document.querySelectorAll("#cart-badge").forEach(badge=>badge.innerText = cart.length)
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
            body.insertAdjacentElement("afterbegin", await this.#getGuestNavbar());
        }
    }

    static async renderCategoryCard(category) {
        const classArr = ["from-left-animation", "from-right-animation", "from-z-animation", "from-top-animation", "from-bottom-animation"];
        let categoryCard = await fetchComponent("../../components/category-card.html");
        categoryCard = convertToHtmlElement(categoryCard);
        categoryCard.id = category.id;
        categoryCard.querySelector("h5").innerText = category.name;
        categoryCard.querySelector("p").innerText = category.description;
        categoryCard.querySelector("img").src = `../../assets/images/category/${category.name}.png`;
        categoryCard.querySelector("a").href = `../../pages/category.html?categoryId=${category.id}`;
        categoryCard.classList.add(classArr[Math.floor(Math.random() * classArr.length)])
        const categoryContainer = document.getElementById("category-cards-container");
        categoryContainer.appendChild(categoryCard);
    }

    static async renderProductCard(product) {
        const classArr = ["from-left-animation", "from-right-animation", "from-z-animation", "from-top-animation", "from-bottom-animation"];
        let productCard = await fetchComponent("../../components/product-card.html");
        productCard = convertToHtmlElement(productCard);
        productCard.id = product.id;
        productCard.querySelector("h5").innerText = product.name;
        productCard.querySelector("p").innerText = product.desc;
        productCard.querySelector("span").innerText = "$ " + product.price;
        productCard.querySelector("button").addEventListener("click", () => {
            // Cart.addToCart(productCard.id)
            Cart.cartUi(productCard.id)
        });
        // productCard.querySelector("img")="";
        productCard.classList.add(classArr[Math.floor(Math.random() * classArr.length)])
        const productContainer = document.getElementById("cards-container");
        productContainer.appendChild(productCard);

    }


    static async  #getGuestNavbar() {
        const nav = await fetchComponent("../../components/guestNavbar.html")
        return convertToHtmlElement(nav);

    }

    static async #getAuthNavbar() {
        const nav = await fetchComponent("../../components/navbar.html");
        return convertToHtmlElement(nav);

    }

   

}