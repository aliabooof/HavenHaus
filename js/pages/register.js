
import { redirect , createAlert, getFormFields } from "../util.js";
import {Auth} from "../modules/authModule.js";

console.log("hey");


document.addEventListener('DOMContentLoaded',()=>{
  
   
    const form = document.getElementById('registerform');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getFormFields("registerform");
      if (Auth.register(data)) {
          const createdAlert =  
            createAlert("You have been registered successfully!" , "success" , "You will be redirected to the login page in 5 seconds.");
          
          const elements = Array.from(form.elements);
          elements.forEach(element => {
            element.disabled = true;
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });

          window.setTimeout(() => {            
              redirect(form.getAttribute('action'));
          }, 5000);
      }else{
        const createdAlert = createAlert("Account is already existed!" , "warning");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.setTimeout(() => {
          createdAlert.remove();
        }, 5000);
      }
  });
});








