'use strict';

// @ngInject
let ToastController = function ($scope, $mdToast, explanation, msgType) {
  $scope.explanation = explanation;
  $scope.msgType = msgType;

  $scope.closeToast = function () {
    $mdToast.hide();
  };
};

module.exports = ToastController;
