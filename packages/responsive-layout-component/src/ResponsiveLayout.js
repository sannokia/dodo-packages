import React from 'react';
import shouldPureComponentUpdate from '@dodo/utils/lib/helpers/ui/shouldComponentUpdate';

import media from './media';

class ResponsiveLayout extends React.Component {
  static propTypes = {
    mobileLayout: React.PropTypes.any,
    desktopLayout: React.PropTypes.any,
    tabletLayout: React.PropTypes.any
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);

    this.updateActive = this.updateActive.bind(this);

    this.state = {
      active: media.active
    };
  }

  componentWillMount() {
    media.on('active', this.updateActive);
  }

  updateActive(active) {
    this.setState({
      active
    });
  }

  componentWillUnmount() {
    media.off('active', this.updateActive);
  }

  render() {
    if (process.env.TEST_MODE) {
      return (
        <div className={this.props.className}>
          {typeof this.props.desktopLayout === 'function'
            ? this.props.desktopLayout()
            : this.props.desktopLayout}
        </div>
      );
    }

    var activeComponent;

    switch (this.state.active) {
      case 'MOBILE':
      case 'TABLET_PORTRAIT':
        activeComponent = this.props.mobileLayout;
        break;
      case 'TABLET_LANDSCAPE':
        activeComponent =
          typeof this.props.tabletLayout === 'undefined'
            ? this.props.desktopLayout
            : this.props.tabletLayout;
        break;
      default:
        activeComponent = this.props.desktopLayout;
    }

    if (typeof activeComponent === 'function') {
      activeComponent = activeComponent();
    }

    return <div className={this.props.className}>{activeComponent}</div>;
  }
}

export default ResponsiveLayout;
