import {Order} from "../modules/order.js";
import { OrderItem } from "../modules/OrderItem.js";
import { Product } from "../modules/productModule.js";
import {Seller} from "../modules/seller.js"
import {Auth} from "../modules/authModule.js"
import {redirect, fetchComponent, convertToHtmlElement, mapOrderStatus} from "../util.js"
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
                                                if(orderItem.productID == product.id)
                                                {
                                                    return totalQuantity += orderItem.quantity;
                                                }
                                                return totalQuantity;  
                                            }
                                        ,0)

                                        product.totalQuantity = productQuanity;
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
        let statusMap = mapOrderStatus(order.status)
        let orderStatusElement = recentOrderElement.querySelector(".order-status")
        orderStatusElement.innerText = statusMap.statusElement.innerText;
        orderStatusElement.classList.add(statusMap.bgColor)
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



function animateCount(id, endValue, duration = 1000) {
    const element = document.getElementById(id);
    let startValue = 0;
    const stepTime = Math.abs(Math.floor(duration / endValue));

    const counter = setInterval(() => {
        startValue++;
        element.textContent = startValue;
        if (startValue >= endValue) {
            clearInterval(counter);
        }
    }, stepTime);
}


// ____________________________ End Of Functions Section ____________________________\\

// ____________________________ Global Variabls Section ____________________________\\
let recentOrderComponentString = await fetchComponent("../../components/seller-recent-order.html")
let BestSellingComponentString = await fetchComponent("../../components/seller-best-selling.html")

var sellerId =  2
// ____________________________ End Global Variabls Section ____________________________\\






// ____________________________ Starting ____________________________\\


    // Total products
let totalProductsCountContainer = document.getElementById("total-products")
let totalProductsCount = Product.getProductsBySeller(sellerId).length 
animateCount("total-products",totalProductsCount)


// getSellerOrders
let sellerOrders = Seller.getSellerOrdersById(sellerId);
console.log(sellerOrders)
// Get shipped orders Orders Only
let shippedOrders = sellerOrders.filter(order=> order.status == 1);
// console.log(sellerOrders.filter(order=> order.status == 0))
// seller orders 
let sellerOrderItems = Seller.getSellerOrderItemsById(sellerId)

// Total orders, Pending Orders
animateCount("total-orders",shippedOrders.length)
let pendingOrdersCount = sellerOrders.filter(order=> order.status == 0).length 
animateCount("pending-orders",pendingOrdersCount)


// calculate the total revenue
let totalRevenue   = shippedOrders.reduce((ordersAcc,order)=> {
                            return ordersAcc + OrderItem.getOrderItemsByOrderId(order.id)
                                    .reduce(
                                        (orderItemsAcc,orderItem)=>{
                                            let productPrice =
                                            Product.getProductById(orderItem.productID).price   
                                            productPrice = productPrice || 0    
                                            return orderItemsAcc+(productPrice*orderItem.quantity)
                                        },0)
                                    }
                                    ,0).toFixed(2) 

animateCount("total-revenue",totalRevenue)
console.log(totalRevenue)

// Total Sold Units
let shippedOrderIds = shippedOrders.map(order=> order.id)
let totalSoldUnits = sellerOrderItems.filter(  
                            orderItem=> shippedOrderIds.includes(orderItem.orderID)
                        )
                        .reduce((acc,orderItem)=> acc+orderItem.quantity,0)
animateCount("total-sold-units",totalSoldUnits)





    // prepare sales                                                    
let allSales = Seller.calculateSales(sellerId);  
let dailySales = sortData(allSales.dailySales);
let monthlySales = sortData(allSales.monthlySales);
let yearlySales = sortData(allSales.yearlySales);

const labels = Object.keys(dailySales)
const salaries = Object.values(dailySales)

    // Creating the Chart  
let chart = new Chart(document.getElementById('salesChart'), {
        type: 'bar',
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
                beginAtZero: true,
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
