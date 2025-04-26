import { Inquiry } from "../modules/inquiryModule.js";
import { redirect } from "../util.js";
import { Auth } from "../modules/authModule.js";
import { User } from "../modules/userModule.js";
import  "../load_db.js"


document.querySelector('form').addEventListener('submit', function(event) {
    if(!Auth.isLoggedIn())
        redirect("../../login.html")
    
    event.preventDefault();
    let userId = User.getCurrentUser().id;

    const inquiryData= {
        id: userId, 
        title: document.getElementById('title').value.trim(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    let inquiry = new Inquiry(...Object.values(inquiryData))
    // console.log('Form submitted:', formData);
    Inquiry.addInquiry(inquiry)

    alert("Thank you for your inquiry, " + inquiryData.name + "! We'll get back to you soon.");

});
