'use strict';

var InventoryEditController = function($scope, $controller, $routeParams, Inventory, $http, $timeout, formula, formulaAutoCompleteService, npdcAppConfig,
  chronopicService, fileFunnelService, NpolarLang, npolarApiConfig, NpolarApiSecurity, NpolarMessage, npolarCountryService) {
  'ngInject';

 function init() {

// EditController -> NpolarEditController
  $controller('NpolarEditController', {
    $scope: $scope
  });

  // Inventory -> npolarApiResource -> ngResource
  $scope.resource = Inventory;

   let formulaOptions = {
      schema: '//api.npolar.no/schema/inventory',
      form: 'edit/formula.json',
      language: NpolarLang.getLang(),
      templates: npdcAppConfig.formula.templates.concat([{
        match(field) {
          if (field.id === 'links_item') {
            let match;

          // Hide data links and system links for the ordinary links block (defined in formula as instance === 'links')
            match = ["data", "alternate", "edit", "via"].includes(field.value.rel) && field.parents[field.parents.length-1].instance === 'links';
          //  console.log(match, field.id, field.path, 'value', field.value, 'instance', field.parents[field.parents.length-1].instance);
            return match;
          }
        },
        hidden: true
      },  {
        match: "locations_item",
        template: "<inventory:coverage></inventory:coverage>"
      },
    {
        match: "placenames_item",
        template: '<npdc:formula-placename></npdc:formula-placename>'
      },
      {
        match: "people_item",
        template: '<npdc:formula-person></npdc:formula-person>'
}
    ]),
      languages: npdcAppConfig.formula.languages.concat([{
        map: require('./en.json'),
        code: 'en'
      }, {
        map: require('./no.json'),
        code: 'nb_NO',
      }])
  };


  $scope.formula = formula.getInstance(formulaOptions);
  initFileUpload($scope.formula);


  formulaAutoCompleteService.autocomplete({
    match: "@country",
    querySource: npolarApiConfig.base + '/country',
    label: 'name',
    value: 'code'
  }, $scope.formula);

  formulaAutoCompleteService.autocomplete({
    match: "@instrument",
    querySource: npolarApiConfig.base + '/gcmd/concept/?q=&filter-version=8.0&filter-ancestors=Instruments',
    label: 'title',
    value: 'label'
  }, $scope.formula);




  formulaAutoCompleteService.autocompleteFacets(['organisations.name','organisations.address','organisations.zip','locations.placename','organisations.city','organisations.href'], Inventory, $scope.formula);

//Set chronopic view format (this does not change the internal value, i.e. ISO string date)
 chronopicService.defineOptions({ match(field) {
    return field.path.match(/_date$/);
 }, format: '{date}'});


}


    function initFileUpload(formula) {

    let server = `${NpolarApiSecurity.canonicalUri($scope.resource.path)}/:id/_file`;
    fileFunnelService.fileUploader({
      match(field) {
        return field.id === "files";
      },
      server,
      multiple: true,
       restricted: function () {
        return formula.getModel().restricted;
      },
   //   restricted: function () {
   //     return !formula.getModel().license;
   //   },
      fileToValueMapper: Inventory.fileObject,
      valueToFileMapper: Inventory.hashiObject,
      fields: [] // 'type', 'hash'
    }, formula);
  }

  try {
    init();
    // edit (or new) action
    $scope.edit();
  } catch (e) {
    NpolarMessage.error(e);
  }
};


module.exports = InventoryEditController;