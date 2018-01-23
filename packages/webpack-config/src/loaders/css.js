import loader from '../loader';

const css = options => config =>
  loader(
    {
      test: /\.css$/,
      use: [
        {
          loader: require.resolve('css-loader'),
          options
        }
      ]
    },
    config
  );

export default css;
