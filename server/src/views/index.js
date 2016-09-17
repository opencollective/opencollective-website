import path from 'path';
import hbs from 'express-hbs';
import moment from 'moment';
import config from 'config';
import bustedHelper from './helpers/busted';

process.title = 'node'; // Hack for numbro :-/
import numbro from 'numbro';

export default (app) => {
  hbs.registerHelper("debug", () => {});

  hbs.registerHelper("cachebust", bustedHelper);

  hbs.registerHelper("moment", (value) => {
    return moment(value).fromNow();
  });

  hbs.registerHelper("titleCase", (value) => {
    return value.substr(0,1).toUpperCase() + value.substr(1);
  });

  hbs.registerHelper("singular", (value) => {
    return value.replace(/s$/,'');
  });

  hbs.registerHelper("currency", (value, props) => {
    const options = props.hash;
    options.precision = options.precision || 0;
    const number = numbro(value);
    return (options.precision == 2) ? number.format('$ 0,0.00') : number.format('$ 0,0');
  });

  app.set('view engine', 'hbs');
  app.set('view cache', config.viewCache);
  
  app.engine('hbs', hbs.express4({
    partialsDir: path.join(app.get('views'), '/partials'),
    defaultLayout: path.join(app.get('views'), '/layouts/default')
  }));

}
