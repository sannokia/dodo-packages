import loader from '../loader';

const url = options => config =>
  loader(
    {
      loader: require.resolve('url-loader'),
      options
    },
    config
  );

export default url;
