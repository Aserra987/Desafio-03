import { productsPage } from "../../e2e/online-shop/pages/products";

Cypress.Commands.add('searchProduct', (id, name) => {
    if (id) {
        cy.getElementByDataCy( productsPage.elements.dataCys.searchTypeList).select('ID');
        cy.getElementByDataCy( productsPage.elements.dataCys.searchProductBar).clear().type(id).type('{enter}')
    }
    if (name) {
        cy.getElementByDataCy(productsPage.elements.dataCys.searchTypeList).select('name');
        cy.getElementByDataCy( productsPage.elements.dataCys.searchProductBar).clear().type(name).type('{enter}')
    }
});

Cypress.Commands.add('clickAddtoShoppingCartButton', (productId) => {
    cy.getElementByDataCy(`add-to-cart-${productId}`).click();
});

Cypress.Commands.add('completeCheckoutForm', (firstName, lastName, cardNumber) => {
    cy.getElementByDataCy(productsPage.elements.dataCys.checkoutFirstNameTextBox).type(firstName);
    cy.getElementByDataCy(productsPage.elements.dataCys.checkoutLastNameTextBox).type(lastName);
    cy.getElementByDataCy(productsPage.elements.dataCys.checkoutCardNumberTextBox).type(cardNumber);
});

Cypress.Commands.add('addProductIntoShoppingCart', (productId, quantity) => {
    Cypress._.times(quantity, () => {
        cy.clickAddtoShoppingCartButton(productId);
        cy.getElementByDataCy( productsPage.elements.dataCys.closeModalButton).click();
    });
});
