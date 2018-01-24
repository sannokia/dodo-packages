import loader from '../loader';

const url = options => config =>
  loader(
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options
    },
    config
  );

export default url;
