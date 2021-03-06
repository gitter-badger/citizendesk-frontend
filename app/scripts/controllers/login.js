'use strict';

angular.module('citizendeskFrontendApp')
  .controller('LoginCtrl', function ($scope, $modal, auth, $location, session, $window, $http) {
    $scope.$watch(function() {
      return session.token;
    }, function(token) {
      $scope.identity = session.identity;
      $scope.username = session.identity ? session.identity.username : null;
      $scope.password = null;
      if (!token) {
        $scope.modal = $modal.open({
          templateUrl: 'views/modals/login.html',
          keyboard: false, // do not close when user press `Esc`
          backdrop: 'static'
        });
      }
    });
    $scope.logout = function() {

      function clear() {
        session.clear();
      }

      var sessionHref = session.getSessionHref();
      if (sessionHref) {
        $http['delete'](sessionHref).then(clear, clear);
      } else {
        clear();
      }
    };
  });
