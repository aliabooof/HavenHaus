import { createAlert,observeElements } from "../util.js";
import { Component } from "../componentModules/components.js";
import { Product } from "../modules/productModule.js";
import { Auth } from "../modules/authModule.js";




   await Component.renderNavbar();
   await Component.renderFooter();
   if(Auth.isLoggedIn())
        await Component.renderCartOffcanvas();
   const flashData = sessionStorage.getItem("flashAlert");

    if (flashData) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const { title, type, message } = JSON.parse(flashData);
        const alertEl = createAlert(title, type, message);

        
        setTimeout(() => {
            alertEl.remove();
        }, 5000);

        
        sessionStorage.removeItem("flashAlert");
    }

    let catArray = Product.getAllProductsCategories();
    console.log(catArray)
    // await catArray.forEach(async cat => {
    //      await Component.renderCategoryCard(cat);
        
    // });

    for (const cat of catArray) {
        await Component.renderCategoryCard(cat);
    }
    

    observeElements();



    
