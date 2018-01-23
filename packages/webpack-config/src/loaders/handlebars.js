import loader from '../loader';

const handlebars = options => config =>
  loader(
    {
      test: /\.hbs$/,
      loader: require.resolve('handlebars-loader'),
      options
    },
    config
  );

export default handlebars;
