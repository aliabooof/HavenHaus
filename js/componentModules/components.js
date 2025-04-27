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
            if( User.getCurrentUser.role == 1){
                document.querySelectorAll('[title="Cart"]').forEach(c=>c.remove());
            }

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
        
        const prodductName =  productCard.querySelector("h5");
        prodductName.innerText = product.name;
        prodductName.addEventListener('click',()=>redirect(`../../pages/product.html?prod-id=${product.id}`))
        
        const productImg =  productCard.querySelector("img");
        productImg.addEventListener('click',()=>redirect(`../../pages/product.html?prod-id=${product.id}`))
        
        productCard.querySelector("p").innerText = product.desc;
        productCard.querySelector("span").innerText = "$ " + product.price;
        
        const productButton = productCard.querySelector("button");
        productButton.addEventListener("click", () => {
            Cart.addToCart(productCard.id)
            Cart.cartUi(productCard.id)
        });
        
        if(User.getCurrentUser()!==null && User.getCurrentUser().role === 1){
            
            productCard.querySelector("button").remove();
        }
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

   


    static async renderInquiryCard(inquiry) {
        const inquiryContainer = document.getElementById("inquiries-card-header-container");
        const inquirybodyContainer = document.getElementById('inquiries-card-body-container');
    
        const inquiryHeader = await fetchComponent("../../components/inquiry-card.html");
        const inquiryHeaderElement = convertToHtmlElement(inquiryHeader);
        inquiryHeaderElement.querySelector("h5").innerText = inquiry.title;
        inquiryHeaderElement.querySelectorAll("p")[0].innerText = inquiry.date;
        inquiryHeaderElement.querySelectorAll("p")[1].innerText = inquiry.summary;
        inquiryHeaderElement.querySelector("button").setAttribute('data-bs-target', `#inquiryModal${inquiry.id}`);
    
        const inquiryBody = await fetchComponent("../../components/inquiry-information-popup.html");
        const inquiryBodyElement = convertToHtmlElement(inquiryBody);
        inquiryBodyElement.id = `inquiryModal${inquiry.id}`;
        inquiryBodyElement.querySelector("h5").innerText = inquiry.title;
    
        const pArr = inquiryBodyElement.querySelectorAll("p");
    
        pArr[0].querySelector("strong").nextSibling.nodeValue = ` ${inquiry.name}`;
        pArr[1].querySelector("strong").nextSibling.nodeValue = ` ${inquiry.email}`;
        pArr[2].querySelector("strong").nextSibling.nodeValue = ` ${inquiry.date}`;
    
        
        const statusSpan = pArr[3].querySelector("span");
        statusSpan.textContent = inquiry.details.status;
        statusSpan.className = `badge ${inquiry.details.statusClass}`;
    
        
        pArr[4].innerText = inquiry.message;
    
        
        const replyMessageCard = inquiryBodyElement.querySelector('.conversation-container-parent');
        if (!inquiry.reply) {
            replyMessageCard.classList.add("d-none");
        } else {
            replyMessageCard.classList.remove("d-none"); 
            replyMessageCard.querySelector('.message-text').innerText = inquiry.reply;
        }
    
        inquiryContainer.insertAdjacentElement("beforeend", inquiryHeaderElement);
        inquirybodyContainer.insertAdjacentElement("beforeend", inquiryBodyElement);
    }
    

    static async renderSellerProduct(product){

    }

}