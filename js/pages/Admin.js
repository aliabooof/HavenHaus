import { User } from "../modules/userModule.js";
import { Component } from "../componentModules/components.js";
import { LoadDB } from "../load_db.js";

await LoadDB();

let users = User.getAllUsers();



// function filterTable() {
//     const searchInput = document.getElementById("searchInput").value.toLowerCase();
//     const rows = document.querySelectorAll("#userTableBody tr");

//     rows.forEach(row => {
//         const name = row.cells[1].textContent.toLowerCase(); 
//         if (name.includes(searchInput)) {
//           row.style.display = ""; 
//         } else {
//           row.style.display = "none"; 
//         }
//     });
// }



 async function handleSearch(keyword) {
    if (keyword.trim() === "") {
        
        Component.renderPage(1);
        Component.renderPaginationControls();
        document.getElementById("paginationControls").style.display = "block";
    } else {
        const filteredUsers = users.filter(user => 
            user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
            user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
            user.email.toLowerCase().includes(keyword.toLowerCase())||
            user.id.toLowerCase().includes(keyword.toLowerCase())||
            (user.firstName + user.lastName).toLowerCase().includes(keyword.toLowerCase)
            
        );

        
        const userTableBody = document.getElementById("userTableBody");
        userTableBody.innerHTML = "";

        for (const user of filteredUsers) {
            await Component.renderUserRow(user);
        }

        
        document.getElementById("paginationControls").style.display = "none";
    }
}




function animateCount(id, endValue, duration = 1000){
    const element = document.getElementById(id);
    let startValue = 0;
    const stepTime = Math.abs(Math.floor(duration / endValue));

    const counter = setInterval ( () => {
        startValue++;
        element.textContent = startValue;
        if (startValue >= endValue){
            clearInterval(counter);
        }
   },stepTime);
}

async function loadContent(x) {
        switch(x){
            case 2:
                const users = User.getAllUsers();
                animateCount("totalUsers",users.length);
                await Component.renderTable();
                document.getElementById("searchInput").addEventListener('input',(e)=>{
                    handleSearch(e.target.value);
                })
                break;

        }
    }


document.getElementById("user_button").addEventListener("click", async () => {
    await loadContent(2);
});
