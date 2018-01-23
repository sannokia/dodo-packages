import DefinePlugin from 'webpack/lib/DefinePlugin';
import plugin from '../plugin';

const define = (options, config) =>
  plugin(
    new DefinePlugin(
      Object.assign(
        {},
        {
          'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            BABEL_ENV: JSON.stringify(process.env.BABEL_ENV)
          }
        },
        options
      )
    ),
    config
  );

export default define;
