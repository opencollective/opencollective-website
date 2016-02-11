const path = require('path');
const hbs = require('express-hbs');
const moment = require('moment');
const config = require('config');

process.title = 'node'; // Hack for numbro :-/
const numbro = require('numbro');

module.exports = (app) => {
  hbs.registerHelper("debug", (optionalValue) => {
    return;
    console.log("Current Context");
    console.log("====================");
    console.log(this);
  
    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }
  });

  hbs.registerHelper("moment", (value) => {
    return moment(value).fromNow();
  });
  
  hbs.registerHelper("currency", (value, props) => {
    const options = props.hash;
    options.precision = options.precision || 0;
    const number = numbro(value);
    return (options.precision == 2) ? number.format('$ 0,0.00') : number.format('$ 0,0');
  });
  
  app.engine('hbs', hbs.express4({
    partialsDir: path.join(__dirname, '/partials'),
    defaultLayout: path.join(__dirname, '/layouts/default')
  }));
  app.set('view engine', 'hbs');
  app.set('views', __dirname); 
  app.set('view cache', config.viewCache);
}