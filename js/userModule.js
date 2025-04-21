import {GetTable } from "./db.js"
export class User{
    constructor({ firstName, lastName, email, role, phone, password }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.password = password;
        this.id = this.#generateUniqueId(firstName,lastName);
    }

    #generateId(firstName , lastName) {
        return firstName + lastName + '_' + Math.random().toString(32).substring(2, 9);
    }

    #generateUniqueId(firstName , lastName){
        let id;
        const existingIds = User.getAllExistingUserIds();
        do{
            console.log("heyyy");
            id = this.#generateId(firstName , lastName);
        }while(existingIds.includes(id));
        return id;
    }

    static getAllExistingUserIds() {
        const users = GetTable("user") || [];
        return users.map(user => user.id);
    }

   
} 