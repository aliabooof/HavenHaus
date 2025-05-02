function ChangeQuantity(quantityEle,value){
    quantityEle.innerText = Number(quantityEle.innerText)+value;
    
}
function GetQuantityElement(event){
    return  event.target.parentElement.querySelector(".quantity");
}
function GetStockElement(event){
    return  event.target.parentElement.querySelector(".stock");
    
}
function QuantityBtnDisable(quantityEle ,minusBtn,plusBtn){
    let decBtn = quantityEle.previousElementSibling;
    decBtn.disabled = minusBtn;
    let incBtn = quantityEle.nextElementSibling;
    incBtn.disabled = plusBtn
}
export function IncreaseQuantity(event){
    let quantityEle = GetQuantityElement(event);
    let stockEle = GetStockElement(event);
    if(Number(quantityEle.innerText.trim()) == Number(stockEle.innerText.trim())){
        QuantityBtnDisable(quantityEle, false, true)
        return;
    }
    QuantityBtnDisable(quantityEle, false, false)
    ChangeQuantity(quantityEle,1)
}
export function DecreaseQuantity(event){
    let quantityEle = GetQuantityElement(event)
    if(Number(quantityEle.innerText.trim()) == 1){
        QuantityBtnDisable(quantityEle, true,false)
        return;
    }
    QuantityBtnDisable(quantityEle, false,false)
    ChangeQuantity(quantityEle,-1)
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

// export function GetUrlField(fieldName){
//     let search = window.location.search;
//     if (!search) return null;
//     let value = window.location.search.split(fieldName+"=")
//     if(value.length > 1)
//         return value[1].split("&")[0]
//     else
//         return null;
// }
export function GetUrlField(fieldName) {
    const params = new URLSearchParams(window.location.search);
    return params.get(fieldName);
}

export function getFormFields(id){
    //gets the form data by id
    let form = document.getElementById(id);
    let formData= new FormData(form);
    return Object.fromEntries(formData.entries());
    
}

// Must Use await with call
export async function fetchComponent(url){
    let response  = await fetch(url)
    let htmlString  = await response.text();
    return htmlString;
}
// export function convertToHtmlElement(htmlString){

//     let tempDiv = document.createElement("tbody");
//     tempDiv.innerHTML = htmlString.trim();

//     if (isTableRow) {
//         tempContainer = document.createElement("table");
//         tempContainer.innerHTML = `<tbody>${htmlString}</tbody>`;
//         return tempContainer.querySelector("tbody").firstElementChild; // Get the <tr> directly
//     } 

//     if (tempDiv.childNodes.length === 1) {
//         return tempDiv.firstChild; 
//     } else {
//         let fragment = document.createDocumentFragment();
//         while (tempDiv.firstChild) {
//             fragment.appendChild(tempDiv.firstChild);
//         }
//         return fragment;
//     }
// }


export function convertToHtmlElement(htmlString) {
    htmlString = htmlString.trim();

    let tempContainer;
    let fragment = document.createDocumentFragment();

    // Check special cases first
    if (htmlString.startsWith("<tr")) {
        tempContainer = document.createElement("table");
        tempContainer.innerHTML = `<tbody>${htmlString}</tbody>`;
        let tbody = tempContainer.querySelector("tbody");

        // If only one <tr>, return it directly
        if (tbody.children.length === 1) {
            return tbody.firstElementChild;
        }

        // If multiple <tr>, move them all into fragment
        while (tbody.firstChild) {
            fragment.appendChild(tbody.firstChild);
        }
        return fragment;
    }
    
    if (htmlString.startsWith("<td") || htmlString.startsWith("<th")) {
        tempContainer = document.createElement("table");
        tempContainer.innerHTML = `<tbody><tr>${htmlString}</tr></tbody>`;
        let tr = tempContainer.querySelector("tr");

        if (tr.children.length === 1) {
            return tr.firstElementChild;
        }

        while (tr.firstChild) {
            fragment.appendChild(tr.firstChild);
        }
        return fragment;
    }

 
    tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlString;

  
    if (tempContainer.children.length === 1) {
        return tempContainer.firstElementChild;
    }

    
    while (tempContainer.firstChild) {
        fragment.appendChild(tempContainer.firstChild);
    }
    return fragment;
}


export function observeElements( selector = '.hidden-animation',threshold = 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
            // console.log(entry.target);
          entry.target.classList.add('show-animation');
          obs.unobserve(entry.target); 
        }
      });
    }, {
      threshold: threshold
    });
  
    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });
  }
  


export function getFormInputs(form) {
    const elements = form.querySelectorAll("input, select, textarea");
    const inputs = {};
  
    elements.forEach((el) => {
      const key = el.name || el.id;
      if (key) inputs[key] = el;
    });
  
    return inputs;
  }

export function mapOrderStatus(status){
    let statusElement = convertToHtmlElement('<span class="order-status badge  align-self-start order-status">Completed</span>')
    let bgColor = "bg-warning";
    if(status ==0){
        bgColor = "bg-info"
        statusElement.classList.add("bg-balck")
        statusElement.innerText = "Pending"
    }
    else if(status == 1){
        bgColor = "bg-success"
        statusElement.classList.add(bgColor)
        statusElement.innerText = "Completed"
    }
    else if(status == 2){
        bgColor = "bg-danger"
        statusElement.classList.add(bgColor)
        statusElement.innerText = "Rejected"
    }
    else if(status == 3){
        statusElement.classList.add(bgColor)
        statusElement.innerText = "Hnaged"
    }
    return {bgColor,statusElement}
}