import { Client, Account, ID } from "appwrite";
import confi from "../confi/confi.js";

export class Auth{
    client = new Client();
    account;
    constructor(){
        this.client
            .setEndpoint(confi.appwriteUrl)
            .setProject(confi.appwriteProjectId)
            this.account = new Account(this.client);
    }
    
    async createAccount({email,password,name}){
        try {
             const user= await this.account.create(ID.unique(),email,password,name)
            if(user) {
               return this.login({email,password})
            }
            else return user
            
        } catch (error) {
            console.log("Appwrite serive :: createAccount :: error", error);
        }
           
    }

 async login({email,password}){
            try {
                return await this.account.createEmailSession(email,password)
              
            } catch (error) {
                console.log("Appwrite serive :: Login :: error", error);
                
                
            }
            }
       
        async getCurrentUser() {
            
           
            try {
                return await this.account.get();
            } catch (error) {
                console.log("Appwrite serive :: getCurrentUser :: error", error);
            }
    
            return null;
        }
        async logout() {

            try {
                await this.account.deleteSessions();
            } catch (error) {
                console.log("Appwrite serive :: logout :: error", error);
            }
        }

}

const auth =new Auth();
export default auth;