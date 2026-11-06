import { $ } from '@wdio/globals'

export class LoginPage {
    
    private get usernameField() {
        return $('input[data-test="username"]');
    }

    private get passwordField() {
        return $('input[data-test="password"]');
    }

    private get loginButton() {
        return $('input[data-test="login-button"]');
    }

    private get productsTitle() {
        return $('.title');
    }

    private  get errorMessage() {
        return $('h3[data-test="error"]');
    }

    public async login(username: string, password: string){
        await this.usernameField.setValue(username);
        await this.passwordField.setValue(password);
        await this.loginButton.click();
    }

    public async isProductsPageDisplayed() {
        return await this.productsTitle.isDisplayed();
    }

    public async getProductsTitle() {
        return await this.productsTitle.getText();
    }

    public async isErrorMessageDisplayed() {
        return await this.errorMessage.isDisplayed();
    }

    public async getErrorMessage() {
        return await this.errorMessage.getText();
    }
}

export default new LoginPage();
