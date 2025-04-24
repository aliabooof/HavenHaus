import {fetchComponent, convertToHtmlElement} from "../util.js"

export async function renderCartOffcanvas(){
    let cartOffcanvas = await fetchComponent("../../components/cart-offcanvas.html")
    cartOffcanvas = convertToHtmlElement(cartOffcanvas)
    document.body.insertAdjacentElement("beforeend",cartOffcanvas);
}

      