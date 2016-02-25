'use strict';
/**
 *
 *
 * @ngInject
 */
var InventoryShowController = function ($scope, $q, $routeParams, $controller, Inventory, npdcAppConfig) {

  $controller('NpolarBaseController', {$scope: $scope});
  $scope.resource = Inventory;

  console.log($scope.resource);
  $scope.show();


};

module.exports = InventoryShowController;
