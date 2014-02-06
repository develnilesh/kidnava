'use strict';

// Declare app level module which depends on filters, and services
angular.module('kidnava', ['kidnava.filters', 'kidnava.services', 'kidnava.directives','kidnava.controllers', 'ngRoute', 'ui.bootstrap'])
  .config(function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/welcome',
        controller: 'WelcomeCtrl'
        //controller: 'IndexCtrl'
      }).
      when('/register', {
        templateUrl: 'partials/register',
        controller: 'registerUserCtrl'
      }).
      when('/addBaby', {
        templateUrl: 'partials/addBaby',
        controller: 'AddBabyCtrl'
      }).
      when('/addName', {
        templateUrl: 'partials/addName',
        controller: 'AddNameCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      }).
      when('/logout', {
        controller: 'LogoutCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
