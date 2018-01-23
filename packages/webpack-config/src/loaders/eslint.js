import loader from '../loader';

const eslint = options => config =>
  loader(
    {
      test: /\.js$/,
      exclude: /node_modules/,
      enforce: 'pre',
      use: [
        {
          loader: require.resolve('eslint-loader'),
          options
        }
      ]
    },
    config
  );

export default eslint;
