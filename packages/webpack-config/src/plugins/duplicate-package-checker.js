import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import plugin from '../plugin';

const duplicatePackageChecker = (options, config) =>
  plugin(new DuplicatePackageCheckerPlugin(options), config);

export default duplicatePackageChecker;
