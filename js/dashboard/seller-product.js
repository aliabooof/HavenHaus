import { getTable } from "../modules/db.js";
import {  Product } from "../modules/productModule.js";
import {Auth} from "../modules/authModule.js"
import {User} from "../modules/userModule.js"
import { OrderItem } from "../modules/OrderItem.js";
// import { Product } from "../modules/productModule";
import {Order} from "../modules/order.js"

window.addEventListener('DOMContentLoaded', function(){

    function confirmDelete(e){
        Product.removeProduct(e.target.dataset.id)
        e.target.closest("tr").remove()
        
        // let prodcutOrderItems =OrderItem.getOrderItemsByProductId(productId);
        // let prodcutOrderIds = prodcutOrderItems.map(orderItem=>orderItem.orderID);
        // let orderToBeRejected = Order.getAllOrders().filter(order=> prodcutOrderIds.filter((orderId)=> orderId == order.id).length && order.status == 0)
        
        // orderToBeRejected.forEach(order=>{
        //     Order.updateOrderStatus(order.id,2)
        //     let orderItems = OrderItem.getOrderItemsByOrderId(order.id)
        //     let orderItemStatus = 3;
        //     orderItems.forEach(orderItem => {
        //         if(productId == orderItem.productID){orderItemStatus = 2}
        //         else{orderItemStatus = 3}
                
        //         OrderItem.setOrderItemStatus(order.id,orderItem.productID,orderItemStatus)
        //     });
        // })
    }

    var seller = User.getCurrentUser()
    var sellerID = 2 //seller.id
    const sidebarToggle = document.getElementById('sidebarToggle');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const saveProductBtn = document.getElementById('saveProductBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const productImage = document.getElementById('productImage');
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const addProductBtn = document.getElementById('addProductBtn');
    const productTab =document.getElementById('products-tab');

    const productForm = document.getElementById('productForm');
    const saveBtn = document.getElementById('saveProductBtn');

    const stockInput = document.getElementById('productStock');
    const priceInput = document.getElementById('productPrice');
    const categorySelect = document.getElementById('productCategory');

    let isEditMode = true;

    //to show pop up to Add Product
    addProductBtn.addEventListener('click', function() {
        isEditMode=false;
        console.log(isEditMode);
        document.getElementById('productForm').reset();
        // document.getElementById('imagePreviewContainer').style.display = 'none';
        productModal.show();

    });

    const productName =document.getElementById("productName");
    productName.addEventListener('input', nameValidation);
    document.getElementById('productPrice').addEventListener('input', priceValidation);
    document.getElementById('productStock').addEventListener('input', stockValidation);
    // productTab.addEventListener('click',loadProductsTable);


    // document.getElementById('saveProductBtn').id = 'editProductBtn';
    // const editSaveBtn = document.getElementById('editProductBtn');

    // editSaveBtn.addEventListener('click', editProduct);

    saveProductBtn.addEventListener("click",save)
    function save(e){

        // if (nameInput =="" ||priceInput==""|| stockInput=="" ) {
        //     alert("required inputs can not be null");
        // }
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
        }
        productModal.hide();
        // console.log(!isEditMode);
        // e.validateForm();
        // console.log(isEditMode);
        // addNewProduct(e);
        // saveBtn.addEventListener('click',editProduct);
        // editSaveBtn.addEventListener('click',editProduct);
    }
    // productForm.addEventListener('submit', function(e) {
    //     e.preventDefault();

    //     // if (nameInput =="" ||priceInput==""|| stockInput=="" ) {
    //     //     alert("required inputs can not be null");
    //     // }
    //     let product = getFormData();

        
    //     if (isEditMode) {
    //         console.log(isEditMode);
    //         let productID= document.getElementById("saveProductBtn").dataset.id;
    //         product.id=productID;
    //         Product.updateProduct(product);
    //         // e.validateForm();
    //         // editProduct();
    //     }
    //     // console.log(!isEditMode);
    //     e.validateForm();
    //     // console.log(isEditMode);
    //     // addNewProduct(e);
    //     // saveBtn.addEventListener('click',editProduct);
    //     editSaveBtn.addEventListener('click',editProduct);

    // });

    // document.getElementById("saveProductBtn").addEventListener('click',function(e){

    // });
    

    // saveBtn.addEventListener('click',addNewProduct);



        // deleteModal.addEventListener('click',attachDeleteHandlers);

    // load images

    // async function uploadProductImage(productId, imageFile) {
    //     const formData = new FormData();
    //     formData.append('image', imageFile);
    //     formData.append('productId', productId);

    //     try {
    //         const response = await fetch('/api/upload-product-image', {
    //             method: 'POST',
    //             body: formData
    //         });

    //         if (!response.ok) throw new Error('Upload failed');
    //         return await response.json();
    //     } catch (error) {
    //         console.error('Image upload error:', error);
    //         alert('Image upload failed');
    //     }
    // }

    const fileInput = document.getElementById('fileInput');
    // if (!file) return alert("Please choose a file first.");


    // a.href = url;
    // a.download = file.name;
    // a.click();
    // URL.revokeObjectURL(url); // Clean up

    // function clickOnSaveButton(){
    //     isEditMode=false;
    //     productModal.show();

    // }

    function addNewProduct(e) {
        console.log("hello")
        isEditMode = false;
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);
        const image =document.getElementById("productImage").value;
        const categorySelect = document.getElementById('productCategory');
        let imageUrl = '';
        // Validate fields
            if (name == "") {
                console.log("Product name cannot be empty");
                isValid =false;
            }
            if (price =="") {
                showWarning(price, "Product price cannot be empty");
                isValid =false;
            }
            if ( stock =="") {
                showWarning(stock, "Product stock cannot be empty");
                isValid =false;

            }
            if (image =="") {
                showWarning(image, "Product image cannot be empty");
                isValid =false;
            }
            if (categorySelect.value =="") {
                console.log(categorySelect.value);
                showWarning(categorySelect, "Please select a category");
                isValid = false;
            }
            alert("fill required field");

        if ( price <= 0) {
            console.log("Price must be a positive number greater than 0");
            showWarning(document.getElementById('productPrice'), "Price must be greater than 0");
            isValid =false;
        }

        if (isNaN(stock) || stock < 0) {
            console.log("Stock quantity must be 0 or positive number");
            showWarning(document.getElementById('productStock'), "Invalid stock quantity");
            isValid =false;
        }

        if (!validateForm()) {
            // showWarning(e,message);
            console.log("Please fix validation errors before submitting");
            isValid =false;
        }
        if (!isValid) {
            console.log("Form has validation errors - submission prevented");
            return; // This return is CRUCIAL - it stops the function
        }

            const productData = {
                // id: isEditMode ? document.getElementById('productId').value : generateUniqueId(),
                name: document.getElementById('productName').value,
                price: parseFloat(document.getElementById('productPrice').value),
                stock: parseInt(document.getElementById('productStock').value),
                category: document.getElementById('productCategory').value,
                desc: document.getElementById('productDescription').value,
                imageUrl: document.getElementById('imagePreview')?.src || 'default.jpg',
                sellerID: sellerID//  dynamic seller ID
            };

            // const productId = document.getElementById('productId')?.value;
            // if (productId) {
            //     Product.updateProduct(productData);
            //     alert("Product updated successfully!");
            // } else {

                Product.addProduct(productData); // You need to implement this if not yet done
                alert("Product added successfully!");

            // const newProduct = new Product(productData);
            // // const file = image.files[0];
            // // const url = URL.createObjectURL(file);
            // // const a = document.createElement('a');
            // // a.href = url;
            // // a.download = newProduct.id;
            // // a.click();
            // // URL.revokeObjectURL(url); // Clean up
            // console.log(newProduct.id);
            // Product.addProduct(newProduct);
            // alert("Product added successfully!");
            // }
            // 3. Refresh the table and clean up
            // loadProductsTable();
            productForm.reset();
            productModal.hide();

    }

    // this.document.querySelectorAll('.edit-btn').addEventListener('clik',function(){

    // });

    function editProduct(e){
        // const productId = document.getElementById('productId').value;
    
        const editProductData = {
            
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            category: document.getElementById('productCategory').value,
            highlights: document.getElementById('highlights').value,
            instructions: document.getElementById('instructions').value,
            desc: document.getElementById('productDescription').value,
            imageUrl: document.getElementById('imagePreview')?.src || 'default.jpg',
            sellerID: sellerID // dynamic seller ID
        };

        if (validateForm() ) {

        Product.updateProduct(editProductData);
        alert("Product updated successfully!");

        // loadProductsTable();
        productForm.reset();
        productModal.hide();
    }
    // else{
    //     alert("fill inputs correctly")
    // }
    }

    function loadProductsTable() {
        console.log("From load Product Table")
        // Your seller ID
        const products = Product.getProductsBySeller(sellerID);
        const tbody = document.querySelector('#products-table');
        tbody.innerHTML = ''; // Clear existing rows

        products.forEach((product, index) => {
            tbody.innerHTML += `
                <tr data-id="${product.id}">
                    <td>${index + 1}</td>
                    <td><img src="${product.imageUrl}" width="50"></td>
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
        // attachEditHandlers();
        document.querySelectorAll('.edit-btn').forEach(button =>{
            button.addEventListener('click', function (e) {
                isEditMode=true;
                let productId = button.getAttribute('data-id');
                // console.log(productId);
                document.getElementById('productModalLabel').textContent = "Edit Product";
                // console.log(document.getElementById('productModal'));
                // console.log(document.getElementById("saveProductBtn"));

                
                document.getElementById("saveProductBtn").dataset.id=productId;
                // console.log("product id aapear "+productId);
                

                let product= Product.getProductById(productId);
                // console.log(product);
                
                fillProductForm(product);
                productModal.show();

                // if (productId ==product.id) {
                //     console.log(isEditMode);
                //     console.log(sellerID);
                //     editProduct(e);
                // }


                // Show the modal (assumes you're using Bootstrap modal)
        })

    });


                // editProduct();

}
loadProductsTable();
confirmDeleteBtn.addEventListener("click",confirmDelete)

    function getFormData(){
        
        return {
                // id:document.getElementById('productId').value = product.id,
                name:document.getElementById('productName').value,
                category:document.getElementById('productCategory').value,
                price:document.getElementById('productPrice').value,
                desc:document.getElementById('productDescription').value ,
                imageUrl:document.getElementById('imagePreview').src,
                stock:document.getElementById('productStock').value,
                highlights:document.getElementById('highlights').value,
                instructions:document.getElementById('instructions').value,
        }
    }

    // function attachDeleteHandlers() {
    //     document.querySelectorAll('.delete-btn').forEach(button => {
    //         button.addEventListener('click', function(e) {
    //             // productToDelete = e.target.dataset.id;
    //             document.getElementById("deleteModal");
    //             deleteModal.show();
    //         });
    //     });
    // }

    // function attachEditHandlers() {
    //     document.querySelectorAll('.edit-btn').forEach(button =>{
    //         button.addEventListener('click',function(e){

    //             const productId = e.target.dataset.id;
    //             console.log(productId);
    //             const product = Product.getProductById(productId);
    //             console.log(product);
    //             if (product) {
    //                 fillProductForm(product);
    //                 document.getElementById('productModalLabel').textContent = "Edit Product";
    //                 document.getElementById('productId').value = product.id;

    //                 productModal.show();
    //             }

    //         const editProductData = {
    //         name: document.getElementById('productName').value,
    //         price: parseFloat(document.getElementById('productPrice').value),
    //         stock: parseInt(document.getElementById('productStock').value),
    //         category: document.getElementById('productCategory').value,
    //         desc: document.getElementById('productDescription').value,
    //         imageUrl: document.getElementById('imagePreview')?.src || 'default.jpg',
    //         sellerID: '3' // dynamic seller ID
    //         };
    //         // const productId_ = document.getElementById('productId').value;
    //         Product.updateProduct(editProductData);
    //         console.log(editProductData);
    //         alert("Product updated successfully!");

    //         loadProductsTable();
    //         productForm.reset();
    //         productModal.hide();


    //         })
    //     });

    // }
    // function attachEditHandlers() {
    //     document.querySelectorAll('.edit-btn').forEach(button => {
    //         button.addEventListener('click', function (e) {
    //             const productId = e.target.dataset.id;
    //             console.log(productId);
    //             const product = Product.getProductById(productId);

    //             if (product) {
    //             Product.updateProduct(editProductData);

    //                 // fillProductForm(product); // fills the modal form inputs
    //                 document.getElementById('productModalLabel').textContent = "Edit Product";
    //                 document.getElementById('productId').value = product.id;
    //                 productModal.show();
    //             }
    //         });
    //     });
    // }
    // document.getElementById('productForm').addEventListener('submit', function (e) {
        function EditProductTry50_Cry(){
            // e.preventDefault();
            const productId = document.getElementById('productId').value;
            document.getElementById('productModalLabel').textContent = "Edit Product";
            productModal.show();
            const editProductData = {
                id: productId, // very important for updateProduct
                name: document.getElementById('productName').value,
                price: parseFloat(document.getElementById('productPrice').value),
                stock: parseInt(document.getElementById('productStock').value),
                category: document.getElementById('productCategory').value,
                desc: document.getElementById('productDescription').value,
                imageUrl: document.getElementById('imagePreview')?.src || 'default.jpg',
                sellerID: sellerID // or get dynamically
            };

            try {
                Product.updateProduct(editProductData);
                alert("Product updated successfully!");
                // loadProductsTable();
                productForm.reset();
                productModal.hide();
            } catch (error) {
                alert(error.message);
            }
    }
    // });

    function DeleteProduct(e){
        
        console.log("from Delete");
        const parentTr= e.target.closest("tr");
        let productId = parentTr.dataset.id
        confirmDeleteBtn.dataset.id = productId;
        deleteModal.show()


    }

    function attachDeleteHandlers() {
        let deleteBtns = document.querySelectorAll('.delete-btn');
        console.log(deleteBtns)
        deleteBtns.forEach(button =>{
            button.addEventListener('click',DeleteProduct)
        });
    }
    function fillProductForm(product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.desc || '';
        document.getElementById('highlights').value = product.highlights || '';
        document.getElementById('instructions').value = product.instructions || '';

        // Image preview
        if (product.imageUrl) {
            document.getElementById('imagePreview').src = product.imageUrl;
            document.getElementById('imagePreviewContainer').style.display = 'block';
        }else {
            document.getElementById('imagePreviewContainer').style.display = 'none';
        }
    }

    // updateProduct()

    // try combine validation
    var nameProductValidation = false;
    var priceProductValidation =false;
    var stockQuantityValidation =false;

    function validateForm() {
        let isValid = true;

        if(nameProductValidation == true && priceProductValidation == true && stockQuantityValidation ==true){
            return isValid;
        }
        isValid =false;
    }

    function nameValidation(nameInput){
        nameInput.value = nameInput.value.replace(/\d/g, '');
            if (/\d/.test(nameInput.value)) {
                showWarning(this, "Numbers are not allowed in product names");
                console.log(nameInput.value);
                nameProductValidation=false;
                return false;
            }if (nameInput.value < 3 || nameInput.value == "") {
                showWarning(this, "Name must be at least 3 characters ,can not be null");
                nameProductValidation=false;

                return false;
            }else{
                nameProductValidation =true;
                return true;
            }
    }

    function priceValidation(e){
        if( e.target.value <=0  && e.target.value=="" )
        {
            priceInput.classList.add('.invalid');
        showWarning(this, "price must be greater than zero ");
        priceProductValidation=false;
        return false;
        }else{
            priceProductValidation=true;
            return true;
        }
    }

    function stockValidation(e){

        if (e.target.value == "") {
            showWarning(this, "Stock cannot be decimal");
            stockQuantityValidation = false;
            return false;
        }  if (isNaN(e.target.value)) {
            showWarning(this, "Please enter a valid stock quantity");
            stockQuantityValidation = false;
            return false;

        }  if (e.target.value <= 0) {
            showWarning(this, "Stock cannot be negative");
            stockQuantityValidation = false;
            return false;

        }else{
            stockQuantityValidation=true;
            return true;

        }
    }














    attachDeleteHandlers()

    console.log(sellerID)


}); //End of DOMContentLoaded Event to Window



    function showWarning(input, message) {
        const warning = document.createElement('div');
        warning.className = 'input-warning';
        warning.textContent = message;
        warning.style.color = 'red';
        warning.style.fontSize = '0.8rem';

        // Add warning if not already there
        // if (!input.nextElementSibling?.classList.contains('input-warning')) {
        //     input.insertAdjacentElement('afterend', warning);
        //     setTimeout(() => warning.remove(), 2000);
        // }
    }

const productModal = document.getElementById('productModal');

productModal.addEventListener('hidden.bs.modal', () => {
    if (document.activeElement && productModal.contains(document.activeElement)) {
    document.activeElement.blur();
    }
});
