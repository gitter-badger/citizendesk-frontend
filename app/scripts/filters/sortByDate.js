'use strict';

angular.module('citizendeskFrontendApp')
  .filter('sortByDate', function (lodash, parseDate) {
    return function (input, prop, newest) {
      if (input) {
        var result = angular.copy(input);
        result.sort(function(a, b) {
          if (newest) {
            return parseDate(b[prop]) - parseDate(a[prop]);
          } else {
            return parseDate(a[prop]) - parseDate(b[prop]);
          }
        });
        return result;
      } else {
        return [];
      }
    };
  });
