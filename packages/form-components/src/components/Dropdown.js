import React from 'react';
import cx from 'classnames';
import Overlay from '@nemea/overlay-component';
import Searcher from '@nemea/searcher-component';
import FormComponent from 'lib/decorators/FormComponent';
import throttle from '@nemea/utils/lib/decorators/throttle.js';
import ReactDOM from 'react-dom';
import i18n from '@nemea/i18n-lib';

import _find from 'lodash/find';
import _first from 'lodash/head';
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import _isNull from 'lodash/isNull';
import _isEmpty from 'lodash/isEmpty';
import _contains from 'lodash/includes';
import _difference from 'lodash/difference';
import _startsWith from 'lodash/startsWith';

class DropdownComponent extends React.Component {

  static getFormComponentProps() {
    return {
      wrapAround: this.props.wrapAround || false,
      initialOnChange: false
    };
  }

  static propTypes = {
    groupTpl: React.PropTypes.node,
    disabled: React.PropTypes.bool,
    optionTpl: React.PropTypes.any,
    options: React.PropTypes.array,
    placeholder: React.PropTypes.bool,
    placeholderText: React.PropTypes.string,
    searchable: React.PropTypes.bool,
    customSearchProperty: React.PropTypes.string,
    overlay: React.PropTypes.bool,
    value: React.PropTypes.any
  }

  static defaultProps = {
    searchable: false,
    disabled: false,
    placeholder: true,
    placeholderText: i18n('selectAnOption'),
    overlay: false,
    tabbable: true
  }

  state = {
    cursorValue: this.props.value || '',
    isOpen: false,
    excluded: []
  }

  componentWillMount() {
    this.init(this.props);
  }

  componentDidMount() {
    document.addEventListener('touchend', this.handleDocumentClick, false);

    document.addEventListener('click', this.handleDocumentClick, false);

    document.addEventListener('keydown', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('touchend', this.handleDocumentClick, false);
    document.removeEventListener('click', this.handleDocumentClick, false);

    document.removeEventListener('keydown', this.handleKeyUp);
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps);

    var hasPropsChanged = !_find(this._options, { value: nextProps.value });

    if (hasPropsChanged) {
      this.updateValue(_first(this._options).value);
    }

    var onValueChange = nextProps.value !== this.state.value;

    if (onValueChange) {

      this.setState({
        value: nextProps.value,
        cursorValue: nextProps.value
      }, () => {

        var cursorIdx = this.getCursorIdx();

        this.setState({
          selectedIdx: cursorIdx
        });
      });

    }
  }

  componentDidUpdate() {
    this.scrollToCursor();
  }

  @autobind
  handleKeyUp(e) {
    // Escape key
    if (e.keyCode === 27) {
      e.preventDefault();
      this.setState({
        isOpen: false
      });
    }

    if ((!this.state.isOpen && !this.state.isFocused) || this.props.searchable || !this.props.tabbable) {
      return;
    }

    // Up key
    if (e.keyCode === 38) {
      e.preventDefault();
      this.selectPrev();
    }

    // Down key
    if (e.keyCode === 40) {
      e.preventDefault();
      this.selectNext();
    }

    // Enter key
    if (e.keyCode === 13) {
      e.preventDefault();
      this.selectCurrentItem();
    }
  }

  getCursorIdx() {
    return _findIndex(this.props.options, (option) => {
      return option.value === this.state.cursorValue;
    });
  }

  scrollToCursor() {
    var cursor = this.refs.cursor;
    var results = this.refs.results;

    if (!cursor || !results) {
      return;
    }

    var isInside = results.scrollTop < cursor.offsetTop && results.scrollTop + results.clientHeight > cursor.offsetTop + cursor.clientHeight;

    if (!isInside) {
      results.scrollTop = cursor.offsetTop - results.clientHeight + cursor.clientHeight;
    }
  }

  selectPrev() {
    var cursorIdx = this.getCursorIdx();

    var newSelectedIdx = cursorIdx - 1;

    if (newSelectedIdx < 0) {
      newSelectedIdx = this.props.options.length - 1;
    }

    var cursorValue = _get(this.props.options[newSelectedIdx], 'value');

    this.setState({
      selectedIdx: newSelectedIdx,
      isOpen: true,
      cursorValue
    }, () => this.scrollToCursor());
  }

  selectNext() {
    var cursorIdx = this.getCursorIdx();

    var newSelectedIdx = cursorIdx + 1;

    if (newSelectedIdx >= this.props.options.length) {
      newSelectedIdx = 0;
    }

    var cursorValue = _get(this.props.options[newSelectedIdx], 'value');

    this.setState({
      selectedIdx: newSelectedIdx,
      isOpen: true,
      cursorValue
    }, () => this.scrollToCursor());
  }

  selectCurrentItem() {
    this.updateValue.call(this, this.state.cursorValue);
  }

  getDefaultValue() {
    return this.props.value || '';
  }

  init(props) {
    this._options = props.options;

    if (props.placeholder) {
      this._options = [{ label: props.placeholderText, value: '' }].concat(this._options);
    }
  }

  @autobind
  handleDocumentClick(event) {
    if (this.state.isOpen && !ReactDOM.findDOMNode(this).contains(event.target)) {
      this.setState({isOpen:false});
    }
  }

  optionTypesMap = {
    group(group) {
      var optionTpl = this.props.optionTpl;

      var _options = group.options.map((option) => this.renderOption(option, optionTpl));

      var groupClass = cx({
        'dropdown-wrapper__group-title': true
      }, group.cssClass);

      var groupTitle = <div className="title">{group.label}</div>;

      if (!_isNull(this.props.groupTpl)) {

        groupTitle = React.createElement(this.props.groupTpl, group);
      }

      return (
        <div className="dropdown-wrapper__group" key={group.value}>
          <div className={groupClass}>{groupTitle}</div>
          <div className="dropdown-wrapper__group-options">{_options}</div>
        </div>
      );

    },
    option(option) {

      return this.renderOption(option, this.props.optionTpl);

    }
  }

  renderOption(option, optionComponent) {
    var isCursor = !this.props.searchable && option.value === this.state.cursorValue;

    var optionClass = cx({
      'dropdown-wrapper__option': true,
      'dropdown-wrapper__option--selected': option.value === this.props.value,
      'dropdown-wrapper__option--cursor': isCursor
    }, option.cssClass);

    var value = option.value;

    var label = option.label;

    var boundSetValue = this.updateValue.bind(this, option.value);

    if (optionComponent) {
      label = React.createElement(optionComponent, option.label);
    }

    return <div key={value} ref={isCursor ? 'cursor' : null} className={optionClass} onMouseDown={boundSetValue} onClick={boundSetValue}>{label}</div>;
  }

  buildResults() {
    var self = this;

    var options = this._options.map((option) => {

      if (option.value === '' || _find(this.state.excluded, { value: option.value })) {
        return;
      }

      var type = 'option';

      if (_contains(self.optionTypesMap, option.type)) {
        type = option.type;
      }

      return self.optionTypesMap[type].apply(self, [option]);

    });

    return _isEmpty(_difference(this._options, this.state.excluded)) ? <div className="dropdown-wrapper--no-results">{i18n('noResults')}</div> : options;
  }

  getLabel(value) {
    var selectedOption = _find(this._options, (option) => option.value === value);

    var label = {};

    if (selectedOption && selectedOption.label) {
      label = selectedOption.label;
    }

    return label;
  }

  getSelectedLabel() {
    return this.getLabel(this.props.value);
  }

  @throttle(50)
  @autobind
  filterResults(value) {
    if (value === null) {

      this.setState({
        excluded: []
      });

      return;

    }

    this.setState({
      excluded: this.getExcludedResults(value)
    });
  }

  getExcludedResults(value) {
    var isCustomMode = this.props.optionTpl && this.props.customSearchProperty;

    return this._options.filter((option) => {
      var comparator = isCustomMode ? option.label[this.props.customSearchProperty] : option.label;

      return !_startsWith(comparator.toLowerCase(), value.toLowerCase());
    });
  }

  reset() {
    var value = this.props.value || '';

    this.setState({
      value,
      isOpen: false,
      excluded: []
    });
  }

  updateValue(value) {
    this.props.onChange(value);

    this.setState({
      cursorValue: value,
      isOpen: false
    });
  }

  @autobind
  onClick() {
    if (this.props.disabled || this.justFocused) {
      return;
    }

    this.setState({
      isOpen: !this.state.isOpen,
      excluded: []
    });
  }

  @autobind
  onFocus() {
    this.justFocused = true;

    if (this.props.disabled) {
      return;
    }

    this.setState({
      isOpen: true,
      isFocused: true,
      excluded: []
    });

    setTimeout(() => {
      this.justFocused = false;
    }, 300);
  }

  @autobind
  onBlur() {
    this.setState({
      isFocused: false,
      isOpen: false
    });
  }

  getDropdownResultsClass = () => cx({
    'dropdown-wrapper__results--searchable': this.props.searchable
  }, 'dropdown-wrapper__results-wrapper', 'animated', 'fadeIn')

  render() {
    var selectedLabel = this.getSelectedLabel();

    var selected = this.props.optionTpl ? React.createElement(this.props.optionTpl, selectedLabel) : selectedLabel;

    var searcher = this.props.searchable ? <Searcher className="dropdown-wrapper__searcher" onChange={this.filterResults}/> : null;

    var results = this.state.isOpen ? <div className={this.getDropdownResultsClass()}>{searcher}<div ref="results" className="dropdown-wrapper__results">{this.buildResults()}</div></div> : null;

    var overlay = this.state.isOpen && this.props.overlay ? <Overlay overlayClass="dropdown-wrapper__overlay" /> : null;

    var dropdownClass = cx('dropdown-wrapper', {
      'dropdown-wrapper--open': this.state.isOpen,
      'dropdown-wrapper--disabled': this.props.disabled
    }, this.props.className);

    return (
      <div className={dropdownClass}>
        {overlay}
        <div className="dropdown-wrapper__selection" tabIndex={!this.props.tabbable && this.state.isFocused ? '-1' : '0'} onBlur={this.onBlur} onFocus={this.onFocus} onClick={this.onClick}>
          <div className="clearfix">
            <div className="dropdown-wrapper__selection-rendered">
              {selected}
            </div>
            <span className="dropdown-wrapper__selection-arrow"></span>
          </div>
          {results}
        </div>
      </div>
    );
  }
}

export default FormComponent(DropdownComponent);

export { DropdownComponent as RawDropdown };
