import { Page, Locator } from "@playwright/test";

export class LoginPage{

    private page; 
    private usernameField;
    private passwordField;
    private loginButton;

    constructor(page:Page){
        this.page = page;
        this.usernameField = this.page.getByRole("textbox", {name : 'username'});
        this.passwordField = this.page.getByRole("textbox", {name : 'password'});
        this.loginButton = this.page.getByRole("button", {name : 'Login'});
    }

    async login(user:string, password:string){
        await this.usernameField.fill(user);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage(){
        return this.page.locator("h3[data-test='error']").innerText();
        
    }
}