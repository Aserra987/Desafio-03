
Cypress.Commands.add('getProduct', (productId) => {
   cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/products?id=${productId}`,
        failsOnStatusCode: false,
        headers: {
            Authorization: `Bearer ${Cypress.env().apiToken}`
        }
    }).then((resp) => {
        expect(resp.status).to.eq(200);
    });
});

Cypress.Commands.add('deleteProduct', (_id) => {
    cy.request({
        method: "DELETE",
        url: `${Cypress.env().baseUrlAPI}/product/${_id}`,
        headers: {
            Authorization: `Bearer ${Cypress.env().apiToken}`,
        }
    }).then((resp) => {
        expect(resp.status).to.eq(202);
    });
});

Cypress.Commands.add('createProduct', ({body}) => {
    cy.request({
        method: "POST",
        url: `${Cypress.env().baseUrlAPI}/create-product`,
        body: body,
    }).then((resp) => {
        expect(resp.status).to.eq(201);
    });
});

Cypress.Commands.add('editProduct', ({id, body}) => {
    cy.getProduct({productId: id})
    .its('body.products.docs').each((product) => {
        cy.request({
            method: "PUT",
            url: `${Cypress.env().baseUrlAPI}/product/${product._id}`,
            headers: {
                Authorization: `Bearer ${Cypress.env().apiToken}`,
            },
            body: body
        }).then((resp) => {
            expect(resp.status).to.eq(202);
        });
    });
});
