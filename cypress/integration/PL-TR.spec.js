/// <reference types="cypress" />

describe('PL-TR', () => {

  it('Delivery Options', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150.00&fromCountryCode=TR&toCountryCode=PL&fromCurrencyCode=TRY&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      expect(body.deliveryOptions.standard.name).to.eql("Standard");
      expect(body.deliveryOptions.today.name).to.eql("Today")

    })
  })

  it('Payment Options Standard Delivery', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150.00&fromCountryCode=TR&toCountryCode=PL&fromCurrencyCode=TRY&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      expect(body.deliveryOptions.standard.paymentOptions.bank.code).to.eql("bank");

    })
  })

  it('Payment Options Delivery Today', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150.00&fromCountryCode=TR&toCountryCode=PL&fromCurrencyCode=TRY&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      expect(body.deliveryOptions.today.paymentOptions.bank.code).to.eql("bank");

    })
  })

  it('Bank Receiving amount calculation', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150.00&fromCountryCode=TR&toCountryCode=PL&fromCurrencyCode=TRY&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      var sendingAmount = body.deliveryOptions.standard.paymentOptions.bank.quote.sendingAmount;
      var rate = body.deliveryOptions.standard.paymentOptions.bank.quote.rate;
      var finalFee = body.deliveryOptions.standard.paymentOptions.bank.quote.fees.finalFee;
      var receivingAmount = body.deliveryOptions.standard.paymentOptions.bank.quote.receivingAmount;

      let calculatedAmount = sendingAmount * rate - finalFee;

      calculatedAmount = Math.round((calculatedAmount * 100), 2) / 100

      expect(calculatedAmount).to.eql(receivingAmount);
    })
  })

  it('Max Amount Payment Now', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      expect(body.deliveryOptions.now.paymentOptions.bank.availability.isAvailable).to.eql(false);
      expect(body.deliveryOptions.now.paymentOptions.card.availability.isAvailable).to.eql(true);

    })
  })

  it('Max Amount Payment Standard', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      expect(body.deliveryOptions.standard.paymentOptions.bank.availability.isAvailable).to.eql(true);
      expect(body.deliveryOptions.standard.paymentOptions.card.availability.isAvailable).to.eql(true);

    })
  })

  //Unable to generate such scenario as upon the exceeded amount, 'Amount is to Large' message is being displayed, no delivery options suggested.
  it('maxAmount exceeded Delivery Standard', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=1000000.01&fromCountryCode=TR&toCountryCode=PL&fromCurrencyCode=TRY&toCurrencyCode=EUR',
      failOnStatusCode: false

    }).then( ({ body }) => {

      expect(body.deliveryOptions.standard.availability.isAvailable).to.eql(false);

    })
  })

  //Test passes when "reason": "NOT_WORKING_HOURS" = true, only.
  it('maxAmount exceeded Today Delivery', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=100000.01&fromCountryCode=TR&toCountryCode=PL&fromCurrencyCode=TRY&toCurrencyCode=EUR',
      failOnStatusCode: false

    }).then( ({ body }) => {

      expect(body.deliveryOptions.today.availability.isAvailable).to.eql(false);

    })
  })
})
