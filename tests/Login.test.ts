import {test,expect} from '@playwright/test'
import {LoginPage} from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage';

test("Succesfull login", async ({page}) => {
    let login_page = new LoginPage(page);
    let inventory_page = new InventoryPage(page);
    await page.goto("https://www.saucedemo.com/");
    await login_page.login("standard_user", "secret_sauce");
    expect(await inventory_page.isLoaded()).toBe(true);
});