import { Auth } from "../modules/authModule.js";
import { User } from "../modules/userModule.js";
import { fetchComponent, convertToHtmlElement, redirect, createAlert, getFormFields, getFormInputs } from "../util.js";
import { CreateDisplyCartItem } from "./cart-item.js";
import { GetCartByID } from "../modules/db.js";
import { Cart } from "../modules/cartModule.js";
import {Validation} from "../modules/validation.js";

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
        cartOffcanvas.querySelector(".btn-go-to-cart").addEventListener("click", () => {
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

            document.querySelectorAll("#cart-badge").forEach(badge => badge.innerText = cart.length)
            const userName = `${user.firstName} ${user.lastName}`.trim() || "User";
            if (User.getCurrentUser.role == 1) {
                document.querySelectorAll('[title="Cart"]').forEach(c => c.remove());
            }

            body.querySelectorAll(".username-placeholder").forEach(el => {
                el.textContent = userName;
            });
            const logoutLinks = body.querySelectorAll(".logout-link");
            logoutLinks.forEach(link => {
                link.addEventListener('click', () => {
                    Auth.logout();
                });
            });
            const profileLinks = body.querySelectorAll(".profile-link");
            profileLinks.forEach(link => {
                link.addEventListener('click', (e) =>{
                    e.target.href = "../../pages/profile.html";
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

        const prodductName = productCard.querySelector("h5");
        prodductName.innerText = product.name;
        prodductName.addEventListener('click', () => redirect(`../../pages/product.html?prod-id=${product.id}`))

        const productImg = productCard.querySelector("img");
        productImg.addEventListener('click', () => redirect(`../../pages/product.html?prod-id=${product.id}`))

        productCard.querySelector("p").innerText = product.desc;
        productCard.querySelector("span").innerText = "$ " + product.price;

        const productButton = productCard.querySelector("button");
        productButton.addEventListener("click", () => {
            if (!Auth.isLoggedIn()) {
                createAlert("Please Log In", "primary", "You must be logged in to add items to your cart. Please log in to continue.");
                return;
            }
            // Cart.addToCart(productCard.id)
            Cart.cartUi(productCard.id)
        });

        if (User.getCurrentUser() !== null && User.getCurrentUser().role === 1) {

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


    static async renderSellerProduct(product) {

    }

    static async renderReviews(review) {

        const reviewCard = await fetchComponent("../../components/reviewCard.html");
        const reviewCardElemnt = convertToHtmlElement(reviewCard);
        const reviewContainer = document.getElementById("reviews-container").querySelector("div");
        reviewCardElemnt.querySelector("h5").innerText = review.customerName;
        reviewCardElemnt.querySelector("small").innerText = review.date;
        reviewCardElemnt.querySelector("p").innerText = review.text;

        reviewContainer.insertAdjacentElement("beforeend", reviewCardElemnt);
    }



    static users = [];
    static pageSize = 5;
    static currentPage = 1;

    static async renderTable() {
        const usertable = await fetchComponent("../../components/userTable.html");
        const userTable = convertToHtmlElement(usertable);
        const container = document.getElementById("content");
        container.innerHTML = "";
        container.appendChild(userTable);


        this.users = await User.getAllUsers();

        this.renderPage(1);
        this.renderPaginationControls();
    }

    static async renderPage(pageNumber) {
        const userTableBody = document.getElementById("userTableBody");
        userTableBody.innerHTML = "";

        const startIndex = (pageNumber - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const usersToRender = this.users.slice(startIndex, endIndex);

        for (const user of usersToRender) {
            await this.renderUserRow(user);
        }
        this.currentPage = pageNumber;
    }

    static async renderUserRow(user) {
        const userrow = await fetchComponent("../../components/userRows.html");
        const userrowElement = convertToHtmlElement(userrow);
        const cols = userrowElement.querySelectorAll("td");

        cols[0].innerText = user.id;
        cols[1].innerText = `${user.firstName} ${user.lastName}`;
        cols[2].innerText = user.email;
        cols[3].innerText = user.role == 1 ? "Seller" : "Customer";

        userrowElement.querySelector(".delete-button").addEventListener("click", (e) => {
            User.removeUser(user.id);
            e.target.closest("tr").remove();
            this.users=User.getAllUsers();
           this.renderPage(1);
            this.renderPaginationControls();
        });

        const editButton = userrowElement.querySelector(".edit-button");
        editButton.setAttribute('data-bs-toggle', `#editUserModal${user.id}`);
        editButton.addEventListener('click', async () => {
            await this.handleEditUser(user, userrowElement);
        });

        document.getElementById("userTableBody").appendChild(userrowElement);
    }

    static async handleEditUser(user, userrowElement) {
        let modalElement = document.getElementById(`editUserModal${user.id}`);
    
        if (!modalElement) {
            await this.renderEditUserForm(user.id);
            modalElement = document.getElementById(`editUserModal${user.id}`);
    
            modalElement.addEventListener('hide.bs.modal', () => {
                if (document.activeElement && modalElement.contains(document.activeElement)) {
                    document.activeElement.blur();
                }
            });
    
            modalElement.addEventListener('hidden.bs.modal', () => {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.dispose();
                }
                modalElement.remove();
            }, { once: true });
    
            const form = modalElement.querySelector("form");
            this.#setEditFormInputs(form, user);
    
            form.addEventListener('submit',  (e) => {
                e.preventDefault();
                const formData = getFormFields('editUserForm');
                const formInputs = getFormInputs(form);
                const validationRules = Validation.editUserRules(formInputs);
                if(!(Validation.validateForm(form,validationRules))){
                    return;
                }

                if(User.isEmailUsedByAnotherUser(formData.email,user.id)){
                    createAlert("Email Already Exists.","warning","This email is already used by another user.");
                    return;
                }

                formData.id = user.id;
                User.updateUser(formData);
    
                const cols = userrowElement.querySelectorAll("td");
                cols[1].innerText = `${formData.firstName} ${formData.lastName}`;
                cols[2].innerText = formData.email;
    
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
        }
    
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (!modalInstance) {
            modalInstance = new bootstrap.Modal(modalElement);
        }
        modalInstance.show();
    }
    

static renderPaginationControls() {


    let paginationContainer = document.getElementById("paginationControls");

    if (!paginationContainer) {
        paginationContainer = document.createElement("div");
        paginationContainer.id = "paginationControls";
        paginationContainer.classList.add("pagination-controls");
        document.getElementById("content").appendChild(paginationContainer);
    }

    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(this.users.length / this.pageSize);

    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    prevButton.disabled = this.currentPage === 1;
    prevButton.addEventListener("click", () => {
        if (this.currentPage > 1) {
            this.currentPage -= 1; 
            this.renderPage(this.currentPage);
            this.renderPaginationControls();
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.innerText = i;
        if (i === this.currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.addEventListener("click", () => {
            this.currentPage = i; 
            this.renderPage(this.currentPage);
            this.renderPaginationControls();
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.disabled = this.currentPage === totalPages;
    nextButton.addEventListener("click", () => {
        if (this.currentPage < totalPages) {
            this.currentPage += 1; 
            this.renderPage(this.currentPage);
            this.renderPaginationControls();
        }
    });
    paginationContainer.appendChild(nextButton);

}


    static async renderEditUserForm(userId) {
    const editForm = await fetchComponent("../../components/edit-user-form.html");
    const editFormElement = convertToHtmlElement(editForm);
    editFormElement.setAttribute('id', `editUserModal${userId}`);
    document.getElementById("editFormModal").appendChild(editFormElement);

}




updateTableRow(userId, updatedData) {
    const userRow = document.querySelector(`#userRow${userId}`);

    if (userRow) {
        
        userRow.querySelector(".user-name").innerText = `${updatedData.firstName} ${updatedData.lastName}`;
        userRow.querySelector(".user-email").innerText = updatedData.email;
        userRow.querySelector(".user-role").innerText = updatedData.role;
    }
    
}

static async renderCharts(){
    
    const dashboard = await fetchComponent("../../components/dashboard.html");
    const chart = convertToHtmlElement(dashboard);
    const container = document.getElementById("content");
    container.innerHTML = "";
    container.appendChild(chart);
}

static async renderProducts(){
    
    const product = await fetchComponent("../../components/products-dashboard.html");
    const product_chart = convertToHtmlElement(product);
    const container = document.getElementById("content");
    container.innerHTML = "";
    container.appendChild(product_chart);
}

static async renderSupport(){
    
    const support = await fetchComponent("../../components/support-dashboard.html");
    const support_content = convertToHtmlElement(support);
    const container = document.getElementById("content");
    container.innerHTML = "";
    container.appendChild(support_content);
}

static async renderOrders(){
    const order = await fetchComponent("../../components/order-dashboard.html");
    const orders_content = convertToHtmlElement(order);
    const container = document.getElementById("content");
    container.innerHTML = "";
    container.appendChild(orders_content);
}

static #setEditFormInputs(form, user) {
const formInputs = getFormInputs(form)
console.log(formInputs);
formInputs.firstName.value = user.firstName;
formInputs.lastName.value = user.lastName;
formInputs.email.value = user.email;
formInputs.phone.value = user.phone;
formInputs.password.value = user.password;

}
}