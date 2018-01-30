var jsdom = require('jsdom');
var chai = require('chai');
var sinon = require('sinon');

const { JSDOM } = jsdom;

const navigator = {
  userAgent: 'Node JSDom'
};

var setup = function(root) {
  const { document } = new JSDOM(
    '<html><head></head><body></body></html>',
    navigator
  ).window;
  root.document = document;
  root.window = document.defaultView;

  root.Element = root.window.Element;
  root.Node = root.window.Node;

  root.chai = chai;
  root.sinon = sinon;
  root.navigator = navigator;

  root.TestParent = require('@dodo/react-test-parent');
  root.TestUtils = require('react-dom/test-utils');
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
