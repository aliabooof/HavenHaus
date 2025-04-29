import { getTable } from "/js/modules/db.js";
import {Product } from '/js/modules/productModule.js';

window.addEventListener('DOMContentLoaded', function(){

    const sidebarToggle = document.getElementById('sidebarToggle');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    //     const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const productForm = document.getElementById('productForm');
    // const addProductBtn = document.getElementById('addProductBtn');
    //     const saveProductBtn = document.getElementById('saveProductBtn');
    //     const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    //     const productImage = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    // const productTable =this.document.getElementById('products-table');

    const productTab =document.getElementById('products-tab');
    productTab.addEventListener('click',loadProductsTable);


});

// function loadProductsTable() {
//     const productTable = document.querySelector('#products-table');
//     productTable.innerHTML = '';
    
//     const sellerID = '4';
//     const products = Product.getProductsBySeller(sellerID);
//     // Create table element
//     const table = document.createElement('table');
//     table.classList.add('product-table');
    
//     // Create table header
//     const thead = document.querySelector('#products_id');
//     // Create table body
//     const tbody = document.querySelector('#products-table');
    
//     // Add each product as a row
//     products.forEach(product => {
//         const row = document.createElement('tr');
//         row.classList.add('product-row');
//         row.innerHTML = `
//             <td>${product.id }</td>
//             <td><img src="${product.imageUrl}" alt="${product.name}" class="product-image"></td>
//             <td>${product.name}</td>
//             <td>$${product.price}</td>
//             <td>${product.stock}</td>
//             <td>${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</td>
//             <td>${product.desc}</td>
//         `;
//         tbody.appendChild(row);
//     });
    
//     // table.appendChild(tbody);
//     productTable.appendChild(thead);

//     console.log("Products for seller ID " + sellerID, products);
// }

// loadProductsTable();

function loadProductsTable() {
    const tbody = document.querySelector('#products-table');
    tbody.innerHTML = ''; // Clear existing rows
    const sellerID = '3';

    console.log(`Fetching products for seller ID: ${sellerID}`);

    const products = Product.getProductsBySeller(sellerID);

    console.log('Product class exists:', typeof Product !== 'undefined');

    console.log('Raw products data:', products); 

    // Add each product as a row
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id || 'N/A'}</td>
            <td><img src="${product.imageUrl || 'default-image.jpg'}" alt="${product.name}" class="product-image" style="max-width: 80px;"></td>
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
                    ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            // <td>
            //     <button class="btn btn-sm btn-primary">Edit</button>
            //     <button class="btn btn-sm btn-danger ms-2">Delete</button>
            // </td>
        `;
        tbody.appendChild(row);
    });

    console.log( products);
}

loadProductsTable();

// function displaySellerProducts(sellerID) {
//     // const products = Product.getProductsBySeller(sellerID);  // Use the Product class to get products by seller
//     // console.log(products);
    
//     // var getAllProducts =Product.getAllProducts();
//     // console.log(getAllProducts);
//     // var products_seller = getAllProducts.filter(product => product.sellerID === sellerID);
//     // console.log(products_seller);
    
//     if (products.length === 0) {
//         console.log('No products found for this seller.');
//         return;
//     }
// }

// function loadProductsTable(){
//     const productTable =document.querySelector('#products-table');
//     productTable.innerHTML='';
    
//     const sellerID = '4';

//     // const products =Product.getAllProducts();
//     const products = Product.getProductsBySeller(sellerID);  // Use the Product class to get products by seller

//     products.forEach(product => {
//         const productItem = document.createElement('li');
//         productItem.classList.add('product-item');
//         productItem.innerHTML = `
//             <img src="${product.imageUrl}" alt="${product.name}">
//             <h3>${product.name}</h3>
//             <p>${product.desc}</p>
//             <p>Price: $${product.price}</p>
//         `;
//         productList.appendChild(productItem);
//     });

//     let producttabbledata=getTable();
    
//     console.log(products);

//     // console.log(productsWithSpecificSeller);


//     }

//     loadProductsTable();

    // function loadProductsTable() {
    //     const productTable = document.querySelector('#products-table');
    //     productTable.innerHTML = '';
        
    //     const sellerID = '4';
    //     const products = Product.getProductsBySeller(sellerID);

    //     console.log(Product.sellerID)
    //     // Create table element
    //     const table = document.createElement('tr');
    //     table.classList.add('product-table');
        
    //     // Create table header
    //   // Add each product as a row
    //   products.forEach(product => {
    //     const row = document.createElement('tr');
    //     row.classList.add('product-row');
    //     row.innerHTML = `
    //         <td><img src="${product.imageUrl}" alt="${product.name}" class="product-image"></td>
    //         <td>${product.name}</td>
    //         <td>$${product.price}</td>
    //         <td>$${product.stock}</td>
    //         <td>$${product.price}</td>
    //         <td>${product.desc}</td>
    //     `;
    //     tbody.appendChild(row);
    // });
    
    // productTable.appendChild(table);
        
    //     // Create table body
        
     
    // }
    
    // loadProductsTable();