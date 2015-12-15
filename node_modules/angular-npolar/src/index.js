'use strict';
var angular = require('angular');

require('angular-resource');
require('angular-utf8-base64');
require('angular-jwt');
require('angular-animate');
require('angular-aria');
require('angular-material');
require('angular-route');

var ngNpolar = angular.module('ngNpolar', ['ngResource', 'ngMaterial', 'ngRoute', 'utf8-base64', 'angular-jwt']);

require('./api');
require('./ui');

ngNpolar.factory('NpolarMessage', require('./events/Message'));
