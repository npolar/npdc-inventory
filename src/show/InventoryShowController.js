'use strict';

var InventoryShowController = function($controller, $routeParams,
  $scope, $q, Inventory, Dataset, Project, Publication, npdcAppConfig) {
    'ngInject';

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = Inventory;

  let authors = (inventory) => {

    var folks = [];
    var orgs = [];

    if (inventory.people instanceof Array) {
      folks = inventory.people.filter(p => p.roles.includes("author"));
    }

    if (folks.length === 0 && inventory.organisations instanceof Array) {
      orgs = inventory.organisations.filter(o => o.roles.includes("author"));
    }
    return folks.concat(orgs);

  };


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



  let show = function() {
    $scope.show().$promise.then((inventory) => {


      $scope.links = inventory.links.filter(l => (l.rel !== "alternate" && l.rel !== "edit") && l.rel !== "data");


      $scope.data = inventory.links.filter(l => l.rel === "data");
      //var cat = $scope.document.category;
      $scope.document.category = convert($scope.document.category);
      console.log($scope.document.contamination);
       console.log($scope.document.contamination.length);
      for(var i=0; i<($scope.document.contamination).length; i++){
        $scope.document.contamination[i].type = convert($scope.document.contamination[i].type);
        $scope.document.contamination[i].priority = convert($scope.document.contamination[i].priority);
        $scope.document.contamination[i].impact_likelihood = convert($scope.document.contamination[i].impact_likelihood);
        $scope.document.contamination[i].impact_spatial = convert($scope.document.contamination[i].impact_spatial);
        $scope.document.contamination[i].impact_temporal = convert($scope.document.contamination[i].impact_temporal);
      }
      for(var j=0; j<($scope.document.fuel).length; j++){
         $scope.document.fuel[j].fuel_tank = convert($scope.document.fuel[j].fuel_tank);
      }

      $scope.images = inventory.links.filter(l => {
        return (/^image\/.*/).test(l.type);
      });
      // or in files

      $scope.alternate = inventory.links.filter(l => ((l.rel === "alternate" && l.type !== "text/html") || l.rel === "edit")).concat({
        href: `http://api.npolar.no/inventory/?q=&filter-id=${inventory.id}&format=json&variant=ld`,
        title: "DCAT (JSON-LD)",
        type: "application/ld+json"
      });


      $scope.authors = authors(inventory).map(a => {
        if (!a.name && a.first_name) {
          a.name = `${a.first_name} ${a.last_name}`;
        }
        return a;
      });


      $scope.uri = uri(inventory);

      let relatedDatasets = Dataset.array({
        q: Inventory.title,
        fields: 'id,title,collection',
        score: true,
        limit: 5,
        'not-id': Inventory.id,
        op: 'OR'
      }).$promise;
      let relatedPublications = Publication.array({
        q: Inventory.title,
        fields: 'id,title,published_sort,collection',
        score: true,
        limit: 5,
        op: 'OR'
      }).$promise;
      let relatedProjects = Project.array({
        q: Inventory.title,
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

