var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var path    = require('path');

var express    = require('express');
var bodyParser = require('body-parser');

var zipcode;
app.set('view engine', 'pug')
app.set('views', './views');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'))


//Get zip code from index.html
app.post('/',function(req, res, next){
    // zipcode = req.body.clientZipCode;
    zipcode = req.body.zipcode;
    console.log("The zipcode is " + zipcode);



      url = 'https://www.foodora.ca/restaurant/q1sd/springsushi';


    //check if substring exists in Array and return instance
      function searchStringInArray (str, strArray) {
          for (var j=0; j<strArray.length; j++) {
              if (strArray[j].toUpperCase().match(str)) return j;
          }
          return -1;
      }


      //scrape page
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

        res.render('index', {
        title: 'Sushi Scraper',
        message: 'Enter your zip code to find sushi restaurants near you', myzip: zipcode,
        costs:"The price of a California roll is "+ california_roll +
        "   The price of a spicy tuna roll is "+ tuna_roll +
        "   The price of a spring roll is "+ spring_roll})
      })
});

app.get('/',function(req,res){
  // res.sendFile(path.join(__dirname+'/index.html'));
  //  app.use('/css',express.static(path.join(__dirname, '/css')));
  res.render('index', { title: 'Sushi Scraper', message: 'Enter your zip code to find sushi restaurants near you' })
});

//get data from sushi site
app.get('/scrape', function(req, res){

})

app.listen('8081')
console.log('Server started on port 8081');
exports = module.exports = app;
