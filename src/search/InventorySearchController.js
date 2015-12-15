'use strict';
/**
 * @ngInject
 */
var InventorySearchController = function ($scope, $location, $controller, Inventory, npdcAppConfig) {

  $controller('NpolarBaseController', { $scope: $scope });
  $scope.resource = Inventory;

  npdcAppConfig.search.local.results.detail = (e) => {
    return "Activity start: " + e.activity[0].departed.split('T')[0];
   };

  npdcAppConfig.cardTitle = "Inventory Archive";
  npdcAppConfig.search.local.results.subtitle = "type";
  npdcAppConfig.search.local.filterUi = {
    'year-activity.departed': {
      type: 'range'
    },
    'updated': {
      type: 'hidden'
    }
  };

  let query = function() {
    let defaults = { limit: "all", sort: "-updated", fields: 'code,id,updated,type,activity.departed',
      'date-year': 'activity.departed', facets: 'tags,people.email,updated,locations.area' };
    let invariants = $scope.security.isAuthenticated() ? {} : {} ;
    return Object.assign({}, defaults, invariants);
  };

  $scope.search(query());

  $scope.$on('$locationChangeSuccess', (event, data) => {
    $scope.search(query());
  });

};

module.exports = InventorySearchController;
