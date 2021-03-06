'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('MobileQueueCtrl', function ($scope, api, QueueSelection, PageBroker, AliasesInLists, reportStatuses, Report, lodash) {
    QueueSelection.description = 'Reports coming from mobile phones';
    $scope.reports = [];
    $scope.loading = true;
    $scope.disabled = {};
    $scope.assign = function(report) {
      PageBroker.load('/assign/', {
        report: report
      });
    };
    $scope.dismiss = Report.getDismiss($scope.disabled, function(report) {
      lodash.remove($scope.reports, function(candidate) {
        return candidate._id === report._id;
      });
    });
    function fetch(page) {
      api.reports
        .query({
          where: JSON.stringify({
            $and: [
              {feed_type: 'sms'},
              {local: {$ne: true}},
              {automatic: {$ne: true}},
              {status: reportStatuses('')},
              {assignments: {$size: 0}}
            ]
          }),
          sort: '[("produced", -1)]',
          page: page
        })
        .then(function(response) {
          response._items.forEach(function(report){
            AliasesInLists.embedAuthorAlias(report);
          });
          $scope.reports = $scope.reports.concat(response._items);
          if (response._links.next) {
            fetch(page + 1);
          }
          $scope.loading = false;
        });
    }
    fetch(1);
  });
