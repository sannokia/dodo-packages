import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

import './storybook.css';

setOptions({
  name: require(`${__dirname}/../../../../package.json`).name
});

const loadStories = () => {
  require(`${__dirname}/../../../../src/stories`);
};

configure(loadStories, module);
