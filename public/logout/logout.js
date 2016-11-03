'use strict';

angular
  .module('si.logout', ['ngMessages','satellizer', 'ui.router','ngMaterial'])
  .config(function($stateProvider)
  {
    $stateProvider.
      state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      });
  })
  .controller('LogoutCtrl', LogoutCtrl);

  function LogoutCtrl ($scope, $location, $auth) {
    console.log("aadsasasdas");
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        // toastr.info('You have been logged out');
        console.log("loged out");
        // $location.path('/login');
      });
  }
