'use strict';
/**
 * NpolarEditController extends [NpolarBaseController](https://github.com/npolar/angular-npolar/blob/master/src/api/controller/BaseController.js) with scope methods for REST-style document editing (using ngResource)
 * and [formula](https://github.com/npolar/formula)-bound controller action methods, like $scope.edit()
 *
 * For following ngResource-bound scope methods are defined
 * - create()
 * - update()
 * - delete()
 * - save()
 *
 * Usage example: https://github.com/npolar/npdc-dataset/blob/ae0dc74d33708c76ac88fc8f0f492ac14759cae7/src/edit/DatasetEditController.js
 *
 */

// @ngInject
let EditController = function($scope, $location, $route, $routeParams, $controller,
  Gouncer, npolarApiConfig, NpolarApiSecurity, NpolarMessage) {

  // Extend NpolarBaseController
  $controller('NpolarBaseController', {
    $scope: $scope
  });

  // Seconds since save
  $scope.i = 0;

  $scope.formula = {
    template: npolarApiConfig.formula.template || 'default',
    language: null,
    hideButtons: true,
    onsave: function(model) {
      if (!model._rev) {
        $scope.create(model);
      } else {
        $scope.update(model);
      }
    }
  };

  // const step = 5; // Interval step (in seconds)
  // const autosave = 30; // Autosave every N seconds

  $scope.isChanged = function() {
    return $scope.formula.formula ? $scope.formula.formula.dirty : false;
  };

  //$interval(() => {
  //  if ($scope.isChanged()) {
  //    $scope.i = $scope.i + step;
  //    $log.debug($scope.i, $scope.isChanged(), $scope.i % autosave);
  //
  //    if (0 === ($scope.i % autosave)) {
  //      $scope.save();
  //    }
  //  }
  //}, step * 1000);

  // Refresh JWT
  let refreshJwt = function() {
    if (NpolarApiSecurity.isAuthenticated()) {
      Gouncer.authenticate().then(function(response) {
        NpolarApiSecurity.setJwt(response.data.token);
      });
    }
  };

  // Create action, ie. save document and redirect to new URI
  $scope.create = function(model) {
    return $scope.resource.save(model, function(document) {
      let uri = $location.path().replace(/\/__new(\/edit)?$/, '/' + document.id + '/edit');
      $scope.document = document;
      $scope.formula.model = document;
      refreshJwt();
      $location.path(uri);
      $scope._error = false;
    }, function(errorData) {
      $scope._error = errorData.statusText;
    });
  };

  // Edit action, ie. fetch document and edit with formula
  $scope.editAction = function() {
    return $scope.resource.fetch($routeParams, function(document) {
      $scope.document = document;
      $scope.formula.model = document;
      $scope._error = false;
    }, function(errorData) {
      $scope._error = errorData.statusText;
    });
  };

  // New action, ie. create new document and edit with formula
  $scope.newAction = function(document) {
    $scope.document = new $scope.resource();
    $scope.formula.model = $scope.document;
  };

  // Edit (or new) action
  $scope.edit = function() {
    if ($routeParams.id === '__new') {
      $scope.newAction();
    } else {
      $scope.editAction();
    }
  };

  // PUT document, ie resource update
  $scope.update = function(model) {
    return $scope.resource.update(model, function(document) {
      $scope.document = document;
      $scope.formula.model = document;
      $scope.i = 0;
      refreshJwt();
      $route.reload();
      $scope._error = false;
    }, function(errorData) {
      $scope._error = errorData.statusText;
    });
  };

  // DELETE document, ie. resource remove
  $scope.delete = function() {
    return $scope.resource.remove({
      id: $scope.document.id
    }, function() {
      refreshJwt();
      $location.path('/');
      $route.reload();
      $scope._error = false;
    }, function(errorData) {
      $scope._error = errorData.statusText;
    });
  };

  // Save document action, ie. create or update
  $scope.save = function() {
    try {
      $scope._error = false;
      return $scope.formula.formula.save();
    } catch (e) {
      $scope._error = e;
      NpolarMessage.error(e);
    }
  };
};

module.exports = EditController;
