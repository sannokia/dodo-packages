import loader from '../loader';

const babel = options => config =>
  loader(
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: require.resolve('babel-loader'),
      options
    },
    config
  );

export default babel;
