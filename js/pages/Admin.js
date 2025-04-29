import { User } from "../modules/userModule.js";
import { Product } from "../modules/productModule.js";
import { Order } from "../modules/order.js";
import { Component } from "../componentModules/components.js";


async function loadContent(x) {
    switch (x) {
        case 1:
            await Component.renderCharts();
            await loadDashboardCharts();
            break;
        case 2:
            await Component.renderTable();
            const users = User.getAllUsers();
            for (const user of users) {
                if (user.role == 1) {
                    user.role = "Seller";
                    await Component.renderUserTable(user);
                }
                else if (user.role == 2) {
                    user.role = "Customer";
                    await Component.renderUserTable(user);
                }
            }
            break;
        case 3:
            await Component.renderProducts();
            await loadProductDashboardChart();
            break;
        case 4:
            await Component.renderOrders();
            await loadOrderDashboardChart();
            break;
        case 5:
            await Component.renderSupport();

            break;
    }
}

function loadDashboardCharts() {

    const salesChart = document.getElementById('salesChart').getContext('2d');
    const ctx = document.getElementById('userChart').getContext('2d');
    const pr_or = document.getElementById('productOrderChart').getContext('2d');

    new Chart(salesChart, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales ($)',
                data: [1200, 1900, 3000, 2500, 2200, 2800],
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(ctx, {
        type: 'bar', // Bar chart to compare data
        data: {
            labels: ['All Users', 'Sellers', 'Customers'],
            datasets: [{
                label: 'User Count',
                data: [User.getAllUsers().length, User.getUserByRole(1).length, User.getUserByRole(2).length],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(153, 102, 255, 0.2)'], // Colors for bars
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(153, 102, 255, 1)'], // Border colors
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true // Start the y-axis from 0
                }
            }
        }
    });

    new Chart(pr_or, {
        type: 'bar',
        data: {
            labels: ['Products', 'Orders'],
            datasets: [{
                label: 'Count',
                data: [Product.getAllProducts().length, Order.getAllOrders().length],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function loadProductDashboardChart() {
    const dashProduct = document.getElementById('productsChart').getContext('2d');
    const sellersData = User.getUserByRole(1); // Get all sellers
    const sellers = sellersData.map(user => `${user.firstName} ${user.lastName}`);
    
    const productCounts = sellersData.map(seller => {
        const products = Product.getProductsBySeller(seller.id);
        return products.length; // number of products for this seller
    });
    new Chart(dashProduct, {
        type: 'bar', 
        data: {
            labels: sellers, 
            datasets: [{
                label: 'Number of Products',
                data: productCounts, 
                backgroundColor: 'rgba(54, 162, 235, 0.5)', 
                borderColor: 'rgba(54, 162, 235, 1)', 
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Products'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Sellers'
                    }
                }
            }
            }
    });
}

function loadOrderDashboardChart() {
    const dashOrder = document.getElementById('ordersChart').getContext('2d');
    const sellersData = User.getUserByRole(1);
    const sellers = sellersData.map(user => `${user.firstName} ${user.lastName}`);
    // console.log(sellers);
    const ordersCount = sellersData.map(seller => {
        const orders = Order.getOrdersByUser(seller.id);
        return orders.length; // number of orders for this seller
    });
    new Chart(dashOrder, {
        type: 'bar', 
        data: {
            labels: sellers, 
            datasets: [{
                label: 'Number of Orders',
                data: ordersCount, 
                backgroundColor: 'rgba(54, 162, 235, 0.5)', 
                borderColor: 'rgba(54, 162, 235, 1)', 
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Orders'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Sellers'
                    }
                }
            }
            }

    });
    
    // console.log(ordersCount);

}


document.getElementById("user_button").addEventListener("click", async () => {
    await loadContent(2);
})
document.getElementById("dashboard_button").addEventListener("click", async () => {
    await loadContent(1);
})
document.getElementById("product_button").addEventListener("click", async () => {
    await loadContent(3);
})
document.getElementById("order_button").addEventListener("click", async () => {
    await loadContent(4);
})
document.getElementById("support_button").addEventListener("click", async () => {
    await loadContent(5);
})

function filterTable() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#userTableBody tr");

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase(); // Get the user's name in lowercase
        if (name.includes(searchInput)) {
            row.style.display = ""; // Show the row if it matches the search query
        } else {
            row.style.display = "none"; // Hide the row if it doesn't match
        }
    });


}