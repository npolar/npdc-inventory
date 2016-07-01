'use strict';
/**
 * @ngInject
 */
var InventorySearchController = function ($filter, $scope, $location, $controller, Inventory, npdcAppConfig, NpolarTranslate) {

  $controller('NpolarBaseController', { $scope: $scope });
  $scope.resource = Inventory;


  //Search subtitles
  npdcAppConfig.search.local.results.detail = function (entry) {
    let categoryText = NpolarTranslate.translate(entry.category);
    let lastupdateText = NpolarTranslate.translate('Last updated');
    let r = convert(categoryText) + " - " + lastupdateText + ":";
    return  r+` ${$filter('date')(entry.updated, 'd-M-yyyy')}`;
  };


  npdcAppConfig.cardTitle = "Inventory Archive";
  npdcAppConfig.search.local.results.subtitle = "type";


  let query = function() {
    let defaults = { limit: "all", sort: "-updated", fields: 'title,id,category,instrument,description,updated',
      'date-year': 'release_date', facets: 'category,instrument' };
    let invariants = $scope.security.isAuthenticated() ? {} : {"not-draft": "yes"} ;
    return Object.assign({}, defaults, invariants);
  };

  $scope.search(query());

  $scope.$on('$locationChangeSuccess', (event, data) => {
    $scope.search(query());
  });

};

/* convert from camelCase to lower case text*/
function convert(str) {
       var  positions = '';

       for(var i=0; i<(str).length; i++){
           if(str[i].match(/[A-Z]/) !== null){
             positions += " ";
             positions += str[i].toLowerCase();
        } else {
            positions += str[i];
        }
      }
        return positions;
       }

module.exports = InventorySearchController;
