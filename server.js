var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

  url = 'https://www.foodora.ca/restaurant/q1sd/springsushi';




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

     var a = items.indexOf("Spring Roll");
     var b = prices[a];
     console.log("The price of a spring roll is "+ b);


    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send(JSON.stringify(json, null, 4))
  })
})

app.listen('8081')
console.log('Server started on port 8081');
exports = module.exports = app;
