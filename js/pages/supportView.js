import { Component } from "../componentModules/components.js"
import { Inquiry } from "../modules/inquiryModule.js";
import { User } from "../modules/userModule.js";
import { convertToHtmlElement, fetchComponent, observeElements, redirect } from "../util.js";
import { Auth } from "../modules/authModule.js";

await Component.renderNavbar();
await Component.renderFooter();
await Component.renderCartOffcanvas();

const newInquiry1 = document.getElementById("new-inquiry-button");
console.log(document.getElementById("new-inquiry-button2"));
const newInquiry2 = document.getElementById("new-inquiry-button2");
newInquiry2.addEventListener("click",()=>redirect('../../login.html'));


if(Auth.isLoggedIn()){
    const inquiries = Inquiry.getInquiriesByUser(User.getCurrentUser().id||[]);
    newInquiry1.classList.remove("d-none");
    newInquiry2.classList.add("d-none");
    if(inquiries.length !== 0 ){
        for (const inquiry of inquiries){
            console.log(inquiry.details.status);
            await Component.renderInquiryCard(inquiry);
        }
    }else{
        let notfound = await fetchComponent("../../components/no-product-found.html");
        notfound = convertToHtmlElement(notfound);
        notfound.querySelector("h2").innerText = "No Inquiries Available!";
        notfound.querySelector("p").innerText ="We couldn’t find any inquiries at the moment. Please check back later or submit a new inquiry if you need assistance.";
        notfound.removeChild( notfound.querySelector("a"))
        document.getElementById("not-found-element").appendChild(notfound)
    }


}


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




observeElements();