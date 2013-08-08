'use strict';

/* Controllers */

var data_inmemeory = {names: []};

angular.module('kidnava.controllers', []).

controller('IndexCtrl', function($scope, $http) {
}).
controller('LoginCtrl', function($scope) {
  $scope.title="Kidnava";
}).
controller('AddNameCtrl', function($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/addName', $scope.form).
      success(function(data) {
        data_inmemeory.names.push(data);
        $location.path('/');
      });
  };
});
