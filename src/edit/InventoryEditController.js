'use strict';

var InventoryEditController = function($scope, $controller, $routeParams, $http, $timeout, Inventory, formula, formulaAutoCompleteService, npdcAppConfig,
  chronopicService, fileFunnelService, NpolarLang, npolarApiConfig, NpolarApiSecurity, NpolarMessage, npolarCountryService) {
  'ngInject';


  // Inventory -> npolarApiResource -> ngResource
  $scope.resource = Inventory;

   function isHiddenLink(rel) {
    if (rel.rel) {
      rel = rel.rel;
    }
    return ["alternate", "edit", "via"].includes(rel);
}

 function init() {

  // EditController -> NpolarEditController
  $controller('NpolarEditController', {
    $scope: $scope
  });

  let templates = [
    {match(field) {
          if (field.id === 'links_item') {

            // Hide data links and system links
            return isHiddenLink(field.value.rel);
          }
        },
        hidden: true

    },
    {
      match: "locations_item",
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


 /* formulaAutoCompleteService.autocomplete({
    match: "#/conference/country",
    querySource: npolarApiConfig.base + '/country',
    label: 'native',
    value: 'code'
  }, $scope.formula); */

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


  formulaAutoCompleteService.autocompleteFacets(['people.first_name', 'people.last_name', 'people.organisation','people.email','people.phone',
  'organisations.name','organisations.address','organisations.zip','organisations.city','organisations.href', 'locations.placename'], Inventory, $scope.formula);

  chronopicService.defineOptions({ match: 'released', format: '{date}'});
  chronopicService.defineOptions({ match(field) {
    return field.path.match(/^#\/activity\/\d+\/.+/);
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
    $scope.edit().$promise.then(inventory => {


        // Grab attachments and force update attachments and links
        let fileUri = `${NpolarApiSecurity.canonicalUri($scope.resource.path)}/${inventory.id}/_file`;

        $http.get(fileUri).then(r => {
          if (r && r.data && r.data.files && r.data.files.length > 0) {
            let inventory = $scope.formula.getModel();
            let files = r.data.files;

            let attachments = files.map(hashi => Inventory.attachmentObject(hashi));
            inventory.attachments = attachments;

            r.data.files.forEach(f => {
              let link = inventory.links.find(l => l.href === f.url);

              if (!link) {
                let license = inventory.licences[0] || Inventory.license;
                link = Inventory.linkObject(f, license);
                inventory.links.push(link);
              }
              // else findIndex & objhect.assign?
            });
            $scope.formula.setModel(inventory);
          }
        });

});

  } catch (e) {
    NpolarMessage.error(e);
  }
};


module.exports = InventoryEditController;
