import loader from '../loader';

const style = options => config =>
  loader(
    {
      test: /\.css$/,
      use: [
        {
          loader: require.resolve('style-loader'),
          options
        }
      ]
    },
    config
  );

export default style;
