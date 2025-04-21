import {User} from "./userModule.js"
import { redirect , createAlert } from "./util.js";

let userArray = (JSON.parse(localStorage.getItem('users'))||[]).map((userObj)=> new User(userObj));
console.log(userArray);

document.addEventListener('DOMContentLoaded',()=>{
  
   
    const form =document.getElementById('registerform');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (register()) {
          const createdAlert =  
            createAlert("You have been registered successfully!" , "success" , "You will be redirected to the login page in 5 seconds.");

          window.scrollTo({ top: 0, behavior: 'smooth' });

          window.setTimeout(() => {
            createdAlert.remove();
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



function getFormFields(id){
    let form = document.getElementById(id);
    return  new FormData(form);
    
}


function register(){ 
  const registerForm = getFormFields("registerform");
  const data = Object.fromEntries(registerForm.entries());
  const user = new User(data);

  const exists = userArray.some(u => u.email === user.email);

  if (!exists) {
    userArray.push(user);
    localStorage.setItem('users', JSON.stringify(userArray));
    return true;
  } else {
    return false;
  }
}





