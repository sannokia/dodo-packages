var path = require('path')

module.exports = {
  resolve: {
    root: __dirname,
    modulesDirectories: ['src', 'scss', 'node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css?-url!sass'
      }
    ]
  },
  sassLoader: {
    outputStyle: 'expanded',
    includePaths: [
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../scss')
    ]
  }
}
