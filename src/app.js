'use strict';
//var environment = require('../environment');
var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

var angular = require('angular');
require('npdc-common/src/wrappers/leaflet');

var npdcInventoryApp = angular.module('npdcInventoryApp', ['npdcCommon','leaflet']);

//npdcInventoryApp.factory('Inventory', require('./Inventory'));
npdcInventoryApp.controller('InventoryShowController', require('./show/InventoryShowController'));
npdcInventoryApp.controller('InventorySearchController', require('./search/InventorySearchController'));
npdcInventoryApp.controller('InventoryEditController', require('./edit/InventoryEditController'));

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/', 'resource': 'NpolarApi'},
  {'path': '/user', 'resource': 'User'},
  {'path': '/dataset', 'resource': 'Dataset' },
  {'path': '/publication', 'resource': 'Publication' },
  {'path': '/project', 'resource': 'Project' },
  {'path': '/inventory', 'resource': 'Inventory'}
];



resources.forEach(service => {
  // Expressive DI syntax is needed here
  npdcInventoryApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});


npdcInventoryApp.factory('L', function() {
  return window.L; // assumes Leaflet has already been loaded on the page
});


// Routing
npdcInventoryApp.config(require('./router'));

// API HTTP interceptor
npdcInventoryApp.config($httpProvider => {
  $httpProvider.interceptors.push('npolarApiInterceptor');
});


// Inject npolarApiConfig and run
npdcInventoryApp.run(function(npolarApiConfig, npdcAppConfig){
  var environment = "test";
  var autoconfig = new AutoConfig(environment);
  angular.extend(npolarApiConfig, autoconfig);

  npdcAppConfig.cardTitle = '';
  npdcAppConfig.toolbarTitle = 'NPI Inventory';

 // console.log("npolarApiConfig", npolarApiConfig);
});



