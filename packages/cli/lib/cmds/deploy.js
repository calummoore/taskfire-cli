'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = handler;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sha = require('sha.js');

var _sha2 = _interopRequireDefault(_sha);

var _request = require('../helpers/request');

var _request2 = _interopRequireDefault(_request);

var _errors = require('../helpers/errors');

var _errors2 = _interopRequireDefault(_errors);

var _output = require('../helpers/output');

var _output2 = _interopRequireDefault(_output);

var _paths = require('../helpers/args/paths');

var _flow = require('../helpers/args/flow');

var _project = require('../helpers/args/project');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function handler(args) {
  // Get a list of files and upload them
  const files = await (0, _paths.getPaths)(args);

  // No files
  if (files.length === 0) {
    (0, _errors2.default)('No files found');
  }

  // Require a projectName
  const project = await (0, _project.getProjectName)(args, true);

  console.log(project);

  // Upload each file and wait for them to complete
  const promises = files.map(async file => {
    (0, _output2.default)(`Uploading ${file}`, args);
    const stream = _fsExtra2.default.createReadStream(file);
    return (0, _request2.default)(args, {
      url: '/files',
      method: 'POST',
      body: stream,
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      qs: {
        project
      },
      json: false
    });
  });

  await Promise.all(promises);

  _output2.default.accent('Upload success', args);
  _output2.default.space(args);

  // Upload the deployment data
  const name = await (0, _flow.getFlowName)(args);
  _output2.default.accent(`Deploying flow: ${name}`, args);

  // Send deploy request
  const deployFilesPromises = files.map(async file => {
    const buffer = _fsExtra2.default.readFileSync(file);
    const sha = (0, _sha2.default)('sha256').update(buffer).digest('hex');
    return {
      // name: path.basename(file),
      sha,
      size: buffer.byteLength,
      path: _path2.default.relative((0, _paths.getCwd)(args), file)
    };
  });

  const deployFiles = await Promise.all(deployFilesPromises);

  // Deploy!
  await (0, _request2.default)(args, {
    url: '/deploy',
    method: 'POST',
    body: {
      flow: name,
      files: deployFiles
    },
    qs: {
      project
    }
  });

  _output2.default.success('Deployment complete', args);

  (0, _output2.default)('View your deployment at:');
  _output2.default.accent('');
}

exports.default = {
  command: 'deploy [dir]',
  desc: 'Deploy your flow',
  builder: yargs => {
    return yargs.positional('dir', {
      describe: 'directory to deploy',
      default: './'
    });
  },
  handler
};