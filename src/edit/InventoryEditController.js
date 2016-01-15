'use strict';

/**
 * @ngInject
 */
var InventoryEditController = function ($scope, $controller, $routeParams, Inventory) {

  // EditController -> NpolarEditController
  $controller('NpolarEditController', { $scope: $scope });

  // Expedition -> npolarApiResource -> ngResource
  $scope.resource = Inventory;

  // Formula ($scope.formula is set by parent)
  $scope.formula.schema = '//api.npolar.no/schema/inventory';
  $scope.formula.form = 'edit/formula.json';
  $scope.formula.language = 'edit/translation.json';
  $scope.formula.template = 'material';

  // edit (or new) action
  $scope.edit();

};

module.exports = InventoryEditController;
