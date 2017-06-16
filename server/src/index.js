if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load();
}

import sepia from 'sepia';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  sepia.fixtureDir(path.join(process.cwd(), '/test/fixtures'));
  if (process.env.DEBUG && process.env.DEBUG.match(/sepia/)) {
    sepia.configure({
      verbose: true,
      debug: true
    });
  }
  sepia.filter({
    url: /connected-accounts\/github/,
    urlFilter: (url) => {
      return url.replace(/&code=[^&]+/, '');
    }
  });
  sepia.filter({
    url: /\/expenses/,
    bodyFilter: (body) => {
      if (!body) return;
      try {
        const json = JSON.parse(body);
        if (json.expense && json.expense.incurredAt) {
          delete json.expense.incurredAt;
          body = JSON.stringify(json);
        }
      } catch (e) {
        // noop
      }
      return body;
    }
  });
}

import 'babel-register';
import './global';

import app from './app';

export default app;
