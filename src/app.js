'use strict';
//var environment = require('../environment');
var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

var angular = require('angular');
require('npdc-common/src/wrappers/leaflet');

var npdcInventoryApp = angular.module('npdcInventoryApp', ['npdcCommon','leaflet']);

npdcInventoryApp.controller('InventoryShowController', require('./show/InventoryShowController'));
npdcInventoryApp.controller('InventorySearchController', require('./search/InventorySearchController'));
npdcInventoryApp.controller('InventoryEditController', require('./edit/InventoryEditController'));
npdcInventoryApp.directive('inventoryCoverage', require('./edit/coverage/coverageDirective'));
npdcInventoryApp.factory('Inventory', require('./Inventory.js'));


// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/', 'resource': 'NpolarApi'},
  {'path': '/user', 'resource': 'User'},
  {'path': '/dataset', 'resource': 'Dataset' },
  {'path': '/publication', 'resource': 'Publication' },
  {'path': '/project', 'resource': 'Project' },
  {'path': '/expedition', 'resource': 'Expedition'},
  {'path': '/inventory', 'resource': 'InventoryResource'}
];



resources.forEach(service => {
  // Expressive DI syntax is needed here
  npdcInventoryApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});


//npdcInventoryApp.factory('L', function() {
//  return window.L; // assumes Leaflet has already been loaded on the page
//});


// Routing
npdcInventoryApp.config(require('./router'));


npdcInventoryApp.config(($httpProvider, npolarApiConfig) => {
  var autoconfig = new AutoConfig("test");
  angular.extend(npolarApiConfig, autoconfig, { resources });
  console.debug("npolarApiConfig", npolarApiConfig);

  $httpProvider.interceptors.push('npolarApiInterceptor');
});

npdcInventoryApp.run(($http, npdcAppConfig, NpolarTranslate, NpolarLang) => {
  NpolarTranslate.loadBundles('npdc-inventory');
  npdcAppConfig.toolbarTitle = 'Inventory';
});


