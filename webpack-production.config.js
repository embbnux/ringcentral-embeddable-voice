const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const packageConfig = require('./package');
const getBaseConfig = require('./getWebpackBaseConfig');

const buildPath = path.resolve(__dirname, 'release');
const apiConfigFile = path.resolve(__dirname, 'api.json');
let apiConfig;
if (fs.existsSync(apiConfigFile)) {
  apiConfig = JSON.parse(fs.readFileSync(apiConfigFile));
} else {
  apiConfig = {
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    server: process.env.API_SERVER,
  };
}
let version = packageConfig.version;
let hostingUrl;
let redirectUri = process.env.REDIRECT_URI;
let proxyUri = process.env.PROXY_URI;
console.log('mode: ', process.env.DEPLOY_MODE);
if (process.env.DEPLOY_MODE === 's3' && process.env.S3_HOSTING_URL) {
  version = process.env.TRAVIS_TAG;
  hostingUrl = `${process.env.S3_HOSTING_URL}/${process.env.TRAVIS_TAG}`;
} else {
  hostingUrl = process.env.HOSTING_URL;
}
hostingUrl = hostingUrl || 'https://ringcentral.github.io/ringcentral-embeddable-voice';
redirectUri = redirectUri || 'https://ringcentral.github.io/ringcentral-embeddable-voice/redirect.html';
proxyUri = proxyUri || 'https://ringcentral.github.io/ringcentral-embeddable-voice/proxy.html';

const config = getBaseConfig();
config.output = {
  path: buildPath,
  filename: '[name].js',
};
config.plugins = [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
    output: {
      comments: false,
    },
    exclude: /[Aa]dapter/
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      API_CONFIG: JSON.stringify(apiConfig),
      APP_VERSION: JSON.stringify(version),
      HOSTING_URL: JSON.stringify(hostingUrl),
      REDIRECT_URI: JSON.stringify(redirectUri),
      PROXY_URI: JSON.stringify(proxyUri),
    },
  }),
  new CopyWebpackPlugin([
    { from: 'src/assets', to: 'assets' },
    { from: 'src/app.html', to: 'app.html' },
    { from: 'src/index.html', to: 'index.html' },
    { from: 'src/proxy.html', to: 'proxy.html' },
    { from: 'src/redirect.html', to: 'redirect.html' },
  ]),
];

module.exports = config;
