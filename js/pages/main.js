import { loadNavbar } from './navbar.js';
import { loadFooter } from "./footer.js";
import { loadProductCard } from './product-card.js';
import { loadCategoryCard } from '../componentModules/category-card.js';

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    loadFooter();
    loadProductCard();
    loadCategoryCard();

});