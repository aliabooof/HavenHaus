import {User} from "./userModule.js"
import { redirect , createAlert, getFormFields } from "./util.js";
import { SetTable } from "./db.js"

document.addEventListener('DOMContentLoaded',()=>{
    const form = document.getElementById('loginform');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        console.log("heyy");

        const success = login(); 

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



function login() {
    const loginFormData = getFormFields("loginform");

   
    const loginEmail = loginFormData.email.toLowerCase();
    const loginPassword = loginFormData.password;

    const user = User.getUserByEmail(loginEmail);

    if (!user) {
        console.log("Email not found.");
        return false;
    }

    if (user.password === loginPassword) {
        SetTable("currentUser", user);
        console.log("Login successful. User:", user);
        return true;
    } else {
        console.log("Incorrect password.");
        return false;
    }

}