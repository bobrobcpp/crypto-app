(function() {
  //Get symbol map object from currency-symbol.js
  const symbolMap = CURRENCIES;
  let currencies = [];
  let source = $('#some-template').html();
  let template = Handlebars.compile(source);
  let rates = [{ name: 'USD', rate: 1, desc: 'US Dollars' }];
  let currentRate;
  $(document).on('click', 'footer', function() {
    $('footer').hide();
  });
  //Load todays currency exchange rates and push to rates array
  $.getJSON('https://api.fixer.io/latest?base=USD', function(rateData) {
    console.log(rateData);
    ratesObj = rateData.rates;

    for (prop in ratesObj) {
      rates.push({ name: prop, rate: ratesObj[prop], desc: symbolMap[prop].name });
    }
  })
    .then(() => {
      //Load the current cryptocurrency prices in USD and create dataO object with the data and adding the rates array for handlebars compilation
      $.getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=10', function(data) {
        dataO = { currencies: data, rates: rates };
        dataO.currentRate = 'USD';
        dataO.currentSymbol = '$';
        dataO.currentName = 'US Dollars';
        $(document).on('click', '#optionText', function() {
          dataO.currentRate = this.value;
          dataO.currentSymbol = symbolMap[this.value].symbol;
          console.log('dataO', dataO);
          $('#content-placeholder').html(template(dataO));
        });
        $('#content-placeholder').html(template(dataO));
        console.log(rates);
      });
    })
    .then(() => {
      //Handlebars helper to multiply the crytocurrency price with the exchange rate
      Handlebars.registerHelper('formatPrice', function(USDPrice, current) {
        if (current) {
          let currObj = rates.find(function(obj) {
            return obj.name === current;
          });

          return (USDPrice * currObj.rate).toFixed(2);
        } else {
          //Onload return price in GBP
          // GBPPrice = USDPrice * rates[0].rate;
          // return GBPPrice.toFixed(2);
          return USDPrice;
        }
      });
    });
})();
