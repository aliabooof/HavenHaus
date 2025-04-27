import { User } from "../modules/userModule.js";
import { Component } from "../componentModules/components.js";


async function loadContent(x) {
        switch(x){
            case 2:
                await Component.renderTable();
                const users = User.getAllUsers();
                for (const user of users) {
                    if(user.role == 1){
                        user.role = "Seller";
                        await Component.renderUserTable(user);
                    }
                    else if(user.role == 2){
                        user.role = "Customer";
                        await Component.renderUserTable(user);
                    }
                    
                }
                break;

        }


}
document.getElementById("user_button").addEventListener("click", async () => {
    await loadContent(2);
})