export default {
    "extends": "opencollective",

    "env": {
        "mocha": true
    },
    "plugins": [
        "mocha"
    ],
    "rules": {
      // we still use console even on frontend
      "no-console": 0,

      "mocha/no-exclusive-tests": "error",

      "no-unused-vars": ["error", {
        "vars": "local",
        "args": "none"
      }]

      // "comma-dangle": [2, 'always-multiline']
    }
}
