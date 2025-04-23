import { getTable } from "../modules/db.js";
import { Auth } from "../modules/authModule.js";
import { User } from "../modules/userModule.js";
export class Navbar {


    static renderNavbar() {

        const isLoggedIn = getTable("loggedin");
        const user = User.getCurrentUser();
        const body = document.body;

        if (isLoggedIn && user) {
            console.log(user);

            body.insertAdjacentElement("afterbegin",this.getAuthNavbar());


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
            body.insertAdjacentElement("afterbegin",this.getGuestNavbar());
        }
    }




    static getGuestNavbar() {
        return `
        <nav class="mynav navbar shadow sticky-top navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" href="#">Title</a>
    
            <div id="navbarNav">
                <ul class="navbar-nav d-flex flex-row gap-4">
                    
                        <li class="nav-item">
                            <a class="nav-link nav-link-item fs-5" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link nav-link-item fs-5" href="#">Categ</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link nav-link-item fs-5" href="#">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link nav-link-item fs-5" href="#">FAQ</a>
                        </li>
                    
                </ul>
            </div>
    
            <div>
                <a class="btn btn-outline-primary" href="/login.html">Login</a>
            </div>
        </div>
    </nav>
        `;
    }

    static getAuthNavbar(){
        
    }

    // static getAuthNavbar() {
    //     return `
        
    // <nav  class="mynav navbar navbar-expand-md shadow sticky-top navbar-light bg-light">
    //     <div class="container">
    //         <a class="navbar-brand" href="#">Title</a>

    //         <div class="d-flex justify-content-between gap-5">
    //             <div class="d-flex w-25 d-md-none justify-content-center gap-4 align-items-center">
    //                 <a class="nav-link" href="#" title="Cart">
    //                     <i class="nav-icon fas fa-cart-shopping fs-5"></i>
    //                 </a>
    //                 <a class="nav-link" href="#" title="Wishlist">
    //                     <i class="nav-icon fa-regular fa-heart fs-5"></i>
    //                 </a>

    //                 <div class="dropdown">
    //                     <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="navbarDropdown"
    //                         role="button" data-bs-toggle="dropdown" aria-expanded="false" title="Account">
    //                         <i class="fa-regular fa-user fs-5"></i>
                           
    //                     </a>

    //                     <ul class="dropdown-menu dropdown-menu-start mt-2" aria-labelledby="navbarDropdown">
    //                         <li><h6 class="dropdown-header username-placeholder"></h6></li>
    //                         <li><a class="dropdown-item" href="#">Action</a></li>
    //                         <li><a class="dropdown-item" href="#">Another action</a></li>
    //                         <li>
    //                             <hr class="dropdown-divider" />
    //                         </li>
    //                         <li>
    //                             <a class="logout-link dropdown-item" href="#">Logout</a>
    //                         </li>
    //                     </ul>
    //                 </div>
    //             </div>

    //             <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="collapse"
    //                 data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
    //                 aria-label="Toggle navigation">
    //                 <span class="navbar-toggler-icon"></span>
    //             </button>
    //         </div>

    //         <div class="collapse navbar-collapse" id="navbarNav">
    //             <ul class="navbar-nav mx-auto d-flex justify-content-center gap-md-5">
    //                 <li class="nav-item">
    //                     <a class="nav-link nav-link-item fs-5" href="#">Home</a>
    //                 </li>
    //                 <li class="nav-item">
    //                     <a class="nav-link nav-link-item fs-5" href="#">Categ</a>
    //                 </li>
    //                 <li class="nav-item">
    //                     <a class="nav-link nav-link-item fs-5" href="#">About</a>
    //                 </li>
    //                 <li class="nav-item">
    //                     <a class="nav-link nav-link-item fs-5" href="#">FAQ</a>
    //                 </li>
    //             </ul>
    //         </div>

    //         <div class="d-none d-md-flex align-items-center justify-content-center gap-4">
    //             <a class="nav-link" href="#" title="Cart">
    //                 <i class="nav-icon fas fa-cart-shopping fs-5"></i>
    //             </a>
    //             <a class="nav-link" href="#" title="Wishlist">
    //                 <i class="nav-icon fa-regular fa-heart fs-5"></i>
    //             </a>
    //             <div class="dropdown">
    //                 <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="navbarDropdown"
    //                     role="button" data-bs-toggle="dropdown" aria-expanded="false" title="Account">
    //                     <i class="fa-regular fa-user fs-5"></i>
    //                     <span id="username" class="username-placeholder"></span>
                       
    //                 </a>

    //                 <ul class="dropdown-menu dropdown-menu-start mt-2" aria-labelledby="navbarDropdown">
    //                     <li><a class="dropdown-item" href="#">Action</a></li>
    //                     <li><a class="dropdown-item" href="#">Another action</a></li>
    //                     <li>
    //                         <hr class="dropdown-divider" />
    //                     </li>
    //                     <li>
    //                         <a class="dropdown-item logout-link" href="#">Logout</a>
    //                     </li>
    //                 </ul>
    //             </div>
    //         </div>
    //     </div>
    // </nav>

    // `;
    // }
}

