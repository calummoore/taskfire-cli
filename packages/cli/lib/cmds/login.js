'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _promiseCallbacks = require('promise-callbacks');

var _request = require('../helpers/request');

var _request2 = _interopRequireDefault(_request);

var _output = require('../helpers/output');

var _output2 = _interopRequireDefault(_output);

var _config = require('../helpers/args/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const promptGet = _promiseCallbacks.promisify.method(_prompt2.default, 'get');

const schema = {
  properties: {
    username: {
      description: 'Username',
      // pattern: /^[0-9a-zA-Z@.\-]+$/,
      // message: 'Username should be your e-mail address',
      required: true
    },
    password: {
      description: 'Password',
      hidden: true
    }
  }
};

async function handler(args) {
  // Get the login details
  _prompt2.default.start();

  const { username, password } = await promptGet(schema);

  const login = await (0, _request2.default)(args, {
    method: 'POST',
    url: '/login',
    body: {
      email: username,
      password
    }
  }, false).catch(() => {
    throw new Error(_chalk2.default.red('Invalid credentials'));
  });

  if (login) {
    await (0, _config.addAuthConfig)(args, username, login.token, login.username);
  }

  (0, _output2.default)(_chalk2.default.green('Successful login'), args);
}

exports.default = {
  command: 'login',
  desc: 'Login to Taskfire',
  builder: {
    dir: {
      default: '.'
    }
  },
  handler
};