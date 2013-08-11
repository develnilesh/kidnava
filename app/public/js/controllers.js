'use strict';

/* Controllers */

var data_inmemeory = {names: []};

angular.module('kidnava.controllers', []).

controller('IndexCtrl', function($scope, $http, $location) {
}).
controller('LoginCtrl', function($scope, $location) {
  $scope.title="Kidnava";
  $scope.onClick = function() {
     location.href = '/auth/google';
  }
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
