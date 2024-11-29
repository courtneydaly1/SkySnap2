const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    buffer: require.resolve('buffer/'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util/'),
    process: require.resolve('process/browser.js'),
    vm: require.resolve('vm-browserify'),  
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
    }),
  ]);

  return config;
};
