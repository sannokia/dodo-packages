import {configure} from '@kadira/storybook'
import 'responsive-layout.scss'

function loadStories() {
  require('../stories/ResponsiveLayout')
}

configure(loadStories, module)
