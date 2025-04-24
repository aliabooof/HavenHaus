import { createAlert } from "../util.js";
import { Navbar } from "../componentModules/navbar.js";
import { renderFooter } from "../componentModules/footer.js";

document.addEventListener("DOMContentLoaded", async () => {
   await Navbar.renderNavbar();
   await renderFooter();
    const flashData = sessionStorage.getItem("flashAlert");

    if (flashData) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const { title, type, message } = JSON.parse(flashData);
        const alertEl = createAlert(title, type, message);

        
        setTimeout(() => {
            alertEl.remove();
        }, 5000);

        
        sessionStorage.removeItem("flashAlert");
    }
});