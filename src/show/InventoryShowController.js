'use strict';

var InventoryShowController = function($controller, $routeParams,
  $scope, $q, Inventory, Dataset, Project, Publication, npdcAppConfig) {
    'ngInject';

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = Inventory;


  let uri = (inventory) => {
    let link = inventory.links.find(l => {
      return l.rel === "alternate" && (/html$/).test(l.type);
    });
    if (link) {
      return link.href.replace(/^http:/, "https:");
    } else {
      return `https://data.npolar.no/inventory/${ inventory.id }`;
    }
  };



  //Show map in Antarctica
  $scope.mapOptions = {};
  $scope.mapOptions.initcoord = [-72.011389, 2.535];

  let show = function() {
    $scope.show().$promise.then((inventory) => {
          $scope.document.category = convert($scope.document.category);

    let bounds = [];
    if (inventory.locations) {

         bounds = (inventory.locations).map((locations) => [[locations.south, locations.west], [locations.north, locations.east]]);

    }

    $scope.mapOptions.coverage =  bounds;
    $scope.mapOptions.geojson = "geojson";


      if ($scope.document.contamination) {
      for(var i=0; i<($scope.document.contamination).length; i++){
        $scope.document.contamination[i].type = convert($scope.document.contamination[i].type);
        $scope.document.contamination[i].priority = convert($scope.document.contamination[i].priority);
        $scope.document.contamination[i].impact_likelihood = convert($scope.document.contamination[i].impact_likelihood);
        $scope.document.contamination[i].impact_spatial = convert($scope.document.contamination[i].impact_spatial);
        $scope.document.contamination[i].impact_temporal = convert($scope.document.contamination[i].impact_temporal);
      }
    }
     if ($scope.document.fuel) {
      for(var j=0; j<($scope.document.fuel).length; j++){
         $scope.document.fuel[j].fuel_tank = convert($scope.document.fuel[j].fuel_tank);
      }
    }


      // or in files
      $scope.alternate = inventory.links.filter(l => ((l.rel === "alternate" && l.type !== "text/html") || l.rel === "edit")).concat({
        href: `http://api.npolar.no/inventory/?q=&filter-id=${inventory.id}&format=json&variant=ld`,
        title: "DCAT (JSON-LD)",
        type: "application/ld+json"
      });


     //link to show
     $scope.uri = uri(inventory);


      let relatedDatasets = Dataset.array({
        q: inventory.title,
        fields: 'id,title,collection',
        score: true,
        limit: 5,
        'not-id': inventory.id,
        op: 'OR'
      }).$promise;
      let relatedPublications = Publication.array({
        q: inventory.title,
        fields: 'id,title,published_sort,collection',
        score: true,
        limit: 5,
        op: 'OR'
      }).$promise;
      let relatedProjects = Project.array({
        q: inventory.title,
        fields: 'id,title,collection',
        score: true,
        limit: 5,
        op: 'OR'
      }).$promise;

      $q.all([relatedDatasets, relatedPublications, relatedProjects]).then(related => {
        $scope.related = related;
      });

    });

  };


  show();

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

module.exports = InventoryShowController;
