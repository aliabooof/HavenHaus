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