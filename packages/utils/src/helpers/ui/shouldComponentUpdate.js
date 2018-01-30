import shallowEqual from '../shallowEqual';

var shouldPureComponentUpdate = function(nextProps, nextState) {
  return (
    !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state)
  );
};

export default shouldPureComponentUpdate;
