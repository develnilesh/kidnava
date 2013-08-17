'use strict';

/* Controllers */

angular.module('kidnava.controllers', []).

controller('IndexCtrl', function($scope, $http, $location) {
  $location.path('/addName');
}).
controller('LoginCtrl', function($scope, $location) {
  $scope.title="Kidnava";
  $scope.onClick = function() {
     location.href = '/auth/google';
  }
}).
controller('WelcomeCtrl', function($scope) {
}).
controller('AddBabyCtrl', function($scope, $http, $location) {
  $scope.addYourBaby = function(baby) {
    console.log(baby);
      //$location.href='/';
    $http.post('/api/addBaby', baby).
    success(function(data) {
      $location.path('/');
    });
  }
}).
controller('AddNameCtrl', function($scope, $http, $location) {
  console.log('name:' + $scope.suggestion + ' form:' +  $scope.form);
  $scope.suggestions = [];
  $scope.names = [];
  $scope.addSuggestion = function (suggestion) {
    var data = {
      name: $scope.suggestion.name,
      note: $scope.suggestion.note
    };
    $http.post('/api/addSuggestion', data).
      success(function(data) {
        $scope.suggestions = data; 
      });
  };

  $scope.nameChange = function() {
    if ($scope.suggestion.name &&
        $scope.suggestion.name.length > 3) {
      $http.get('api/names/' + $scope.suggestion.name).
        success(function(names) {
          $scope.names = names;
        });
    }
  }
});
