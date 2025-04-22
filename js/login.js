import { redirect , createAlert, getFormFields } from "./util.js";
import { Auth } from "./modules/authModule.js";

document.addEventListener('DOMContentLoaded',()=>{
    const form = document.getElementById('loginform');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const data = getFormFields('loginform');
        const success = Auth.login(data); 

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (success) {
            

            sessionStorage.setItem("flashAlert", JSON.stringify({
                title: "Login Successful",
                type: "success",
                message: "Welcome back!"
            }));
           

            redirect(form.getAttribute('action'));

        } else {
            const createdAlert = createAlert("Login Failed", "danger", "Invalid Email or Password");

            
            setTimeout(() => {
                createdAlert.remove();
            }, 10000);
        }
    });
});



