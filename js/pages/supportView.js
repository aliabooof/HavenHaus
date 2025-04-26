import { Component } from "../componentModules/components.js"
import { Inquiry } from "../modules/inquiryModule.js";
import { User } from "../modules/userModule.js";
import { convertToHtmlElement, fetchComponent, observeElements } from "../util.js";

await Component.renderNavbar();
await Component.renderFooter();
await Component.renderCartOffcanvas();

const inquiries = Inquiry.getInquiriesByUser(User.getCurrentUser().id||[]);


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

observeElements();