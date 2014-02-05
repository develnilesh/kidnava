'use strict';

/* Controllers */

angular.module('kidnava.controllers', []).

controller('IndexCtrl', function($scope, $http, $location) {
  $location.path('/addName');
  $http.get('api/getUserInfo/').
          success(function(results) {
            var userInfo = results;
            
          });
}).
controller('LoginCtrl', function($scope, $location) {
  $scope.title="Kidnava";
  $scope.onClick = function() {
     location.href = '/auth/google';
  }
}).
controller('LogoutCtrl', function($scope, $location) {
  $scope.logoutClick = function() {
     location.href = '/logout';
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
  var knownEmails;
  $scope.onSpouseChange = function() {
    if (!knownEmails) {
      $http.get('api/getContacts/').
          success(function(results) {
            var contacts = results;
            if (!contacts) return [];
            knownEmails = contacts.map(function(contact) {
		return contact.name;
	    });
          });
    }
  }
}).
controller('StartScreenCtrl', function($scope, $location) {
  $scope.nameChild = function() {
     location.path('/addName')
  }
  $http.get('childrenName')
    .success(function(data) {
      $scope.children = data;
    });
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
        $scope.suggestion.name.length > 2) {
      $http.get('api/names/' + $scope.suggestion.name).
        success(function(names) {
          $scope.names = names;
        });
    }
  }
})
.controller('NavBarCtrl', function($scope) {
  $scope.isCollapsed = true;
});
