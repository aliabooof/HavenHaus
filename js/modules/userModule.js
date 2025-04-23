import {getTable,add } from "../componentModules/db.js"
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
            
            id = this.#generateId(firstName , lastName);
        }while(existingIds.includes(id));
        return id;
    }

    static getAllUsers(){
        return getTable("user")||[];
    }

    static getAllExistingUserIds() {
        const users = getTable("user") || [];
        return users.map(user => user.id);
    }

    static getAllExistingEmail(){
        const users = getTable("user")||[];
        return users.map(user => user.email.toLowerCase());
    }

    static getUserByEmail(email) {
        const users = getTable("user") || [];
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }
    
    static getCurrentUser(){
        return getTable('currentUser');
    }
    
    static getUserById(id){
        const users =getTable("user")|[];
        return users.find(user => user.id === id);
    }

    static checkUserExistance(email){
        const user = this.getUserByEmail(email);
        console.log(user);
        if(user)
            return true;
        return false;
    }

    static addUser(user){
        add("user",user);
    }

    static removeUser(id) {
            const users = this.getAllProducts().filter(user => user.id !== id);
            setTable("product", products);
        }
 
} 