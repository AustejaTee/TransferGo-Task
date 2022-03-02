/// <reference types="cypress" />

describe('LT-PL', () => {

  it('Delivery Options', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      expect(body.deliveryOptions.standard.name).to.eql("Standard");
      expect(body.deliveryOptions.now.name).to.eql("Now")

    })
  })

  it('Bank Receiving amount calculations', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
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

  it('Card Receiving amount calculation', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      var sendingAmount = body.deliveryOptions.standard.paymentOptions.card.quote.sendingAmount;
      var rate = body.deliveryOptions.standard.paymentOptions.card.quote.rate;
      var finalFee = body.deliveryOptions.standard.paymentOptions.card.quote.fees.finalFee;
      var receivingAmount = body.deliveryOptions.standard.paymentOptions.card.quote.receivingAmount;

      let calculatedAmount = sendingAmount * rate - finalFee;

      calculatedAmount = Math.round((calculatedAmount * 100), 2) / 100

      expect(calculatedAmount).to.eql(receivingAmount);
    })
  })

  it('maxAmount Delivery Now', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      expect(body.deliveryOptions.now.configuration.maxAmount).to.eql(2000);

    })
  })

  it('maxAmount Delivery Standard', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      expect(body.deliveryOptions.standard.configuration.maxAmount).to.eql(1000000);

    })
  })

  it('Payment Options Standard Delivery', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      expect(body.deliveryOptions.standard.paymentOptions.bank.code).to.eql("bank");
      expect(body.deliveryOptions.standard.paymentOptions.card.code).to.eql("card");

    })
  })

  it('Payment Options Delivery Now', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
    }).then( ({ body }) => {

      expect(body.deliveryOptions.now.paymentOptions.bank.code).to.eql("bank");
      expect(body.deliveryOptions.now.paymentOptions.card.code).to.eql("card");

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

  it('Amount is too large', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=1100000&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
      failOnStatusCode: false
    }).then( ({ body }) => {

      expect(body.error).to.eql("AMOUNT_IS_TOO_LARGE");

    })
  })

  it('Amount is too small', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=0.99&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
      failOnStatusCode: false

    }).then( ({ body }) => {

      expect(body.error).to.eql("AMOUNT_IS_TOO_SMALL");

    })
  })

  it('maxAmount exceeded Delivery Now', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=2000.01&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
      failOnStatusCode: false

    }).then( ({ body }) => {

      expect(body.deliveryOptions.now.availability.isAvailable).to.eql(false);

    })
  })

  //Unable to generate such scenario as upon the exceeded amount, 'Amount is to Large' message is being displayed, no delivery options suggested.
  it('maxAmount exceeded Standard Delivery', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=1000000.01&fromCountryCode=LT&toCountryCode=Pl&fromCurrencyCode=EUR&toCurrencyCode=EUR',
      failOnStatusCode: false

    }).then( ({ body }) => {

      expect(body.deliveryOptions.standard.availability.isAvailable).to.eql(false);

    })
  })

  it('Response time is less than 200ms', () => {
    cy.request({
      method: 'GET',
      url: 'https://my.transfergo.com/api/transfers/quote?calculationBase=sendAmount&amount=150&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR',
    }).then( ({ duration }) => {

      expect(duration).to.be.below(200);

    })
  })
})
