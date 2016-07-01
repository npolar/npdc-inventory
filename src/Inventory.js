'use strict';

function Inventory( $q, InventoryResource) {
  'ngInject';

  const schema = 'http://api.npolar.no/schema/inventory';

  InventoryResource.schema = schema;

  InventoryResource.create = function() {

      console.log("got here");
      let hemisphere = "S";
      let lang = "en";
      let collection = "inventory";
      let schema = schema;


      let e = {  hemisphere, lang, collection, schema };
      console.log("got here 2");
      console.debug(e);
      return e;

    };

  return InventoryResource;



}
module.exports = Inventory;