import { Page, Locator } from "@playwright/test";

export class InventoryPage{

    private page;
    private pageTitle;

    constructor(page:Page){
        this.page = page;
        this.pageTitle = this.page.locator("span.title");
    }

    async isLoaded(){
        return await this.pageTitle.textContent() == "Productsssssssssssss";
    }
}