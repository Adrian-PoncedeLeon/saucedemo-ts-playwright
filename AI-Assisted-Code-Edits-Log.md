# AI-Assisted Code Edits Log
**AI tool:** ChatGPT  
**Project:** SauceDemo automation (TypeScript, Playwright, WDIO, Appium)

> The prompts and AI suggestions below are concise reconstructions of my work with chatgpt, not verbatim transcripts. “Final edit” describes what was implemented or decided.

## Technical edits (7)

### 1. Encapsulating login actions in a Page Object

- **Prompt:** How can I organize the login flow in a TypeScript Page Object?
- **AI suggestion:**
  ```ts
  async login(username: string, password: string) {
    await this.usernameField.setValue(username);
    await this.passwordField.setValue(password);
    await this.loginButton.click();
  }
  ```
- **Final edit:** Implemented the reusable `login(username, password)` method in `LoginPage`, using its username, password, and login-button getters.
- **Why I changed it:** Centralizes login interactions and keeps tests focused on behavior.

### 2. Choosing a locator strategy (discussion and adjustment)

- **Prompt:** What is the best way to locate SauceDemo elements in my Page Object?
- **AI suggestion:** Initially considered locating elements by visible text or generic selectors.
- **Problem I identified:** Those selectors could be ambiguous or depend on the page layout.
- **Final edit:** We used SauceDemo's explicit `data-test` attributes for the username, password, and login button, for example:
  ```ts
  $('input[data-test="username"]')
  ```
- **Why I changed it:** The test attributes are more specific and less dependent on styling.

### 3. Adding Page Object methods for assertions

- **Prompt:** How can tests check the Products page and login errors without exposing every locator?
- **AI suggestion:**
  ```ts
  public async getProductsTitle() {
    return await this.productsTitle.getText();
  }

  public async getErrorMessage() {
    return await this.errorMessage.getText();
  }
  ```
- **Final edit:** Added methods to `LoginPage` to check whether the Products title or error is displayed and to retrieve their text.
- **Why I changed it:** Tests interact through the Page Object, reducing direct locator usage in test files.

### 4. Fixing asynchronous test actions

- **Prompt:** Why does my test wait for a locator or end before an action completes?
- **AI suggestion:** Add `await` before asynchronous browser interactions.
- **Final edit:** Added `await` to actions such as filling fields, clicking the login button, and navigating to the site.
- **Why I changed it:** Browser actions must complete before the next step or assertion executes.

### 5. Handling test assertions (discussion and adjustment)

- **Prompt:** How should I assert the result of a login?
- **AI suggestion:** Initially suggested checking whether the Products page or an error element was displayed.
- **Problem I identified:** A generic visibility check alone did not verify the actual result or distinguish the expected error.
- **Final edit:** Added assertions for the Products title and exact error messages, and verified that the Products page was not displayed for failed logins.
- **Why I changed it:** Exact text checks make the test validate the expected behavior, not just the presence of an element.

### 6. Configuring the Appium service in WDIO

- **Prompt:** How can WDIO start Appium and allow UiAutomator2 ChromeDriver downloads?
- **AI suggestion:**
  ```ts
  services: [
    ['appium', {
      command: 'appium',
      args: {
        basePath: '/',
        allowInsecure: 'uiautomator2:chromedriver_autodownload'
      },
      appiumStartTimeout: 60000
    }]
  ],
  ```
- **Final edit:** Added the Appium service configuration to `wdio.conf.ts` and ran tests on the Android emulator.
- **Why I changed it:** WDIO can manage the Appium server during the test run and support the emulator's Chrome driver setup.

### 7. Capturing screenshot and page source on failure

- **Prompt:** How can I automatically capture evidence only when a WDIO test fails?
- **AI suggestion:** Use the `afterTest` hook, check the `passed` result, and save a screenshot and page source.
- **Final edit:** Implemented an `afterTest` hook in `wdio.conf.ts`, saving PNG screenshots under `Mobile tests/screenshots` and XML page source under `Mobile tests/page-sources`.
- **Why I changed it:** Failure artifacts help debug the app state and fulfill the assignment without generating files for passing tests.

## Technical learning and decisions (3)

### 8. Understanding TypeScript types in a Page Object

- **Prompt:** What do `username: string` and `password: string` mean in a method signature?
- **AI output:** Explained that TypeScript annotations define expected argument types and help catch mistakes before runtime.
- **Final decision:** Kept `login(username: string, password: string)`.
- **Why:** The method expects text credentials, and explicit types make its contract clear.

### 9. Understanding `async` and `await`

- **Prompt:** What are `async` and `await`, and why do browser methods need them?
- **AI output:** Explained that `async` makes a function return a Promise and `await` waits for an asynchronous operation to settle.
- **Final decision:** Used `async` on the login method and `await` for browser actions.
- **Why:** It makes the order of browser interactions explicit and prevents timing-related mistakes.

### 10. Understanding the Page Object pattern

- **Prompt:** Why use a Page Object instead of writing selectors and actions in every test?
- **AI output:** Explained that a Page Object groups locators and interactions behind reusable methods.
- **Final decision:** Kept login locators and login-related methods in `LoginPage`, while test files describe scenarios and assertions.
- **Why:** It separates page mechanics from test intent and makes locator changes easier to maintain.
