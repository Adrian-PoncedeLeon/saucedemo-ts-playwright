import {Given, When, Then, Before, After} from '@cucumber/cucumber';
import {expect} from '@playwright/test';
import {chromium, Page, Browser} from '@playwright/test';

Before(async function () {
    const browser: Browser = await chromium.launch();
    const page: Page = await browser.newPage(); 
    this.browser = browser;
    this.page = page;
});

Given ('I login as a user into saucedemo.com', async function () {
    await this.page.goto('https://www.saucedemo.com/');
    await this.page.fill('#user-name', 'standard_user');
    await this.page.fill('#password', 'secret_sauce');
    await this.page.click('#login-button');
});

When ('I go to any product page', async function () {
    await this.page.click('.inventory_item:first-child .inventory_item_name');
});

When('I click the menu option {string}', async function (menuOption: string) {
    await this.page.click('#react-burger-menu-btn');
    await this.page.click(`.bm-item-list a:has-text("${menuOption}")`);
});

Then('the page URL should be {string}', async function (expectedUrl: string) {
    await expect(this.page).toHaveURL(expectedUrl);
}); 

Then('I should see the page with title {string}', async function (expectedTitle: string) {
    const actualTitle = await this.page.locator("span.title").textContent();
    expect(actualTitle).toBe(expectedTitle);
});

Then('I should see the login form', async function () {
    const loginFormVisible = await this.page.isVisible('#login-button');
    expect(loginFormVisible).toBe(true);
});

After(async function () {
    await this.browser.close();
});
