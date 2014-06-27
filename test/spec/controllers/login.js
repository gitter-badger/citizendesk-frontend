'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var LoginCtrl,
      scope,
      watchExpression,
      watchListener;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    spyOn(scope, '$watch').andCallFake(function(expression, listener) {
      watchExpression = expression;
      watchListener = listener;
    });
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('shows the modal if the token is missing', function() {
    spyOn(scope.modal, 'show');
    watchListener(null);
    expect(scope.modal.show).toHaveBeenCalled();
  });
});
