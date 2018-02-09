(function() {
  let currencies = [];
  let source = $('#some-template').html();
  let template = Handlebars.compile(source);
  let rates;

  $.getJSON('https://api.fixer.io/latest?base=USD&symbols=GBP,EUR', function(rateData) {
    gbRate = rateData.rates.GBP;
    euRate = rateData.rates.EUR;
    rates = [{ name: 'GBP', rate: rateData.rates.GBP }, { name: 'EUR', rate: rateData.rates.EUR }];
  })
    .then(() => {
      $.getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=10', function(data) {
        dataO = { currencies: data, rates: rates };
        $('#content-placeholder').html(template(dataO));
        console.log(dataO);
      });
    })
    .then(() => {
      Handlebars.registerHelper('formatPrice', function(USDPrice, name) {
        GBPPrice = USDPrice * rates[0].rate;
        console.log(name);
        return GBPPrice.toFixed(2);
      });
    });
})();
