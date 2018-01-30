import shallowEqualCompareArrays from '../shallowEqualCompareArrays';

var shouldPureComponentUpdate = function(nextProps, nextState) {
  return (
    !shallowEqualCompareArrays(nextProps, this.props) ||
    !shallowEqualCompareArrays(nextState, this.state)
  );
};

export default shouldPureComponentUpdate;
