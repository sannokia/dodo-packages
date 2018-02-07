var path = require('path')

module.exports = {
  resolve: {
    modules: [__dirname, 'src', 'scss', 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              includePaths: [
                path.resolve(__dirname, '../public'),
                path.resolve(__dirname, '../src'),
                path.resolve(__dirname, '../src/styles'),
                path.resolve(__dirname, '../node_modules')
              ]
            }
          }
        ]
      }
    ]
  }
}
