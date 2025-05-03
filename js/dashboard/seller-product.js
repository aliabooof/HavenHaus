import { getTable } from "../modules/db.js";
import {  Product } from "../modules/productModule.js";
import {Auth} from "../modules/authModule.js"
import {User} from "../modules/userModule.js"
import { OrderItem } from "../modules/OrderItem.js";
// import { Product } from "../modules/productModule";
import {Order} from "../modules/order.js"
import { getFormInputs } from "../util.js";
import { Validation } from "../modules/validation.js";

// window.addEventListener('DOMContentLoaded', function(){

        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        const productForm = document.getElementById('productForm');
        const addProductBtn = document.getElementById('addProductBtn');
        const saveProductBtn = document.getElementById('saveProductBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const stockInput = document.getElementById('productStock');
        const priceInput = document.getElementById('productPrice');
        const categorySelect = document.getElementById('productCategory');

        let getrow;

        let deleteBtns = document.querySelectorAll('.delete-btn');

        function updateSellerNameInNavbar() {
            const currentUser = User.getCurrentUser();
            const sellerNameElement = document.getElementById('selllerName');
            if (currentUser && sellerNameElement) {
                sellerNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            } else {
                sellerNameElement.textContent = "Guest";
            }
        }
        
        document.addEventListener('DOMContentLoaded', updateSellerNameInNavbar);


    function confirmDelete(e){
        console.log(confirmDeleteBtn)
        console.log(e.target);
        Product.removeProduct(e.target.dataset.id)
        // confirmDeleteBtn.closest("tr").remove();
        getrow.remove();
        
        let prodcutOrderItems =OrderItem.getOrderItemsByProductId(productId);
        let prodcutOrderIds = prodcutOrderItems.map(orderItem=>orderItem.orderID);
        let orderToBeRejected = Order.getAllOrders().filter(order=> prodcutOrderIds.filter((orderId)=> orderId == order.id).length && order.status == 0)
        
        orderToBeRejected.forEach(order=>{
            Order.updateOrderStatus(order.id,2)
            let orderItems = OrderItem.getOrderItemsByOrderId(order.id)
            let orderItemStatus = 3;
            orderItems.forEach(orderItem => {
                if(productId == orderItem.productID){orderItemStatus = 2}
                else{orderItemStatus = 3}
                
                OrderItem.setOrderItemStatus(order.id,orderItem.productID,orderItemStatus)
            });
        })
        deleteModal.hide();
    }

    function attachDeleteHandlers() {
        let deleteBtns = document.querySelectorAll('.delete-btn');
        
        deleteBtns.forEach(button =>{
            button.addEventListener('click',DeleteProduct)
        });
    }

    var seller = User.getCurrentUser()
    let sellerID = seller.id

 
    let isEditMode = true;

    
    addProductBtn.addEventListener('click', function() {
        isEditMode=false;
        console.log(isEditMode);
        document.getElementById('productForm').reset();
        productModal.show();
    });

    const productName =document.getElementById("productName");

    saveProductBtn.addEventListener("click",save);
    function save(e){
        e.preventDefault();
        console.log(isEditMode);

        let formInputs=getFormInputs(productForm);
        let validationRules=Validation.productRules(formInputs);
        if (!Validation.validateForm(formInputs,validationRules)) {
            return;
        }
        let product = getFormData();        
        if (isEditMode) {
            console.log(isEditMode);
            let productID = document.getElementById("saveProductBtn").dataset.id;
            console.log("saveProductBtn dateset.id: ", productID)
            product.id=productID;
            Product.updateProduct(product);
            // e.validateForm();
            // editProduct();
        }else{
        product.sellerID = sellerID
        product = new Product(product)
        Product.addProduct(product)
        console.log(isEditMode);
        }
    productModal.hide();

        loadProductsTable();
    }

    function loadProductsTable() {
        console.log("From load Product Table")
        // Your seller ID
        const products = Product.getProductsBySeller(sellerID);
        console.log(products)
        const tbody = document.querySelector('#products-table');
        tbody.innerHTML = ''; // Clear existing rows

        products.forEach((product, index) => {
            tbody.innerHTML += `
                <tr data-id="${product.id}">
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>$${product.price}</td>
                    <td>${product.stock}</td>
                    <td>
                        <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
                            ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-btn" data-id="${product.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">Delete</button>
                    </td>
                </tr>
            `;
        });

        //call edit after render table
        document.querySelectorAll('.edit-btn').forEach(button =>{
            button.addEventListener('click', function (e) {
                isEditMode=true;
                let productId = button.getAttribute('data-id');
                document.getElementById('productModalLabel').textContent = "Edit Product";
                document.getElementById("saveProductBtn").dataset.id=productId;

                let product= Product.getProductById(productId);
                
                fillProductForm(product);
                productModal.show();
            })
        });
        attachDeleteHandlers();
    }
    
    loadProductsTable();
    confirmDeleteBtn.addEventListener("click",confirmDelete);

    function getFormData(){
        return {
                // id:document.getElementById('productId').value = product.id,
                name:document.getElementById('productName').value,
                category:document.getElementById('productCategory').value,
                price:document.getElementById('productPrice').value,
                desc:document.getElementById('productDescription').value ,
                stock:document.getElementById('productStock').value,
                highlights:document.getElementById('highlights').value,
                instructions:document.getElementById('instructions').value,
        }
    } //End get formData() function 

    function DeleteProduct(e){
        console.log("from Delete");
        const parentTr= e.target.closest("tr");

        getrow =e.target.closest("tr");

        let productId = parentTr.dataset.id
        confirmDeleteBtn.dataset.id = productId;
        deleteModal.show();
    }

 

    function fillProductForm(product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.desc || '';
        document.getElementById('highlights').value = product.highlights || '';
        document.getElementById('instructions').value = product.instructions || '';
    }

    // updateProduct()


    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });



    attachDeleteHandlers()

    console.log(sellerID)


// }); //End of DOMContentLoaded Event to Window

//    static logout() {
//         deleteTable("currentUser");
//         deleteTable("loggedin");
//         console.log("User logged out.");
//         redirect("/");
//     }

    // document.getElementById('logout').addEventListener('click',Auth.logout());




// const productModal = document.getElementById('productModal');

// productModal.addEventListener('hidden.bs.modal', () => {
//     if (document.activeElement && productModal.contains(document.activeElement)) {
//     document.activeElement.blur();
//     }
// });
