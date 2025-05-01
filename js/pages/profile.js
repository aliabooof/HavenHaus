import { User } from "../modules/userModule.js";
import { Component } from "../componentModules/components.js";
import { createAlert} from "../util.js";
import {Validation} from "../modules/validation.js";


await Component.renderNavbar();
await Component.renderFooter();

let currentUser = User.getCurrentUser();
let ususername = document.getElementById("username");

const fields = {
    fullName: document.getElementById("fullname"),
    profileEmail: document.getElementById("profile_email"),
    editProfile: document.getElementById("editProfile"),
    cancel: document.getElementById("cancel"),
    saveChanges: document.getElementById("saveChanges"), 
    profileInfo: document.getElementById("profileInfo"),
    profileForm: document.getElementById("profileForm"),
    fName: document.getElementById("fName"),
    lName: document.getElementById("lName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    fNameInput: document.getElementById("fNameInput"),
    lNameInput: document.getElementById("lNameInput"),
    emailInput: document.getElementById("emailInput"),
    phoneInput: document.getElementById("phoneInput")
};

UpdateChanges(currentUser);

fields.editProfile.addEventListener('click', (e) => {
    // e.target.style.display = "none";
    fields.saveChanges.style.display = "inline";
    DisplayEdit(e.target);
    SetFormData();
});

fields.cancel.addEventListener('click', (e) => {
    // e.target.style.display = "none";
    DisplayInfo(e.target);
});

fields.saveChanges.addEventListener('click', (e) =>{
    let fname = fields.fNameInput.value.trim();
    let lname = fields.lNameInput.value.trim();
    let email = fields.emailInput.value.trim();
    let phone = fields.phoneInput.value.trim();
    if (IsDataChanged(fname, lname, email, phone)){
        let u = UpdateUser(fname, lname, email, phone);
        if(ValidateEditProfile()){
            User.updateUser(u);
            DisplayInfo(e.target);
            fields.cancel.style.display = "none";
            fields.editProfile.style.display = "inline";
            currentUser = User.getCurrentUser();
            UpdateChanges(currentUser);
            ususername.innerText = fname + " " + lname;
            createAlert("Account information has been successfully updated.", "success");
        }
    }else{
        createAlert("You did not make any changes.", "secondary");
    }
});

function SetFormData(){
    fields.fNameInput.value = currentUser.firstName;
    fields.lNameInput.value = currentUser.lastName;
    fields.emailInput.value = currentUser.email;
    fields.phoneInput.value = currentUser.phone;
}

function IsDataChanged(fn, ln, em, ph){
    if (fn == currentUser.firstName && ln == currentUser.lastName && em == currentUser.email && ph == currentUser.phone){
        return false;
    }else{
        return true;
    }
}

function UpdateUser(fn, ln, em, ph){
    let user = Object.assign({}, currentUser);
    user.firstName = fn;
    user.lastName = ln;
    user.email = em;
    user.phone = ph;
    return user;
}

function ValidateEditProfile(){
    let isValid = true;
    let firstInvalidField = null;

    const validations = [
        { field: fields.fNameInput, method: Validation.validateName, message: "Enter a valid first name." },
        { field: fields.lNameInput, method: Validation.validateName, message: "Enter a valid last name." },
        { field: fields.emailInput, method: Validation.validateEmail, message: "Enter a valid email address." },
        { field: fields.phoneInput, method: Validation.validatePhone, message: "Enter a valid phone number." },
    ];

    validations.forEach(({field, method, message})=>{
        if(!method(field.value.trim())){
            Validation.showError(field, message);
            isValid = false;
            firstInvalidField = field;
        }else{
            Validation.clearError(field, message);
        }
    });

    if(!isValid && firstInvalidField){
        firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalidField.focus();
    }

    return isValid;
}

function DisplayInfo(target){
    target.style.display = "none";
    fields.profileInfo.style.display = "block";
    fields.profileForm.style.display = "none";
    fields.editProfile.style.display= "inline";
}

function DisplayEdit(target){
    target.style.display = "none";
    fields.profileInfo.style.display = "none";
    fields.profileForm.style.display = "block";
    fields.cancel.style.display= "inline";
}

function UpdateChanges(current_user){
    fields.fullName.innerText = current_user.firstName + " " + currentUser.lastName;
    fields.profileEmail.innerText = current_user.email;
    fields.fName.innerText = current_user.firstName;
    fields.lName.innerText = current_user.lastName;
    fields.email.innerText = current_user.email;
    fields.phone.innerText = current_user.phone;
}