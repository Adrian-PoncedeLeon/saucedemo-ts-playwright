import { Page, Locator } from "@playwright/test";

export class InventoryPage{

    private page;
    private pageTitle;

    constructor(page:Page){
        this.page = page;
        this.pageTitle = this.page.locator("span.title");
    }

    async isLoaded(){
        if(await this.pageTitle.isVisible())
            return await this.pageTitle.textContent() == "Products";
        else
            return false
    }

    async productsImagesAreCorrect(){
        let items = this.page.locator("div.inventory_list .inventory_item");
        let product1Image = await items.nth(0).locator("img").getAttribute("src");
        let product2Image = await items.nth(1).locator("img").getAttribute("src");
        let product3Image = await items.nth(2).locator("img").getAttribute("src");
        return (product1Image != product2Image && product2Image != product3Image && product1Image != product3Image);
    }
}