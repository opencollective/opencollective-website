import localStorage from 'localmockage';

// Polyfill for window object when you render react on the server side
// This is good enough for now because we use only the location part
// if we need more, we will need jsdom

global.window = {
  location: {},
  addEventListener: () => {}
};

global.Stripe = {};

// In memory localstorage
global.localStorage = localStorage;

