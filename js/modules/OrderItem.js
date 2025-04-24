export class OrderItem {
    constructor({ productId, quantity, price }) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price; 
        this.id = this.#generateId();
    }

    #generateId() {
        return 'item_' + Math.random().toString(36).substring(2, 10);
    }
}
