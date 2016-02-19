'use strict';

var InventoryEditController = function($scope, $controller, $routeParams, Inventory, formula,
  formulaAutoCompleteService, npdcAppConfig, chronopicService) {
  'ngInject';

  // EditController -> NpolarEditController
  $controller('NpolarEditController', {
    $scope: $scope
  });

  // Inventory -> npolarApiResource -> ngResource
  $scope.resource = Inventory;

  let formulaOptions = {
    schema: '//api.npolar.no/schema/inventory',
    form: 'edit/formula.json',
    templates: npdcAppConfig.formula.templates.concat([{
      match(field) {
        return ["alternate", "edit", "via"].includes(field.value.rel);
      },
      hidden: true
    } ]),
    languages: npdcAppConfig.formula.languages
  };

  $scope.formula = formula.getInstance(formulaOptions);
  $scope.formula.i18n.add(require('./translation.json'), 'en');

 // formulaAutoCompleteService.autocompleteFacets(['organisations.name', 'organisations.email',
 //   'organisations.homepage', 'organisations.gcmd_short_name', 'links.type', 'sets', 'tags'], TrollBooking, $scope.formula);

  chronopicService.defineOptions({ match: 'released', format: '{date}'});
  chronopicService.defineOptions({ match(field) {
    return field.path.match(/^#\/activity\/\d+\/.+/);
  }, format: '{date}'});


  $scope.edit();
};

module.exports = InventoryEditController;
