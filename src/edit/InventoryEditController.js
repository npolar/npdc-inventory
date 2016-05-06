'use strict';

var InventoryEditController = function($scope, $controller, $routeParams, Inventory, formula, formulaAutoCompleteService, npdcAppConfig,
  chronopicService, fileFunnelService, NpolarLang, npolarApiConfig, NpolarApiSecurity, NpolarMessage, npolarCountryService) {
  'ngInject';

  // EditController -> NpolarEditController
  $controller('NpolarEditController', {
    $scope: $scope
  });

  // Inventory -> npolarApiResource -> ngResource
  $scope.resource = Inventory;

  let templates = [{
      match: "people_item",
      template: '<npdc:formula-person></npdc:formula-person>'
    }, {
      match: "placenames_item",
      template: '<npdc:formula-placename></npdc:formula-placename>'
    },
    {
      match: "coverage_item",
      template: "<inventory:coverage></inventory:coverage>"
    }
  ];

  let i18n = [{
      map: require('./en.json'),
      code: 'en'
    },
    {
      map: require('./no.json'),
      code: 'nb_NO',
    }];

   $scope.formula = formula.getInstance({
     schema: '//api.npolar.no/schema/inventory',
     form: 'edit/formula.json',
     language: NpolarLang.getLang(),
     templates:  npdcAppConfig.formula.templates.concat(templates),
     languages: npdcAppConfig.formula.languages.concat(i18n)
   });



  formulaAutoCompleteService.autocompleteFacets(['organisations.name','people.first_name', 'people.last_name', 'locations.placename'], Inventory, $scope.formula);

  chronopicService.defineOptions({ match: 'released', format: '{date}'});
  chronopicService.defineOptions({ match(field) {
    return field.path.match(/^#\/activity\/\d+\/.+/);
  }, format: '{date}'});


    function initFileUpload(formula) {

    let server = `${NpolarApiSecurity.canonicalUri($scope.resource.path)}/:id/_file`;
    fileFunnelService.fileUploader({
      match(field) {
        return field.id === "files";
      },
      server,
      multiple: true,
      progress: false,
      restricted: function () {
        return !formula.getModel().license;
      },
      fileToValueMapper: Inventory.fileObject,
      valueToFileMapper: Inventory.hashiObject,
      fields: [] // 'type', 'hash'
    }, formula);
  }


  try {
    initFileUpload($scope.formula);
    // edit (or new) action
    $scope.edit();
  } catch (e) {
    NpolarMessage.error(e);
  }
};


module.exports = InventoryEditController;
