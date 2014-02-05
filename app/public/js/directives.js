'use strict';

/* Directives */


angular.module('kidnava.directives', []).
  directive('appVersion', ['version', function(version) {
     return function(scope, elm, attrs) {
       elm.text(version);
     };
  }])
  .directive('userbadge', function(userservice) { 
    return {
      restrict: 'E',
      link: function(scope, elem, attrs) {
        var userData;
        userservice.getUserInfo().then(function(response) {
          scope.hasUserInfo = true;
          userData = response.data;
          scope.userImage = userData.picture;
          scope.userFirst = userData.first;
          scope.userLast = userData.last;
          elem.find('img')[0].src = userData.picture;
        });
      },
      templateUrl: 'partials/userinfo'
    }
  })
  .directive('appnavigation', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/navbar'
    }
  });
