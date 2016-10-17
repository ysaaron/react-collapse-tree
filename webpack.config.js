let webpack = require('webpack');
let path = require('path');

const PORT = 3000;

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    main: [
      `webpack-hot-middleware/client?http://localhost:${PORT}`,
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      './src/app.js'
    ]
  },

  output: {
    path: path.resolve(__dirname, './static'),
    filename: '[name].js',
    chunckFilename: '[name].chunck.js',
    publicPath: '/static/'
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['react-hot-loader/webpack', 'babel'],
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        loaders: ['style', 'css?modules', 'postcss-loader']
      },
      {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  },

  postcss: () => ([
      require('autoprefixer'),
      require('precss')
  ]),

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  resolve: {
    extentions: ['', 'js', 'jsx']
  }
}
