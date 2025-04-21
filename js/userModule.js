export class User{
    constructor({ firstName, lastName, email, role, phone, password }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.password = password;
        this.id = this.generateId(firstName, lastName);
    }

    generateId(firstName , lastName) {
        return firstName + lastName + '_' + Math.random().toString(15).substring(2, 9);
    }

 

   
} 