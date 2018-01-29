var setup = require('../lib');
var root;

suite('React Test Setup', function() {

  suiteSetup('Setup globals', function() {
    root = setup(global);
  });

  test('#chai', function() {
    chai.assert.property(root, 'chai');
  });

  test('#sinon', function() {
    chai.assert.property(root, 'sinon');
  });

  test('#window', function() {
    chai.assert.property(root, 'window');
  });

  test('#document', function() {
    chai.assert.property(root, 'document');
  });

  test('#Element', function() {
    chai.assert.property(root, 'Element');
  });
  test('#Node', function() {
    chai.assert.property(root, 'Node');
  });
  test('#navigator', function() {
    chai.assert.property(root, 'navigator');
  });
  test('#TestParent', function() {
    chai.assert.property(root, 'TestParent');
  });
  test('#TestUtils', function() {
    chai.assert.property(root, 'TestUtils');
  });

  test('#React', function() {
    chai.assert.property(root, 'React');
  });

  test('#ReactDOM', function() {
    chai.assert.property(root, 'ReactDOM');
  });

});
