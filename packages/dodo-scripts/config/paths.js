const path = require('path');
const fs = require('fs-extra');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// we're in ./node_modules/react-scripts/config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appErrors: resolveApp('errors'),
  appLogs: resolveApp('logs'),
  appPublic: resolveApp('public'),
  appMainJs: resolveApp('src/scripts/main.js'),
  appIndexJs: resolveApp('src/scripts/app.entry.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appScripts: resolveApp('src/scripts'),
  appStyles: resolveApp('src/styles'),
  yarnLockFile: resolveApp('yarn.lock'),
  appTestJs: resolveApp('test/index.test'),
  appPackages: resolveApp('packages'),
  appNodeModules: resolveApp('node_modules'),
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3,
  servedPath: '/dist/',
  resolveApp,
  resolveOwn
};
