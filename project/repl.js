/* eslint-disable */
require('colors')

const fs = require('fs')
const path = require('path')
const lodash = require('lodash')

function start (options = {}, context = {}, ready = function() {}) {
  options = lodash.defaults(options, {
    terminal: true,
    colors: true,
    ignoreUndefined: true,
    prompt: `${'OpenCollective'.cyan}${'> '.grey}`,
    input: process.stdin,
    output: process.stdout,
    useGlobal: true
  })

  let server = require('repl').start(options)

  if (options.historyFile && options.historyFile) {
    let historyFilePath = path.resolve(options.historyFile)
    server = setupHistory(server, historyFilePath)
  }

  Object.keys(context).forEach(key => {
    Object.defineProperty(server.context, key, {
      configurable: true,
      enumerable: true,
      get: function() {
        return context[key]
      }
    })
  })

  try {
    promisify(server)
  } catch (error) {
    ready(error)
    return
  }

  ready && ready(null, server)

  return server
}

/* eslint-disable */
export function promisify (repl) {
  var realEval = repl.eval;
  var promiseEval = function (cmd, context, filename, callback) {
    realEval.call(repl, cmd, context, filename, function (err, res) {
      // Error response
      if (err) {
        return callback(err);
      }

      // Non-thenable response
      if (!res || typeof res.then != 'function') {
        return callback(null, res);
      }

      // Thenable detected; extract value/error from it

      // Start listening for escape characters, to quit waiting on the promise
      var cancel = function (chunk, key) {
        repl.outputStream.write('break.\n');
        if (key.name === 'escape') {
          process.stdin.removeListener('keypress', cancel);
          callback(null, res);
          // Ensure we don't call the callback again
          callback = function () {};
        }
      };
      process.stdin.on('keypress', cancel);

      // Start a timer indicating that escape can be used to quit
      var hangTimer = setTimeout(function () {
        repl.outputStream.write('Hit escape to stop waiting on promise\n');
      }, 5000);

      res.then(function (val) {
        process.stdin.removeListener('keypress', cancel);
        clearTimeout(hangTimer);
        callback(null, val)
      }, function (err) {
        process.stdin.removeListener('keypress', cancel);
        clearTimeout(hangTimer);
        repl.outputStream.write('Promise rejected: ');
        callback(err);
      }).then(null, function (uncaught) {
        // Rethrow uncaught exceptions
        process.nextTick(function () {
          throw uncaught;
        });
      });
    });
  };

  repl.eval = promiseEval;

  repl.commands['promise'] = {
    help: 'Toggle auto-promise unwrapping',
    action: function () {
      if (repl.eval === promiseEval) {
        this.outputStream.write('Promise auto-eval disabled\n');
        repl.eval = realEval;
      } else {
        this.outputStream.write('Promise auto-eval enabled\n');
        repl.eval = promiseEval;
      }
      this.displayPrompt();
    }
  }
}

module.exports = start

function setupHistory(repl, file) {

  try {
    var stat = fs.statSync(file);
    repl.rli.history = fs.readFileSync(file, 'utf-8').split('\n').reverse();
    repl.rli.history.shift();
    repl.rli.historyIndex = 0;
  } catch (e) {}

  var fd = fs.openSync(file, 'a'), reval = repl.eval;

  repl.rli.addListener('line', function(code) {
    if (code && code !== '.history') {
      fs.write(fd, code + '\n');
    } else {
      repl.rli.historyIndex++;
      repl.rli.history.pop();
    }
  });

  process.on('exit', function() {
    fs.closeSync(fd);
  });

  repl.commands['.history'] = {
    help : 'Show the history',
    action : function() {
      var out = [];
      repl.rli.history.forEach(function(v, k) {
        out.push(v);
      });
      repl.outputStream.write(out.reverse().join('\n') + '\n');
      repl.displayPrompt();
    }
  };

  return repl
};
