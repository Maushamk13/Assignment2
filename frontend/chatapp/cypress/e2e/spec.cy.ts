describe('Signup Component', () => {
  beforeEach(() => {
    //  your Angular app is running at http://localhost:4200
    cy.visit('http://localhost:4200/signup'); 
  });

  it('should register a user with valid data', () => {
    // Fill in the registration form
    cy.get('[firstname]').type('Rabin');
    cy.get('[data-cy=lastname-input]').type('Kumar');
    cy.get('[data-cy=email-input]').type('rabin@example.com');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=role-input]').select('Admin'); 
    cy.get('[data-cy=group-checkbox-1]').check(); 
    cy.get('[data-cy=register-button]').click(); 

    // Assert that the user is registered successfully
    cy.contains('User Registered Successfully');
  });

  it('should handle registration errors', () => {
    // Fill in the registration form with invalid data
    cy.get('[data-cy=firstname-input]').type('Invalid');
    cy.get('[data-cy=lastname-input]').type('User');
    cy.get('[data-cy=email-input]').type('invalid_email'); // Invalid email
    cy.get('[data-cy=password-input]').type('short'); // Invalid password
    cy.get('[data-cy=role-input]').select('User');
    // Uncheck all checkboxes for selected groups

    // Click the register button
    cy.get('[data-cy=register-button]').click(); // 
    // Assert that an error message is displayed
    cy.contains('User registration failed');
  });
});

describe('Login Component', () => {
  beforeEach(() => {
    // Assuming your Angular app is running at http://localhost:4200
    cy.visit('http://localhost:4200/');
  });

  it('should log in with valid credentials', () => {
    cy.get('[data-cy=email-input]').type('test@example.com'); 
    cy.get('[data-cy=password-input]').type('password123'); 

    // Click the login button
    cy.get('[data-cy=login-button]').click(); 

    // Assert that the user is redirected to the chat page
    cy.url().should('include', '/chat/'); // Adjust the URL as per your application's routing
  });

  it('should show an error message with incorrect credentials', () => {
    // Fill in the email and password input fields with incorrect data
    cy.get('[data-cy=email-input]').type('invalid@example.com'); 
    cy.get('[data-cy=password-input]').type('incorrectPassword');   
    // Click the login button
    cy.get('[data-cy=login-button]').click(); // Add 'data-cy' attribute to your login button

    // Assert that an error message is displayed
    cy.get('[data-cy=error-message]').should('contain', 'Incorrect Email or Password, please try again!');
  });
});


