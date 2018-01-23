import loader from '../loader';

const postCSS = (options = {}) => config =>
  loader(
    {
      test: /\.css$/,
      use: [
        {
          loader: require.resolve('postcss-loader'),
          options
        }
      ]
    },
    config
  );

export default postCSS;
