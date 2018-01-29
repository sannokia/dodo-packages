import { jsdom } from 'jsdom';
import chai from 'chai';
import sinon from 'sinon';

var setup = function(root) {

  root.document = jsdom('<html><head></head><body></body></html>');
  root.window = document.defaultView;

  root.Element = root.window.Element;
  root.Node = root.window.Node;

  root.chai = chai;
  root.sinon = sinon;
  root.navigator = window.navigator = {
    userAgent: 'Node JSDom',
    appVersion: ''
  };

  root.TestParent = require('@nemea/test-parent');
  root.TestUtils = require('react-addons-test-utils');
  root.ReactDOM = require('react-dom');
  root.React = require('react');

  root.__TEST__ = true;

  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  return root;
};

export default setup;
