import ReducerRegistry from './ReducerRegistry';
import { configureStore, histoy } from './configureStore';

const reducerRegistry = new ReducerRegistry();
const store = configureStore.bind(this, reducerRegistry);

export {
  store,
  reducerRegistry,
  histoy
};

export default store;
