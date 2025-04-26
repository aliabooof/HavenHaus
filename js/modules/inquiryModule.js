// inquiries.js
import { getTable, add, setTable } from "./db.js";

export class Inquiry {

    constructor(userId,title,name,email,message) {
//         console.log(
//             userId,
//             title,
//             name,
//             email,
//             message,
//             new Date().toISOString(),
//             this.#generateUniqueId(userId),
//             this.#generateSummary(message),
//         )
        this.userId = userId;
        this.title = title;
        this.name = name
        this.email = email;
        this.message = message;
        this.createdAt = new Date().toISOString();
        this.reply = null; 
        this.id = this.#generateUniqueId(userId);
        this.summary = this.#generateSummary(message);
    
    }

    // Generate a random base ID using userId and timestamp
    #generateId(userId) {
        return `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // Ensure uniqueness
    #generateUniqueId(userId) {
        let id;
        const existingIds = Inquiry.getAllInquiries().map(i => i.id);
        do {
            id = this.#generateId(userId);
        } while (existingIds.includes(id));
        return id;
    }
    #generateSummary(message) {
        // Create a summary from the message (first 60 chars + ellipsis if longer)
        return message.length > 60 ? `${message.substring(0, 60)}...` : message;
    }
    // Get all inquiries
    static getAllInquiries() {
        return getTable("inquiry") || [];
    }

    // Add new inquiry
    static addInquiry(inquiry) {
        add("inquiry", inquiry);
    }

    // Get inquiries by user ID
    static getInquiriesByUser(userId) {
        return this.getAllInquiries().filter(i => i.userId === userId);
    }

    // Reply to an inquiry by ID
    static replyToInquiry(inquiryId, replyMessage) {
        const inquiries = this.getAllInquiries();
        const index = inquiries.findIndex(i => i.id === inquiryId);

        if (index !== -1) {
            inquiries[index].reply = {
                message: replyMessage,
                repliedAt: new Date().toISOString()
            };
            setTable("inquiry", inquiries);
        }
    }

    // Remove inquiry by ID (optional)
    static removeInquiry(inquiryId) {
        const updated = this.getAllInquiries().filter(i => i.id !== inquiryId);
        setTable("inquiry", updated);
    }

    // Get single inquiry by ID
    static getInquiryById(id) {
        return this.getAllInquiries().find(i => i.id === id);
    }
}
