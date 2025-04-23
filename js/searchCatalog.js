// // import { GetAllProducts} from './db.js';

// import {GetAllProducts} from './db.js';
// import {createProductCards} from './db.js';

// // import {GetProductByID} from './db.js';

//                                                                 //search by price 
// // window.addEventListener('load', function () {

//     var priceChange =document.getElementById("priceFilter");
//     const products =  GetAllProducts("Product");
//     console.log("Products:", products);

//     priceChange.addEventListener('change', function() {
//         const sorted = [...products]; // Copy array to prevent impact in original sort 
        
//         if(this.value === 'price-low-high') {
//         sorted.sort((a, b) => a.price - b.price);
//         } else if(this.value === 'price-high-low') {
//         sorted.sort((a, b) => b.price - a.price);
//         }
//         document.querySelector('.row.g-4').innerHTML = 
//             createProductCards(sorted);
//     });
//             // Initial display in beginner
//         createProductCards(products);
        
//                                                                         //search text 
            
//         var searchInput = document.querySelector('input[type="text"]');

//         searchInput.addEventListener('input',handleSearchWithInput);

//         function handleSearchWithInput ()  {
//             const searchTerm = searchInput.value.toLowerCase().trim();

//             console.log(searchTerm);

//             // Filter products by name or description
//             const filteredProducts = products.filter(product => 
//             product.name.toLowerCase().includes(searchTerm) || 
//             product.desc.toLowerCase().includes(searchTerm)
//             );
            
//             // Display results
//             document.querySelector('.row.g-4').innerHTML = 
//             createProductCards(filteredProducts);
//         };
//         createProductCards(products);

//         //search by category  id /name 

//         var chooseCategory =document.querySelector('.form-select');

//         chooseCategory.addEventListener('change',searchByCategory);

//         function searchByCategory(){
//             // const filterCategory =products.filter(product=>
//                 if(chooseCategory.value == 'all'){
//                     return products;
//                 }   
//                 const categoryId = products.category;
//                 return products.filter(product => product.category === categoryId);
            
            
//         }


