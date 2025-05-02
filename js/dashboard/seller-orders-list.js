import { Order } from "../modules/order.js";
import { Product } from "../modules/productModule.js";
import { Seller } from "../modules/seller.js";
import { fetchComponent ,convertToHtmlElement } from "../util.js";
import { User } from "../modules/userModule.js";
import { Auth } from "../modules/authModule.js";
import { OrderItem } from "../modules/OrderItem.js";
import { mapOrderStatus } from "../util.js";

var seller = User.getCurrentUser();

//___________________________ Functions Section ___________________________\\
function alternateRowColors() {
    const rows = document.querySelectorAll("#myTable tbody tr");
    rows.forEach((row, index) => {
      row.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#ffffff";
    });
}
function closestTableBreakSibling(tr){
    let isTableBreak = false
    if(!tr)
        return
    while(!isTableBreak){
        if(tr.classList.contains("table-break"))
            isTableBreak = true
        else
            tr = tr.previousElementSibling
    }
    // console.log("from ClosestTableBreak ",tr)
    return tr
}



function getOrderTrs(tableBreak){
    let isTableBreak = false
    let trs = []
    let orderItemTr = tableBreak.nextElementSibling
    while(!isTableBreak){
        if(!orderItemTr || orderItemTr.classList.contains("table-break"))
            isTableBreak = true
        else{
            trs.push(orderItemTr)
            orderItemTr= orderItemTr.nextElementSibling
        }
    }
    return trs
}

function updateOrderItemTrStatus(orderItemTr,status){
    let statusObejct = mapOrderStatus(status)

    orderItemTr.querySelector(".order-status").innerHTML = statusObejct.statusElement
    orderItemTr.querySelector(".order-reject-btn").classList.add("d-none")
    orderItemTr.classList.remove(mapOrderStatus(0).bgColor);
    orderItemTr.classList.add(statusObejct.bgColor);
    

}
function updateOrderTrStatus(tableBreak,status){
    
    hideTableBreakAcceptBtn(tableBreak)
    let isTableBreak = false
    let orderItemTr = tableBreak.nextElementSibling
    while(!isTableBreak){
        if(orderItemTr.classList.contains("table-break"))
            isTableBreak = true
        else{
            updateOrderItemTrStatus(orderItemTr,status)
            orderItemTr= orderItemTr.nextElementSibling
        }
    }


}
function hideTableBreakAcceptBtn(tableBreak){
    tableBreak.querySelector(".btn-td").classList.add("d-none");
    // tableBreak.querySelector(".order-id-td").colSap = 6
}
function rejectOrder(event){
    orderDeleteConfirmModal.hide()

    let orderId = event.target.dataset.id
    let orderItemTr =  document.querySelector(`.order-item[data-id="${CSS.escape(orderId)}"]`)
    let productId = event.target.dataset.productId
    
    
    let orderTableBreak = closestTableBreakSibling(orderItemTr)
    hideTableBreakAcceptBtn(orderTableBreak)


    let orderItemsTr = getOrderTrs(orderTableBreak)
    let orderItemStatus ;
    orderItemsTr.forEach((orderItemTr)=>{
        let product
        if(orderItemTr.dataset.productId == productId)
            orderItemStatus = 2
        else
            orderItemStatus = 3

        updateOrderItemTrStatus(orderItemTr,orderItemStatus)
    })
    OrderItem.rejectOrderById(orderId)
    OrderItem.setOrderItemStatus(orderId,productId,2)
    Order.updateOrderStatus(orderId,2)

}
function acceptOrder(event){
    orderDeleteConfirmModal.hide()

    let orderId = event.target.dataset.id
    let randomOrderItemTr =  document.querySelector(`.order-item[data-id="${CSS.escape(orderId)}"]`)
    // let productId = event.target.dataset.productId
  
    
    let orderTableBreak = closestTableBreakSibling(randomOrderItemTr)
    hideTableBreakAcceptBtn(orderTableBreak)
    
    let orderItemsTr = getOrderTrs(orderTableBreak)
    
    orderItemsTr.forEach((orderItemTr)=>{
        updateOrderItemTrStatus(orderItemTr,1)
        let productId = orderItemTr.dataset.productId
        OrderItem.setOrderItemStatus(orderId,productId,1)
        console.log("from Accept Order productId for tr",orderItemTr.dataset.productId)
    })
    // Change Order State if all OrderItems are Accepted
    let notAcceptedOrderItems = OrderItem.getOrderItemsByOrderId(orderId).filter(orderItem=> orderItem.status != 1)
    if(notAcceptedOrderItems.length == 0)
        Order.updateOrderStatus(orderId,1)
    orderAcceptConfirmModal.hide()
}
function showOrderRejectModal(event){
    // Get The Button itself
    let btn = event.target.closest("button")
    // Extract order-id & product-id from the button 
    let orderId = btn.dataset.id
    let productId =  btn.dataset.productId
    // add them on the ConfirmDeleteBtn
    orderConfirmDeleteBtn.dataset.id = orderId
    orderConfirmDeleteBtn.dataset.productId = productId
    // Show Modal
    orderDeleteConfirmModal.show();
}


function showOrderAcceptModal(event){
    // Get The Button itself
    let btn = event.target.closest("button")
    // Extract order-id & product-id from the button 
    let orderId = btn.dataset.id
    let productId =  btn.dataset.productId
    // add them on the ConfirmBtn
    console.log("from showAcceptModal ",btn)
    console.log("from showAcceptModal ",orderId,productId)
    orderConfirmAcceptBtn.dataset.id = orderId
    orderConfirmAcceptBtn.dataset.productId = productId
    // show the modal
    orderAcceptConfirmModal.show()
}   
// function mapOrderStatus(status){
//     let statusElement = convertToHtmlElement('<span class="order-status badge  align-self-start order-status">Completed</span>')
//     let bgColor = "bg-warning";
//     if(status ==0){
//         bgColor = "bg-info"
//         statusElement.classList.add("bg-balck")
//         statusElement.innerText = "Pending"
//     }
//     else if(status == 1){
//         bgColor = "bg-success"
//         statusElement.classList.add(bgColor)
//         statusElement.innerText = "Completed"
//     }
//     else if(status == 2){
//         bgColor = "bg-danger"
//         statusElement.classList.add(bgColor)
//         statusElement.innerText = "Rejected"
//     }
//     return {bgColor,statusElement}
// }

function createOrderTableRow(orderItem,order){
    let orderTableRow = convertToHtmlElement(orderTableRowString);
    orderTableRow.dataset.id = order.id
    orderTableRow.dataset.productId = orderItem.productID
    let product = Product.getProductById(orderItem.productID)
    orderTableRow.querySelector(".order-product-name").textContent = product.name
    orderTableRow.querySelector(".order-product-id").textContent = product.id
    orderTableRow.querySelector(".order-date").textContent = new Date(order.date).toLocaleString()
    orderTableRow.querySelector(".order-product-amount").textContent = orderItem.quantity
 
    let statusMap = mapOrderStatus(orderItem.status) 
    orderTableRow.querySelector(".order-status").appendChild(statusMap.statusElement );
    orderTableRow.classList.add(statusMap.bgColor)

    let rejectBtn = orderTableRow.querySelector(".order-reject-btn")
    if(orderItem.status == 0){
        rejectBtn.dataset.id = order.id
        rejectBtn.dataset.productId = product.id
        rejectBtn.addEventListener("click",showOrderRejectModal)
 
    }else{
        rejectBtn.classList.add("d-none")
    }
    orderTableRow.dataset.orderId = order.id
    return orderTableRow;
}

function showOrders(sellerOrders,sellerOrderItems){
    sellerOrders.forEach((order,index) => {
        let rowColor = index % 2 === 0 ? "#ffffff" : "#f2f2f2";
        let tableBreakElement = convertToHtmlElement(orderTableBreakString)
        let orderItems = sellerOrderItems.filter((orderItem=> orderItem.orderID == order.id))
        let orderPedningItems = orderItems.filter(orderItem=> orderItem.status == 0)

        tableBreakElement.style.backgroundColor= rowColor


        // add order id and AcceptBtn listner
        tableBreakElement.querySelector(".order-id").innerText = order.id
        let orderAcceptBnt = tableBreakElement.querySelector(".order-accept-btn")

        if(order.status ==0 && orderPedningItems.length > 0){
            orderAcceptBnt.dataset.id = order.id;
            orderAcceptBnt.addEventListener("click",showOrderAcceptModal)
        }else if(order.status ==0 && orderPedningItems.length==0){
            tableBreakElement.querySelector(".btn-td").innerText= "Wating"
            orderAcceptBnt.classList.add("d-none")
        }else 
            orderAcceptBnt.classList.add("d-none")
        

        // add row to Table Body
        orderTableBody.insertAdjacentElement("beforeend",tableBreakElement)
        
        // add Orders List To The Table Body
        orderItems.forEach((orderItem)=>{
            let orderTableRow = createOrderTableRow(orderItem,order)
            orderTableBody.insertAdjacentElement("beforeend",orderTableRow)
        })
    });
}

//___________________________ End Functions Section ___________________________\\



//___________________________ Gloabal Variables ___________________________\\
let orderTableRowString = await fetchComponent("../../components/seller-order-row.html");
let orderTableBreakString = await fetchComponent("../../components/seller-order-table-break.html");
let sellerId = 2;
let sellerOrders = Seller.getSortedSellerOrdersById(sellerId)
let sellerOrderItems = Seller.getSellerOrderItemsById(sellerId);
let orderTableBody = document.getElementById("orders-table-body");

// modals
var orderDeleteConfirmModal = new bootstrap.Modal(document.getElementById("orderDeleteConfirmModal"))
var orderAcceptConfirmModal = new bootstrap.Modal(document.getElementById("orderAcceptConfirmModal"))
// Buttons
var orderConfirmDeleteBtn = document.getElementById("orderConfirmDeleteBtn");
var orderConfirmAcceptBtn = document.getElementById("orderConfirmAcceptBtn");
// Event Listeners
orderConfirmDeleteBtn.addEventListener("click",rejectOrder)
orderConfirmAcceptBtn.addEventListener("click",acceptOrder)

//___________________________ End Of Gloabal Variables ___________________________\\


showOrders(sellerOrders,sellerOrderItems)