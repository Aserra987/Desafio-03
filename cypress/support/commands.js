import './requests/products'
import './actions/products'

Cypress.Commands.add('getElementByDataCy', (dataCy) => { 
    cy.get(`[data-cy="${dataCy}"]`);
});

Cypress.Commands.add('login', (username, password) => {
    cy.request({
        method: "POST",
        url: `${Cypress.env().baseUrlAPI}/login`,
        body: {
            username: username,
            password: password
        },
    }).then(respuesta => {
        window.localStorage.setItem('token', respuesta.body.token);
        window.localStorage.setItem('user', respuesta.body.user.username);
        window.localStorage.setItem('userId', respuesta.body.user._id);
        Cypress.env().apiToken = respuesta.body.token;
    });
});
