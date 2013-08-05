'use strict';

// Declare app level module which depends on filters, and services
angular.module('kidnava', ['kidnava.filters', 'kidnava.services', 'kidnava.directives','kidnava.controllers']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: 'IndexCtrl'
      }).
      when('/addName', {
        templateUrl: 'partials/addName',
        controller: 'AddNameCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
