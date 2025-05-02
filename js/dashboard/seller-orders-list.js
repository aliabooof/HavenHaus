import { Order } from "../modules/order.js";
import { Product } from "../modules/productModule.js";
import { Seller } from "../modules/seller.js";
import { fetchComponent ,convertToHtmlElement } from "../util.js";
import { User } from "../modules/userModule.js";
import { Auth } from "../modules/authModule.js";
// import { Modal } from "https://esm.sh/bootstrap@5.3.3";
var seller = User.getCurrentUser();

//___________________________ Functions Section ___________________________\\

function alternateRowColors() {
    const rows = document.querySelectorAll("#myTable tbody tr");
    rows.forEach((row, index) => {
      row.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#ffffff";
    });
  }

function mapOrderStatus(status){
    let statusElement = convertToHtmlElement('<span class="order-status badge  align-self-start order-status">Completed</span>')

    if(status ==0){
        statusElement.classList.add("bg-info")
        statusElement.innerText = "Pending"
    }
    else if(status == 1){
        statusElement.classList.add("bg-success")
        statusElement.innerText = "Completed"
    }
    else if(status == 2){
        statusElement.classList.add("bg-danger")
        statusElement.innerText = "Rejected"
    }
    return statusElement
}

function showOrderRejectModal(event){
    orderDeleteConfirmModal.show();
}
function showOrderAcceptModal(event){
    orderAcceptConfirmModal.show()
}   
function createOrderTableRow(orderItem,order){
    let orderTableRow = convertToHtmlElement(orderTableRowString);
        let product = Product.getProductById(orderItem.productID)
        // orderTableRow.querySelector(".order-id").innerText = order.id
        orderTableRow.querySelector(".order-product-name").textContent = product.name
        orderTableRow.querySelector(".order-product-id").textContent = product.id
        orderTableRow.querySelector(".order-date").textContent = new Date(order.date).toLocaleString()
        orderTableRow.querySelector(".order-product-amount").textContent = orderItem.quantity
        orderTableRow.querySelector(".order-status").appendChild( mapOrderStatus(order.status));
        let rejectBtn = orderTableRow.querySelector(".order-reject-btn")
        let acceptBtn = orderTableRow.querySelector(".order-accept-btn")
        if(order.status == 0){
            rejectBtn.dataset.id = order.id
            acceptBtn.dataset.id = order.id
            rejectBtn.addEventListener("click",showOrderRejectModal)
            acceptBtn.addEventListener("click",showOrderAcceptModal)
        }else{
            rejectBtn.classList.add("d-none")
            acceptBtn.classList.add("d-none")
        }
        orderTableRow.dataset.orderId = order.id
    return orderTableRow;
}

function showOrders(){
    sellerOrders.forEach((order,index) => {
        let rowColor = index % 2 === 0 ? "#ffffff" : "#f2f2f2";
        let tableBreakElement = convertToHtmlElement(orderTableBreakString)
        
        tableBreakElement.style.backgroundColor= rowColor
        tableBreakElement.querySelector(".order-id").innerText = order.id
        orderTableBody.insertAdjacentElement("beforeend",tableBreakElement)
        
        let orderItems = sellerOrderItems.filter((orderItem=> orderItem.orderID == order.id))

        orderItems.forEach((orderItem)=>{
            let orderTableRow = createOrderTableRow(orderItem,order)
            orderTableRow.style.backgroundColor = rowColor;
            orderTableBody.insertAdjacentElement("beforeend",orderTableRow)
        })
    });
    Array.from(orderTableBody.querySelectorAll("td")).forEach(td => {
        td.style.backgroundColor = "transparent";
      });
}
//___________________________ End Functions Section ___________________________\\

    // Call initially
//alternateRowColors();
//___________________________ Gloabal Variables ___________________________\\
let orderTableRowString = await fetchComponent("../../components/seller-order-row.html");
let orderTableBreakString = await fetchComponent("../../components/seller-order-table-break.html");
let sellerId = 2;
let sellerOrders = Seller.getSortedSellerOrdersById(sellerId)
let sellerOrderItems = Seller.getSellerOrderItemsById(sellerId);
let orderTableBody = document.getElementById("orders-table-body");
var orderDeleteConfirmModal = new bootstrap.Modal(document.getElementById("orderDeleteConfirmModal"))
var orderAcceptConfirmModal = new bootstrap.Modal(document.getElementById("orderAcceptConfirmModal"))
console.log(orderDeleteConfirmModal)
// console.log(Modal)
//___________________________ End Of Gloabal Variables ___________________________\\


showOrders()