import { browser, expect} from '@wdio/globals'
import LoginPage from '../screens/login.page'

it('Login successful', async () => {
    await browser.url('https://www.saucedemo.com/')
    await LoginPage.login('standard_user', 'secret_sauce');
    await expect(await LoginPage.isProductsPageDisplayed()).toBe(true);
    await expect(await LoginPage.getProductsTitle()).toBe('Products');
})

// This test fails to be able to see the screenshot y page-source
it('Locked out user login', async () => {
    await browser.url('https://www.saucedemo.com/')
    await LoginPage.login('locked_out_user', 'secret_sauce');    
    await expect(await LoginPage.isErrorMessageDisplayed()).toBe(true);
    await expect(await LoginPage.getErrorMessage()).toBe('Epic sadface: Sorry, this user has been locked out. Wrong error text added.');
    await expect(await LoginPage.isProductsPageDisplayed()).toBe(false);
})

it('Login with invalid credentials', async () => {
    await browser.url('https://www.saucedemo.com/')
    await LoginPage.login('invalid_user', 'invalid_password');
    await expect(await LoginPage.isErrorMessageDisplayed()).toBe(true);
    await expect(await LoginPage.getErrorMessage()).toBe('Epic sadface: Username and password do not match any user in this service');
    await expect(await LoginPage.isProductsPageDisplayed()).toBe(false);
})  
