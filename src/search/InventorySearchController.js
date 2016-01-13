'use strict';
/**
 * @ngInject
 */
var InventorySearchController = function ($scope, $location, $controller, Inventory, npdcAppConfig) {

  $controller('NpolarBaseController', { $scope: $scope });
  $scope.resource = Inventory;

 /* npdcAppConfig.search.local.results.detail = function (entry) {
    return "Released: " + (entry.released ? entry.released.split('T')[0] : '-');
  }; */

  npdcAppConfig.search.local.results.detail = function (entry) {
    return entry.category + ' - ' + entry.description;
  };


  npdcAppConfig.cardTitle = "Inventory Archive";
  npdcAppConfig.search.local.results.subtitle = "type";


  let query = function() {
    let defaults = { limit: "all", sort: "-updated", fields: 'id,category,instrument,description',
      'date-year': 'release_date', facets: 'category,instrument' };
    let invariants = $scope.security.isAuthenticated() ? {} : {} ;
    return Object.assign({}, defaults, invariants);
  };

  $scope.search(query());

  $scope.$on('$locationChangeSuccess', (event, data) => {
    $scope.search(query());
  });

};

module.exports = InventorySearchController;
