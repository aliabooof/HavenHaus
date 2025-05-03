import { getTable } from "../modules/db.js";
import {  Product } from "../modules/productModule.js";
import {Auth} from "../modules/authModule.js"
import {User} from "../modules/userModule.js"
import { OrderItem } from "../modules/OrderItem.js";
// import { Product } from "../modules/productModule";
import {Order} from "../modules/order.js"
import { getFormInputs, redirect } from "../util.js";
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
        const PENDING_ORDER = 0

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
var sellerID; //seller.id
if(!seller)
    redirect("../../login.html")
else if(seller.role != 1)
    redirect("../../pages/not-found.html")
else
    sellerID = seller.id


 
    let isEditMode = true;

    
    addProductBtn.addEventListener('click', function() {
        isEditMode=false;
        document.getElementById('productForm').reset();
        productModal.show();
        document.getElementById("preview").parentElement.classList.add("d-none")
        document.getElementById("image-input").value = ""

    });

    const productName =document.getElementById("productName");

    saveProductBtn.addEventListener("click",save);
    function save(e){
        e.preventDefault();

        let formInputs=getFormInputs(productForm);
        let validationRules=Validation.productRules(formInputs);
        if (!Validation.validateForm(formInputs,validationRules)) {
            return;
        }
        let product = getFormData();  
        product.stock = Number(product.stock)      
        if (isEditMode) {
            let productID = document.getElementById("saveProductBtn").dataset.id;

            // Checking if the new Stock is equal or less than the pending orders on this product
        //______________________________________________________________________\\
            let productPendingOredersQuantity = OrderItem.getOrderItemsByProductId(productID)
                                                    .filter(orderItem=>{
                                                        return orderItem.status == PENDING_ORDER
                                                    }).length
            if(formInputs.stockQuantity.value < productPendingOredersQuantity){
                Validation.showError(formInputs.stockQuantity,"Invalid stock, handle pending orders first.")
                return;
            }
        //_____________________________________________________________________________\\

        
            product.id=productID;
            Product.updateProduct(product);
            // e.validateForm();
            // editProduct();
            
        }else{
            if(!document.getElementById("image-input").files||document.getElementById("image-input").value =="" || document.getElementById("image-input").files.length ===0 ){
                Validation.showError(document.getElementById("image-input"),"Must upload image for new products")
                return
            }
            product.sellerID = sellerID
            product = new Product(product)
            Product.addProduct(product)
            product.sellerID = sellerID
            product = new Product(product)
            product.imageUrl = product.name

            Product.addProduct(product)
            saveImage(product.imageUrl)
        }
        document.getElementById("preview").classList.add("d-none")
        productModal.hide();

        loadProductsTable();
    }




    function loadProductsTable() {
        // Your seller ID
        const products = Product.getProductsBySeller(sellerID);
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
                document.getElementById("preview").parentElement.classList.add("d-none")
                document.getElementById("image-input").value = ""


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
        // console.log("from Delete");
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

const fileInput = document.getElementById('image-input');
    const preview = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');
    
let imageDataUrl = null;
let originalFileName = 'downloaded_image.png';

fileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;

    originalFileName = file.name;

    const reader = new FileReader();
    // reader.onload = function (e) {
    //   const base64 = e.target.result;
    //   localStorage.setItem('savedImage', base64);
    //   preview.src = base64;
    document.getElementById("preview").classList.remove("d-none")
    document.getElementById("preview").parentElement.classList.remove("d-none")

    
    reader.onload = e => {
        imageDataUrl = e.target.result;
        preview.src = imageDataUrl;
        preview.style.display = 'block';
        downloadBtn.disabled = false;
    };
    reader.readAsDataURL(file);

});

function saveImage(imageDownloadName){   
        if(!imageDataUrl)
            return
          const link = document.createElement('a');
          link.href = imageDataUrl;
          link.download = imageDownloadName; // keep original name
          document.body.appendChild(link); // required for Firefox
          link.click();
          document.body.removeChild(link);    
}