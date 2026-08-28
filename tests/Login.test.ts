import {test,expect} from '@playwright/test'
import {LoginPage} from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage';

test("Succesfull login", async ({page}) => {
    let login_page = new LoginPage(page);
    let inventory_page = new InventoryPage(page);
    await page.goto("https://www.saucedemo.com/");
    await login_page.login("standard_user", "secret_sauce");
<<<<<<< HEAD
=======
    expect(await inventory_page.isLoaded()).toBe(true);
});

test("Locked out user login", async ({page}) => {
    let login_page = new LoginPage(page);
    let inventory_page = new InventoryPage(page);
    await page.goto("https://www.saucedemo.com/");
    await login_page.login("locked_out_user", "secret_sauce");
    expect(await login_page.getErrorMessage()).toBe("Epic sadface: Sorry, this user has been locked out.")
>>>>>>> 6615d1b (Second test done)
    expect(await inventory_page.isLoaded()).toBe(false);
});