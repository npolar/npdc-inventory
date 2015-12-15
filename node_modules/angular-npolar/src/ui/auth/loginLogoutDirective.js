'use strict';

/**
 * @ngInject
 */
var loginLogout = function (NpolarApiSecurity, npolarApiConfig, $http) {
  return {
   scope: {},
   controller: 'NpolarLoginController',
   templateUrl: 'angular-npolar/src/ui/auth/_user.html',
   link: function(scope) {
      
      scope.user = NpolarApiSecurity.getUser();

   }
  };
};

module.exports = loginLogout;
