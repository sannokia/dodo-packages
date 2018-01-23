import DashboardPlugin from 'webpack-dashboard/plugin';
import plugin from '../plugin';

const dashboard = config => plugin(new DashboardPlugin(), config);

export default dashboard;
