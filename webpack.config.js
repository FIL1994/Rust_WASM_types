/**
 * @author Philip Van Raalte
 * @date 2018-01-22
 */
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  devServer: {
    historyApiFallback: true,
    port: 8080,
    contentBase: './'
  }
};