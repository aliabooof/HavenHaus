

import { User } from "./userModule.js";
import { setTable } from "../modules/db.js";

export class Auth {


    static login(data) {
        const loginEmail = data.email.toLowerCase();
        const loginPassword = data.password;

        const user = User.getUserByEmail(loginEmail);

        if (!user) {
            console.log("Email not found.");
            return false;
        }

        if (user.password === loginPassword) {
            setTable("currentUser", user);
            setTable("loggedin",true);
            console.log("Login successful. User:", user);
            return true;
        } else {
            console.log("Incorrect password.");
            return false;
        }
    }

    static register(data) {
        const registerFormData = data;

        const user = new User(registerFormData);
        console.log(user.email);

        const exists = User.checkUserExistance(user.email);

        if (!exists) {
            User.addUser(user);
            return true;
        } else {
            return false;
        }
    }

    logout() {

    }
}