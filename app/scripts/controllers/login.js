'use strict';

angular.module('citizendeskFrontendApp')
  .controller('LoginCtrl', function ($scope, $modal, auth, $location, session) {
    $scope.modal = $modal({
      template: 'views/modals/login.html',
      show: false,
      scope: $scope
    });
    $scope.error = {};
    $scope.submit = function() {
      auth.login($scope.username, $scope.password)
        .catch(function() {
          $scope.error.service = true;
        });
    };
    $scope.$watch(function() {
      return session.token;
    }, function(token) {
      $scope.identity = session.identity;
      $scope.username = session.identity ? session.identity.UserName : null;
      $scope.password = null;
      if (!token) {
        $scope.modal.show();
      } else {
        if ($scope.$isShown) {
          $scope.modal.hide();
        }
      }      
    });
  });
