import {User} from "./userModule.js"
import { redirect , createAlert, getFormFields } from "./util.js";
import {GetTable , SetTable } from "./db.js"

let userArray = (GetTable("user")||[]).map((userObj)=> new User(userObj));


document.addEventListener('DOMContentLoaded',()=>{
  
   
    const form =document.getElementById('registerform');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (register()) {
          const createdAlert =  
            createAlert("You have been registered successfully!" , "success" , "You will be redirected to the login page in 5 seconds.");
          
          const elements = Array.from(form.elements);
  
          console.log(form.elements);
          console.log(elements);
        
          
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




function register(){ 
  const registerFormData = getFormFields("registerform");
  
  const user = new User(registerFormData);

  const exists = userArray.some(u => u.email === user.email);

  if (!exists) {
    userArray.push(user);
    SetTable("user",userArray);
    return true;
  } else {
    return false;
  }
}





