import { getTable } from "/js/modules/db.js";
import {Product } from '/js/modules/productModule.js';
// import { Product } from "../modules/productModule";

window.addEventListener('DOMContentLoaded', function(){

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

    //to show pop up to Add Product
        addProductBtn.addEventListener('click', function() {
        document.getElementById('productForm').reset(); 
        document.getElementById('imagePreviewContainer').style.display = 'none'; 
        productModal.show(); 
    });


    productTab.addEventListener('click',loadProductsTable);

    saveProductBtn.addEventListener('click',addNewProduct );

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

    // const productName =this.document.getElementById("productName");

    // function nameValidation()
    // document.getElementById('productName').addEventListener('input', function(e) {
    //     this.value = this.value.replace(/\d/g, '');
    //     if (/\d/.test(e.data)) { 
    //         showWarning(this, "Numbers are not allowed in product names");
    //     }
    // });

    // document.getElementById('productPrice').addEventListener('input', function(e) {
    //     // Convert to number (allow decimals)
    //     const price = parseFloat(this.value);
        
    //     // Check if valid number and > 0
    //     if (isNaN(price)) {
    //         // Handle empty input (optional)
    //         this.classList.remove('is-invalid');
    //     } else if (price <= 0) {
    //         // Invalid: Negative or zero
    //         this.value = ''; // Clear invalid input
    //         this.classList.add('invalid');
    //         showWarning(this, "Price must be greater than 0");
    //     } else {
    //         // Valid
    //         this.classList.remove('invalid');
    //     }
    // });

    // stockInput.addEventListener('input', function() {
    //     // Convert to number (allow decimals)
    //     const stockValue = stockInput.value;
    //     const hasDecimal = /[.,]/.test(stockValue);
    //     if( hasDecimal){
    //         showWarning(this,"stock can not be decimal");
    //     }
    //     // Check if valid number and > 0
    //     else if (isNaN(price)) {
    //         // Handle empty input (optional)
    //         this.classList.remove('is-invalid');
    //     } else if (price <= 0) {
    //         // Invalid: Negative or zero
    //         this.value = ''; // Clear invalid input
    //         this.classList.add('invalid');
    //         showWarning(this, "Price must be greater than 0");
    //     } else {
    //         // Valid
    //         this.classList.remove('invalid');
    //     }
    // });

    function addNewProduct() {
        if (validateForm()) {
        // 1. Get form data
        const productData = {
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            category: document.getElementById('productCategory').value,
            desc: document.getElementById('productDescription').value,
            imageUrl: document.getElementById('imagePreview')?.src || 'default.jpg',
            sellerID: '3' //  dynamic seller ID 
        };
        console.log(productData);
        
        var nameInput =document.getElementById('productName').value;
        console.log(nameInput);
        if (validateProducproductData) {
            if (!productData.name || productData.price <= 0 || productData.stock <= 0) {
                alert("Please fill all fields correctly!");
                return;
            }
        }
        // nameInput.classList.remove('invalid');
        // return true;
         // 3. Create and save the product
        const newProduct = new Product(productData);
        Product.addProduct(newProduct); // This saves to localStorage via db.js
        console.log(newProduct);

        // 4. Refresh the table
        loadProductsTable();
        // const imageFile = document.getElementById('productImage').files[0];
        // if (imageFile) {
        //      uploadProductImage(productId, imageFile);
        // }
        
        // 4. Refresh UI
        loadProductsTable();
        this.reset();

        // 5. Close modal and show feedback
        productModal.hide();
        alert("Product added successfully!");
    }
    else{
        console.log("Please fix the errors before submitting");
    }
        }

        function showWarning(input, message) {
            const warning = document.createElement('div');
            warning.className = 'input-warning';
            warning.textContent = message;
            warning.style.color = 'red';
            warning.style.fontSize = '0.8rem';
            
            // Add warning if not already there
            if (!input.nextElementSibling?.classList.contains('input-warning')) {
                input.insertAdjacentElement('afterend', warning);
                setTimeout(() => warning.remove(), 2000);
            }
        }
    

    function loadProductsTable() {
        const sellerID = '3'; // Your seller ID
        const products = Product.getProductsBySeller(sellerID);
        const tbody = document.querySelector('#products-table');
        tbody.innerHTML = ''; // Clear existing rows
    
        products.forEach((product, index) => {
            tbody.innerHTML += `
                <tr>
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
    
        // Add event listeners for edit/delete buttons
        // attachEditDeleteHandlers();
    }

    


    // try combine validation 

    function validateForm() {
        let isValid = true;
        
        // Validate Product Name
        const nameInput = document.getElementById('productName');
        nameInput.value = nameInput.value.replace(/\d/g, ''); // Remove numbers
        if (nameInput.value.length < 3) {
            showWarning(nameInput, "Name must be at least 3 characters");
            isValid = false;
        }
        
        // Validate Price
        const priceInput = document.getElementById('productPrice');
        const price = parseFloat(priceInput.value);
        if (isNaN(price) ){
            showWarning(priceInput, "Please enter a valid price");
            isValid = false;
        } else if (price <= 0) {
            showWarning(priceInput, "Price must be greater than 0");
            isValid = false;
        }
        
        // Validate Stock
        const stockInput = document.getElementById('productStock');
        const stockValue = stockInput.value;
        const stock = parseInt(stockValue);
        
        if (/[.,]/.test(stockValue)) {
            showWarning(stockInput, "Stock cannot be decimal");
            isValid = false;
        } else if (isNaN(stock)) {
            showWarning(stockInput, "Please enter a valid stock quantity");
            isValid = false;
        } else if (stock < 0) {
            showWarning(stockInput, "Stock cannot be negative");
            isValid = false;
        }
        
        // Validate Category
        const categorySelect = document.getElementById('productCategory');
        if (!categorySelect.value) {
            showWarning(categorySelect, "Please select a category");
            isValid = false;
        }
        
        return isValid;
    }









    



}); //End of DOMContentLoaded Event to Window 





//     const products = Product.getProductsBySeller(sellerID);
//     // Add each product as a row
//     products.forEach((product ,index) => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${index + 1}</td>
//             <td><img src="${product.imageUrl || 'default-image.jpg'}" alt="${product.name}" class="product-image" style="max-width: 80px;"></td>
//             <td>${product.name}</td>
//             <td>$${product.price.toFixed(2)}</td>
//             <td>${product.stock}</td>
//             <td>
//                 <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
//                 ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
//                 </span>
//             </td>
//             <td>
//                 <button class="btn btn-sm btn-primary"><i class="bi bi-pencil-square"></i>Edit</button>
//                 <button class="btn btn-sm btn-danger ms-2">Delete</button>
//             </td>
//         `;
//         tbody.appendChild(row);
//     });
// }

// loadProductsTable(); 


