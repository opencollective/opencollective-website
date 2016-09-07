if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load();
}

import 'babel-register';
import './global';

import app from './app';

export default app;
