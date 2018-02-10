(function() {
  let currencies = [];
  let source = $('#some-template').html();
  let template = Handlebars.compile(source);
  let rates = [];
  let currentRate;

  // $(document).on('click', '#optionText', function() {
  //   currentRate = this.value;
  // });

  $.getJSON('https://api.fixer.io/latest?base=USD', function(rateData) {
    gbRate = rateData.rates.GBP;
    euRate = rateData.rates.EUR;
    console.log(rateData);
    ratesObj = rateData.rates;

    for (prop in ratesObj) {
      rates.push({ name: prop, rate: ratesObj[prop] });
    }
  })
    .then(() => {
      $.getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=10', function(data) {
        dataO = { currencies: data, rates: rates };
        dataO.currentRate;
        $(document).on('click', '#optionText', function() {
          dataO.currentRate = this.value;
          console.log(dataO);
          $('#content-placeholder').html(template(dataO));
        });
        $('#content-placeholder').html(template(dataO));

        console.log(rates);
        let obj = rates.find(o => o.name === 'GBP');
        console.log(obj);
      });
    })
    .then(() => {
      Handlebars.registerHelper('formatPrice', function(USDPrice, current) {
        if (current) {
          var currObj = rates.find(function(obj) {
            return obj.name === current;
          });
          // debugger;
          // var u = rates.filter(e => e.name === current);

          return (USDPrice * currObj.rate).toFixed(2);
        } else {
          GBPPrice = USDPrice * rates[0].rate;
          // console.log(USDPrice);
          return GBPPrice.toFixed(2);
        }
      });

      // let myFunc = function(someValue) {
      //   console.log(someValue);
      // };

      // Handlebars.registerHelper('printIt', function(value) {
      //   return value.rate;
      // });
    });
})();
