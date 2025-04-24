// import {GetAllProducts} from '../js/modules/db.js';
import {Product} from "./modules/productModule.js"
// import {createProductCards} from './db.js';

import {convertToHtmlElement, fetchComponent} from './util.js';
let cardComponent = await fetchComponent("../components/product-card.html")
// export function GetAllProducts() {
//     return GetTable("product");
//     }


    // view result as cards 
    export function createProductCards(products) {
        return products.map(product=>{
            let card = convertToHtmlElement(cardComponent)
            card.querySelector("h5").innerText = product.name;
            // card.querySelector("img").src = product.imageUrl;
            card.querySelector("span").innerText = product.price;
            return card;

        })
    }
                                                                //search by price 
var priceChange =document.getElementById("priceFilter");
const products =  Product.getAllProducts();

let container = document.getElementById("cards-container")
createProductCards(products).forEach(card => {
    container.appendChild(card)
    
});

priceChange.addEventListener('change', function() {
    const sorted = [...products]; // Copy array to prevent impact in original sort 
    if(this.value === 'price-low-high') {
    sorted.sort((a, b) => a.price - b.price);
    } else if(this.value === 'price-high-low') {
    sorted.sort((a, b) => b.price - a.price);
    }
    let container = document.querySelector('#cards-container');
    container.innerHTML = ""
    createProductCards(sorted).forEach(card => {
        container.appendChild(card)
        
    });
});
            // Initial display in beginner
        // createProductCards(products);
        
//                                                                         //search text 
            
        var searchInput = document.querySelector('input[type="text"]');

        searchInput.addEventListener('input',handleSearchWithInput);

        function handleSearchWithInput ()  {
            const searchTerm = searchInput.value.toLowerCase().trim();//             // Filter products by name or description
            const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.desc.toLowerCase().includes(searchTerm)
            );
            
            container.innerHTML = ""
            createProductCards(filteredProducts).forEach(card => {
                container.appendChild(card)
                
            });
        };
//         createProductCards(products);


var chooseCategory =document.querySelector('.form-select');
chooseCategory.addEventListener('change',searchByCategory);
function searchByCategory(){  
    // const filterCategory =products.filter(product=>
        container.innerHTML = ""
        if(chooseCategory.value == 'all'){
            createProductCards(products).forEach(card => {
                container.appendChild(card) 
            });

        } else {
            let catProducts = Product.getProductsByCatId(chooseCategory.value)
            createProductCards(catProducts).forEach(card=> 
            {
                container.appendChild(card)
            }
            );
        }
    
    
}

// });