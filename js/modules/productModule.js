import { getTable, add, setTable } from "../db.js";

export class Product {
<<<<<<< Updated upstream
    constructor({ name, category, price, desc, imageUrl, stock, sellerID, highlights, instructions, reviews }) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.desc = desc;
        this.imageUrl = imageUrl;
        this.stock = stock;
        this.sellerID = sellerID;
        this.highlights = highlights || "No highlights provided.";
        this.instructions = instructions || "No instructions provided.";
        this.reviews = reviews || [];
        this.id = this.#generateUniqueId(name, category);
=======
    constructor(productData) {
        this.name = productData.name;
        this.category = productData.category;
        this.price = productData.price;
        this.desc = productData.desc;
        this.imageUrl = productData.imageUrl;
        this.stock = productData.stock;
        this.sellerID = productData.sellerID;
        this.highlights = productData.highlights || "No highlights provided.";
        this.instructions = productData.instructions || "No instructions provided.";
        this.reviews = productData.reviews || [];
        this.featured = productData.featured;
        this.id = this.#generateUniqueId(this.name, this.category);
        this.isDeleted = false;
>>>>>>> Stashed changes
    }

    // Generates a random base ID using name and category
    #generateId(name, category) {
        return `${name.replace(/\s+/g, "")}_${category}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // Ensures the generated ID is unique
    #generateUniqueId(name, category) {
        let id;
        const existingIds = Product.getAllExistingProductIds();
        do {
            id = this.#generateId(name, category);
        } while (existingIds.includes(id));
        return id;
    }

    // Get all products
    static getAllProducts() {
        let table = getTable("product") || [];
        return table.filter(p=>p.isDeleted == false)
    }
    static getAllProductsWithDeleted(){
        return getTable("product") || []
    }

    // Get all existing product IDs
    static getAllExistingProductIds() {
        return this.getAllProducts().map(product => product.id);
    }

    // Get product by ID
    static getProductById(id) {
        return this.getAllProducts().find(product => product.id === id);
    }

    // Get all products by a specific seller
    static getProductsBySeller(sellerID) {
        return this.getAllProducts().filter(product => product.sellerID === sellerID);
    }

    // Search products by keyword in name or description
    static searchProducts(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        return this.getAllProducts().filter(product =>
            product.name.toLowerCase().includes(lowerKeyword) ||
            product.desc.toLowerCase().includes(lowerKeyword)
        );
    }

    // Add new product
    static addProduct(product) {
        add("product", product);
    }

    // Add a review to a specific product
    static addReview(productId, review) {
        const products = this.getAllProducts();
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            products[productIndex].reviews = products[productIndex].reviews || [];
            products[productIndex].reviews.push(review);
            setTable("product", products);
        }
    }

    static removeProduct(productId) {
        const products = this.getAllProducts().filter(p => p.id !== productId);
        setTable("product", products);
    }
}
