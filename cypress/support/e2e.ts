import '@testing-library/cypress/add-commands';

// Custom command to login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

// Custom command to create an incident
Cypress.Commands.add('createIncident', (incidentData: any) => {
  cy.visit('/incidents/new');
  cy.get('[data-testid="title-input"]').type(incidentData.title);
  cy.get('[data-testid="location-input"]').type(incidentData.location);
  cy.get('[data-testid="description-input"]').type(incidentData.description);
  cy.get('[data-testid="severity-select"]').select(incidentData.severity);
  cy.get('[data-testid="submit-button"]').click();
});

// Custom command to create a camera
Cypress.Commands.add('createCamera', (cameraData: any) => {
  cy.visit('/cameras/new');
  cy.get('[data-testid="name-input"]').type(cameraData.name);
  cy.get('[data-testid="location-input"]').type(cameraData.location);
  cy.get('[data-testid="model-input"]').type(cameraData.model);
  cy.get('[data-testid="ip-address-input"]').type(cameraData.ipAddress);
  cy.get('[data-testid="submit-button"]').click();
});

// Custom command to generate a report
Cypress.Commands.add('generateReport', (reportData: any) => {
  cy.visit('/reports/new');
  cy.get('[data-testid="type-select"]').select(reportData.type);
  cy.get('[data-testid="period-select"]').select(reportData.period);
  cy.get('[data-testid="format-select"]').select(reportData.format);
  cy.get('[data-testid="submit-button"]').click();
});

// Custom command to check toast messages
Cypress.Commands.add('checkToast', (message: string) => {
  cy.get('.Toastify__toast').should('contain', message);
});

// Custom command to wait for API requests
Cypress.Commands.add('waitForApi', (method: string, url: string) => {
  cy.intercept(method, url).as('apiRequest');
  cy.wait('@apiRequest');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createIncident(incidentData: any): Chainable<void>;
      createCamera(cameraData: any): Chainable<void>;
      generateReport(reportData: any): Chainable<void>;
      checkToast(message: string): Chainable<void>;
      waitForApi(method: string, url: string): Chainable<void>;
    }
  }
} 