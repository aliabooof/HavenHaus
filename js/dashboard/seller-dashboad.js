import {Order} from "../modules/order.js";
import { OrderItem } from "../modules/OrderItem.js";
import { Product } from "../modules/productModule.js";
import {Seller} from "../modules/seller.js"
import {Auth} from "../modules/authModule.js"
import {redirect, fetchComponent, convertToHtmlElement} from "../util.js"
import  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';

// Authintication
let seller = Auth.isLoggedIn()
if(!seller)
    redirect("../../login.html")
if(seller.id == 3)
    redirect("../../pages/not-found.html")
// End Of Authintication

// ____________________________ Start Of Functions Section ____________________________\\
        //_____________ Chart Functions _____________\\
function updateChart(data){
    chart.data.labels = Object.keys(data);
    chart.data.datasets[0].data = Object.values(data)
    chart.update();  // ← this redraws the chart with new data

}
function showDailySales(event){
    updateChart(dailySales)
}

function showMonthlySales(event){
    updateChart(monthlySales)
}

function showYearlySales(event){
    updateChart(yearlySales)
}
function sortData(data){
    return Object.keys(data)
        .sort() // Sort the keys alphabetically
        .reduce((acc, key) => {
            acc[key] = data[key]; // Rebuild a new object
            return acc;
        }, {});
}

        //_____________ RecentOrders & BestSelling Functions _____________\\

function prepareBestSellingElement(product){
    let bestSellingElement = convertToHtmlElement(BestSellingComponentString);
//     <a href="#best-selling" class="list-group-item py-3 border rounded mb-2 shadow-sm">
//     <div class="col-12  col-md-4 d-flex flex-column ">
//         <div class="d-flex flex-row gap-4 flex-lg-column flex-xl-row justify-content-start bg-success">
//             <p class="">#<span class="number">1</span></p>
//             <p class="product-name">Product Name</p>
//         </div>
//         <p><span class="units-sold">2</span> Unit</p>
//     </div>
// </a>
    bestSellingElement.querySelector(".units-sold").innerText = product.totalQuantity;
    bestSellingElement.querySelector(".product-name").innerText = product.name;
    return bestSellingElement
}




function prepareBestSelling(){
    let bestSellingContainer = document.getElementById("best-selling").querySelector(".list-group")
    let sellerProdcuts = Product.getProductsBySeller(sellerId);
    let sellerOrderItems = Seller.getSellerOrderItemsById(sellerId);
    // console.log(sellerProdcuts)
    sellerProdcuts = sellerProdcuts.map(
                    (product)=>{
                        let productQuanity = sellerOrderItems.reduce(
                                            (totalQuantity,orderItem)=>{
                                                // console.log("prodcutID from reduce "+product.id)
                                                if(orderItem.productID == product.id)
                                                {
                                                    // console.log(product.id +"  "+ orderItem.quantity)
                                                    return totalQuantity += orderItem.quantity;
                                                }
                                                return totalQuantity;  
                                            }
                                        ,0)

                                        product.totalQuantity = productQuanity;
                                        // console.log(product.totalQuantity)
                    return product
                }
            )
    
    sellerProdcuts = sellerProdcuts.sort(
                            (prod1,prod2)=>{
                                return prod2.totalQuantity - prod1.totalQuantity
                            }
                        ).slice(0,3)

    // add to container
    bestSellingContainer.innerHTML = ""
    sellerProdcuts.forEach(
        (product,index)=>{
            let element = prepareBestSellingElement(product)
            element.querySelector(".number").innerText = index+1
            element.href = `./product.html?prod-id=${product.id}`
            bestSellingContainer.insertAdjacentElement("beforeend",element);

        }
    )
    
}




function prepareOrder(order){        
        let recentOrderElement = convertToHtmlElement(recentOrderComponentString)
        // set id & date
        recentOrderElement.querySelector(".order-id").innerText = order.id
        recentOrderElement.querySelector(".order-date").innerText = new Date(order.date).toDateString()
        // set status
        let statusText = "Unknown";
        let statusBGColor = "bg-danger";
        if(order.status == 0)
        {
            statusText = "Pending"
            statusBGColor = "bg-info"
        }else if(order.status == 1)
        {
            statusText = "Completed"
            statusBGColor = "bg-success"
        }
        let statusElement = recentOrderElement.querySelector(".order-status")  
        statusElement.innerText = statusText;
        statusElement.classList.add(statusBGColor)
        //____________________________________\\

        
        //__________________Total Order Price & Order Items Count_________________//
        let orderItems = Seller.getSellerOrderItemsById(sellerId)
        .filter(orderItem=> orderItem.orderID == order.id)
        // console.log(orderItems)
        let orderTotalPice = orderItems.map(
                    orderItem=> 
                        orderItem.quantity *
                    Product.getProductById(orderItem.productID).price
                ).reduce(
                    (totalPrice,itemPrice)=>totalPrice+itemPrice
                ,0)
            
        recentOrderElement.querySelector(".order-cost").innerText = orderTotalPice  
        recentOrderElement.querySelector(".order-item-count").innerText = orderItems.length  
        return recentOrderElement
}

        //_______________________________________________\\
function prepareRecentOrders(){
    let recentOrdersContainer = document.getElementById("recent-orders")
                                    .querySelector(".list-group")
    let sellerId = 2
    let sellerSortedOrders = Seller.getSortedSellerOrdersById(sellerId)
                                .filter(
                                    order=>{
                                        let xDaysAgoDate = new Date();
                                        xDaysAgoDate.setMonth(new Date().getMonth()-1)
                                        xDaysAgoDate = xDaysAgoDate.toISOString()
                                        return order.date >= xDaysAgoDate  
                                    }
                                )
                                .slice(0,2)
    recentOrdersContainer.innerHTML = "";
    sellerSortedOrders.map(
        element => 
            prepareOrder(element)
    ).forEach(orderElement => {
        recentOrdersContainer.insertAdjacentElement("beforeend",orderElement);
    });       
    // console.log(sellerSortedOrders) ;
}

// ____________________________ End Of Functions Section ____________________________\\

// ____________________________ Global Variabls Section ____________________________\\
let recentOrderComponentString = await fetchComponent("../../components/seller-recent-order.html")
let BestSellingComponentString = await fetchComponent("../../components/seller-best-selling.html")

var sellerId =  2
// ____________________________ End Global Variabls Section ____________________________\\


// ____________________________ Starting ____________________________\\


    // Total products
document.getElementById("total-products").innerText = 
                                        Product.getProductsBySeller(2).length 
    // getSellerOrders
let sellerOrders = Seller.getSellerOrdersById(2);
    // Get shipped orders Orders Only
let shippedOrders = sellerOrders.filter(order=> order.status == 1);
// console.log(sellerOrders.filter(order=> order.status == 0))
    // seller orders 
let sellerOrderItems = Seller.getSellerOrderItemsById(2)

    // Total orders, Pending Orders, Total Revenue
document.getElementById("total-orders").innerText = sellerOrders.length 
document.getElementById("pending-orders").innerText = 
                                        sellerOrders.filter(order=> order.status == 0).length 
    // calculate the total revenue
document.getElementById("total-revenue").innerText =
                            shippedOrders.reduce((ordersAcc,order)=> {
                            return ordersAcc + OrderItem.getOrderItemsByOrderId(order.id)
                                    .reduce(
                                        (orderItemsAcc,orderItem)=>{
                                            let productPrice =
                                            Product.getProductById(orderItem.productID).price   
                                            productPrice = productPrice || 1    
                                            return orderItemsAcc+(productPrice*orderItem.quantity)
                                        },0)
                                    }
                                        ,0).toFixed(2) 



    // Total Sold Units
let shippedOrderIds = shippedOrders.map(order=> order.id)
document.getElementById("total-sold-units").innerText = 
sellerOrderItems.filter(  
                            orderItem=> shippedOrderIds.includes(orderItem.orderID)
                        )
                        .reduce((acc,orderItem)=> acc+orderItem.quantity,0)

    // prepare sales                                                    
let allSales = Seller.calculateSales(2);  
let dailySales = sortData(allSales.dailySales);
let monthlySales = sortData(allSales.monthlySales);
let yearlySales = sortData(allSales.yearlySales);

const labels = Object.keys(dailySales)
const salaries = Object.values(dailySales)

    // Creating the Chart  
let chart = new Chart(document.getElementById('salesChart'), {
        type: 'line',
        data: {
        labels: labels,
        datasets: [{
            label: 'Salary Over Time',
            data: salaries,
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            fill: false,
            tension: 0.1,
        }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 20 // <-- controls dataset label size in legend
                    }
                  }
                },
                tooltip: {
                  bodyFont: {
                    size: 16 // <-- controls font size inside tooltip
                  }
                }
              },
        scales: {
            x: {
            title: { display: true, text: 'Date', font:{size:20} }
            },
            y: {
            title: { display: true, text: 'Salary ($)', font:{size:20} }
            }
        }
        }
    });


// Listening To Chart Buttons
document.getElementById("yearly-sales").addEventListener("click",showYearlySales);
document.getElementById("monthly-sales").addEventListener("click",showMonthlySales);
document.getElementById("daily-sales").addEventListener("click",showDailySales);
    

// Loading Recent orders & Best selling
prepareRecentOrders()
prepareBestSelling()
