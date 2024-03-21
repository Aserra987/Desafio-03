/// <reference types="cypress" />
import { homePage } from "../pages/home";
import { productsPage } from "../pages/products" 

describe('Desafio 3', () => {
  
  before(() => {
    // Login on Pushing It
    cy.login(Cypress.env().username, Cypress.env().password);
    cy.visit('');
    cy.intercept('POST', `${Cypress.env().baseUrlAPI}/purchase`).as('purchaseRequest');
    cy.fixture('products').as('productsData');
    cy.fixture('customerData').as('customerData');
  })

  it('Verify Purchase order using PostgreSQL', function () {
    // Search products ands delete if exists
    Cypress._.each(this.productsData.products, (product) => {
      cy.getProduct(product.id)
      .its('body.products.docs').each((product) => {
        cy.deleteProduct(product._id);
      });
      cy.createProduct({body: product});
    });
    
    // Go to online Shop
    cy.getElementByDataCy( homePage.elements.dataCys.onlineshoplink).click();
    
    // Add first product to the shoppingCart twice
    cy.searchProduct(this.productsData.products.product1.id);
    cy.addProductIntoShoppingCart(this.productsData.products.product1.id, this.productsData.products.product1.quantity);
    
    // Add Second product to the shoppingCart twice
    cy.searchProduct(this.productsData.products.product2.id);
    cy.addProductIntoShoppingCart(this.productsData.products.product2.id, this.productsData.products.product2.quantity);
    
    // Complete purchase
    cy.getElementByDataCy(productsPage.elements.dataCys.goShoppingCartButton).click();
    cy.getElementByDataCy(productsPage.elements.dataCys.goCheckoutButton).click();
    cy.completeCheckoutForm(this.customerData.firstName, this.customerData.lastName, this.customerData.creditCardNumber);
    cy.getElementByDataCy(productsPage.elements.dataCys.purchaseButton).click();

    // SQL Validation
    cy.wait('@purchaseRequest', { timeout: 60000 }).then(requestData => {
      const sellid = requestData.response.body.product.sellid;
      const query = `
      SELECT 
        public."purchaseProducts".product, 
        public."purchaseProducts".quantity, 
        public."purchaseProducts".price,
        public."purchaseProducts".total_price,
        public.sells."firstName",
        public.sells."lastName",
        public.sells."cardNumber"
      FROM public."purchaseProducts"
      INNER JOIN  public.sells 
      ON public."purchaseProducts".sell_id = public.sells.id 
      WHERE public.sells.id = ${sellid}`

      cy.task("connectDB", query).then(result => {
        expect(result[0]).to.be.deep.equal({ 
          product: this.productsData.products.product1.name,
          quantity: this.productsData.products.product1.quantity,
          price: this.productsData.products.product1.price,
          total_price: `${(Number(this.productsData.products.product1.price) * this.productsData.products.product1.quantity).toFixed(2)}`,
          firstName: this.customerData.firstName, 
          lastName: this.customerData.lastName,
          cardNumber: this.customerData.creditCardNumber,
        });
        expect(result[1]).to.be.deep.equal({ 
          product: this.productsData.products.product2.name,
          quantity: this.productsData.products.product2.quantity,
          price: this.productsData.products.product2.price,
          total_price: `${(Number(this.productsData.products.product2.price) * this.productsData.products.product2.quantity).toFixed(2)}`,
          firstName: this.customerData.firstName, 
          lastName: this.customerData.lastName,
          cardNumber: this.customerData.creditCardNumber,
        });
      });
    });
  });
})
      