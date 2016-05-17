import jsdom from 'jsdom';
import localStorage from 'localmockage';

/**
 * A super simple DOM ready for React to render into
 */

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.parentWindow;

/**
 * Mock implementation of localstorage
 */

global.localStorage = localStorage;

// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(document.parentWindow)

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal (window) {
  for (const key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load();
}
