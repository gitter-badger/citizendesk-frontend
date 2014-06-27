'use strict';

angular.module('citizendeskFrontendApp')
  .controller('LoginModalCtrl', function ($scope, auth) {
    $scope.error = {};
    $scope.submit = function() {
      auth.login($scope.username, $scope.password)
        .then(function() {
          $scope.$hide();
        })
        .catch(function() {
          $scope.error.service = true;
        });
    };
  });
