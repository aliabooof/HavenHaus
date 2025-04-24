import {fetchComponent, convertToHtmlElement} from "../util.js"

export async function renderFooter(){
    let footer = await fetchComponent("../../components/footer.html")
    footer = convertToHtmlElement(footer)
    document.body.insertAdjacentElement("beforeend",footer);

}

      