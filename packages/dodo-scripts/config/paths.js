const path = require('path');
const fs = require('fs-extra');
const url = require('url');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

// we're in ./node_modules/@dodo/dodo-scripts/config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appErrors: resolveApp('errors'),
  appLogs: resolveApp('logs'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
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
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  resolveApp,
  resolveOwn
};
