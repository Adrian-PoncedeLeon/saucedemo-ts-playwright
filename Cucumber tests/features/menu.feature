Feature: Test menu options

Scenario: Menu option "All items" redirects to products list page
    Given I login as a user into saucedemo.com
    When I go to any product page
    And I click the menu option "All Items"
    Then the page URL should be "https://www.saucedemo.com/inventory.html"
    And I should see the page with title "Products"

Scenario: Menu option "About" redirects to about page
    Given I login as a user into saucedemo.com
    When I click the menu option "About"
    Then the page URL should be "https://saucelabs.com/"

Scenario: Menu option "Logout" redirects to login page
    Given I login as a user into saucedemo.com
    When I click the menu option "Logout"
    Then the page URL should be "https://www.saucedemo.com/"
    And I should see the login form