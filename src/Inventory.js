'use strict';

function Inventory( $q, InventoryResource) {
  'ngInject';

//  const schema = 'http://api.npolar.no/schema/inventory';

//  InventoryResource.schema = schema;

  InventoryResource.create = function() {

      let lang = 'en';
      let collection = "inventory";
      let schema = 'http://api.npolar.no/schema/inventory';

      let e = {  lang, collection, schema };
      console.debug(e);

      return e;

    };



  return InventoryResource;



}
module.exports = Inventory;