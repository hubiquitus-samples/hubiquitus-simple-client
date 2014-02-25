'use strict';

describe('Service: hubiquitusManager', function () {

  // load the service's module
  beforeEach(module('simpleClientApp'));

  // instantiate service
  var hubiquitusManager;
  beforeEach(inject(function (_hubiquitusManager_) {
    hubiquitusManager = _hubiquitusManager_;
  }));

  it('should do something', function () {
    expect(!!hubiquitusManager).toBe(true);
  });

});
