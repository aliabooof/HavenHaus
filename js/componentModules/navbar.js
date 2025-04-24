
import { Auth } from "../modules/authModule.js";
import { User } from "../modules/userModule.js";

import {fetchComponent, convertToHtmlElement} from "../util.js";
export class Navbar {


    static async renderNavbar() {

        
        const body = document.body;

        if (Auth.isLoggedIn()) {
            const user = User.getCurrentUser();
            body.insertAdjacentElement("afterbegin",await this.getAuthNavbar());


            const userName = `${user.firstName} ${user.lastName}`.trim() || "User";


            body.querySelectorAll(".username-placeholder").forEach(el => {
                el.textContent = userName;
            });
            const logoutLinks = body.querySelectorAll(".logout-link");
            logoutLinks.forEach(link => {
                link.addEventListener('click', () => {
                    console.log("logout");
                    Auth.logout();
                });
            });
        } else {
            body.insertAdjacentElement("afterbegin",await this.getGuestNavbar());
        }
    }




    static async getGuestNavbar() {
        const nav = await fetchComponent("../../components/guestNavbar.html")
        return convertToHtmlElement(nav);

    }

    static async getAuthNavbar(){
        const nav = await fetchComponent("../../components/navbar.html");
        return convertToHtmlElement(nav);

    }

}

