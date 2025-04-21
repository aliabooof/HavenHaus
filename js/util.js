function ChangeQuantity(qElement,value){
    qElement.innerText = Number(qElement.innerText)+value;
    
}
function GetQuantityElement(event){
    return  event.target.parentElement.querySelector("#quantity");
}
export function IncreaseQuantity(event,stock){
    let qElement = GetQuantityElement(event)
    if(Number(qElement.innerText.trim()) == stock)
        return;
    ChangeQuantity(qElement,1)
}
export function DecreaseQuantity(event){
    let qElement = GetQuantityElement(event)
    if(Number(qElement.innerText.trim()) == 1)
        return;
    ChangeQuantity(qElement,-1)
}



export function redirect(pageName){
    window.location.href = pageName;
}

export function createAlert(message, color, subMessage = "") {
  

    const alert = document.createElement("div");
    alert.classList.add("alert", `alert-${color}`, "alert-dismissible", "fade", "show");
    alert.setAttribute("role", "alert");

    alert.innerHTML = `
        <strong>${message}</strong><br>
        ${subMessage}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

 
    alert.style.position = "fixed";
    alert.style.top = "20px";
    alert.style.right = "20px";
    alert.style.width = "300px";
    alert.style.zIndex = "1055"; 
    alert.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    
    document.body.appendChild(alert);
    return alert;
}

export function GetUrlField(fieldName){
    return window.location.search.split(fieldName+"=")[1].split("&")[0]
}

export function getFormFields(id){
    //gets the form data by id
    let form = document.getElementById(id);
    return  new FormData(form);
    
}
