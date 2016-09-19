// Makes a globally accessible $assets helper for retrieving asset URL
import 'expose?$assets!./assets/paths' // eslint-disable-line

import createStore from './store/web'
import render from './renderers/web'
import routes from './routes';

import './css/main.css'

const store = createStore(routes, window.__INITIAL_STATE__)


render(store, document.getElementById('content'))
