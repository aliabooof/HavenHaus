import { createAlert } from "../util.js";
import { Component } from "../componentModules/components.js";

document.addEventListener("DOMContentLoaded", async () => {
   await Component.renderNavbar();
   await Component.renderFooter();
   await Component.renderCartOffcanvas();
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