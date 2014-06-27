'use strict';

angular.module('citizendeskFrontendApp')
  .controller('LoginCtrl', ['$scope', '$modal', function ($scope, $modal) {
    $scope.modal = $modal({
      template: 'views/modals/login.html',
      show: true
    });
  }]);
