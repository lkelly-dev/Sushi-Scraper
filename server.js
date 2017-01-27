var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

  url = 'https://www.foodora.ca/restaurant/q1sd/springsushi';


  function searchStringInArray (str, strArray) {
      for (var j=0; j<strArray.length; j++) {
          if (strArray[j].toUpperCase().match(str)) return j;
      }
      return -1;
  }

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var name, price;
      var json = { name : "", price : ""};

      var items = [];
      var prices = [];


      $('.menu__item__name').each(function(i, elem) {
        var data = $(this);
        items[i] = $(this).text().trim().replace(/[\n\t\r]/g,"");

        json.name = items;
      });

      $('.menu__item__price').each(function(i, elem) {
        var data = $(this);
        prices[i] = $(this).text().trim().replace(/[\n\t\r]/g,"");

        json.price = prices;
      });


     }
     else {
       console.log(error);
       console.log("ERROR");
     }

     var spring_roll = prices[searchStringInArray("SPRING ROLL", items)];
     console.log("The price of a spring roll is "+ spring_roll);

     var tuna_roll = prices[searchStringInArray("SPICY TUNA ROLL", items)];
     console.log("The price of a spicy tuna roll is "+ tuna_roll);

     var california_roll = prices[searchStringInArray("CALIFORNIA ROLL", items)];
     console.log("The price of a California roll is "+ california_roll);


    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written!');
    })

    res.send(JSON.stringify(json, null, 4))
  })
})

app.listen('8081')
console.log('Server started on port 8081');
exports = module.exports = app;
