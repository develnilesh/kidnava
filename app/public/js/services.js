'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kidnava.services', []).
  value('version', '0.1').
  factory('userservice', function($http, $q) {
    var userData;
    return {
      getUserInfo: function() {
        if (userData) return $q.when(userData);
        return $http.get('/api/getUserInfo').
          then(function(response) {
            userData = response;  
            return response;
          });
        }
    }});
