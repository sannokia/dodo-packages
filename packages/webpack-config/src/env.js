import compose from 'lodash/fp/compose';
import curry from 'lodash/curry';

const env = curry((key, partials) => {
  let NODE_ENV = process.env.NODE_ENV;

  return NODE_ENV === key ? () => compose(...partials) : () => config => config;
});

export default env;
