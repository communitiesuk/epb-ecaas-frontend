//login

const url = 'http://localhost:3000'

describe('template spec', () => {
  it('passes', () => {
    cy.visit(url)
    cy.contains('Heating systems').click()
    cy.contains('Energy supply').click()

    //  cy.get('label[for="fuelType_electricity"]').click()


     cy.get('[data-testid="fuelType_electricity"]')   
  .check({ force: true })                       
  .should('be.checked');

// cy.get('[type="checkbox"]').check('electricity').trigger('change')
    //  cy.get('input').trigger('mousedown')


// cy.get('label[for="fuelType_electricity"]').click({ force: true });
// // cy.get('#fuelType_electricity').should('be.checked')
// cy.get('[data-testid="fuelType_electricity"]').realClick().debug()

// cy.get('label[for="fuelType_electricity"]').click()
// cy.wait(5000)
// cy.get('label[for="fuelType_electricity"]').blur()

// // cy.get('#fuelType_electricity').check({ force: true });

// // cy.contains('label', 'Electricity').click({ force: true });

// cy.get('[data-testid="exported"]').should('exist'); 

    // cy.get('[type=checkbox]').check('electricity')
// Click on a visible item that triggers model.fuelType update
// Click on a visible item that triggers model.fuelType update
  })

})