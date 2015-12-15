'use strict';

var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

var angular = require('angular');

var npdcInventoryApp = angular.module('npdcInventoryApp', ['npdcCommon']);

npdcInventoryApp.controller('InventoryShowController', require('./show/InventoryShowController'));
npdcInventoryApp.controller('InventorySearchController', require('./search/InventorySearchController'));
npdcInventoryApp.controller('InventoryEditController', require('./edit/InventoryEditController'));

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/inventory', 'resource': 'Inventory'},
];

resources.forEach(service => {
  // Expressive DI syntax is needed here
  npdcInventoryApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// Routing
npdcInventoryApp.config(require('./router'));

// API HTTP interceptor
npdcInventoryApp.config($httpProvider => {
  $httpProvider.interceptors.push('npolarApiInterceptor');
});

// Inject npolarApiConfig and run
npdcInventoryApp.run(function(npolarApiConfig, npdcAppConfig){
  var environment = "development";
  var autoconfig = new AutoConfig(environment);
  angular.extend(npolarApiConfig, autoconfig);

  npdcAppConfig.cardTitle = '';
  npdcAppConfig.toolbarTitle = 'NPI Inventory';

  console.log("npolarApiConfig", npolarApiConfig);
});
