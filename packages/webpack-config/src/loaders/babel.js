import loader from '../loader';

const babel = options => config =>
  loader(
    {
      test: /\.(js|jsx|mjs)$/,
      exclude: /(node_modules)/,
      loader: require.resolve('babel-loader'),
      options
    },
    config
  );

export default babel;
