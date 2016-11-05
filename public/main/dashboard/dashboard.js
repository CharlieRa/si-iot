'use strict';

angular.module('si.dashboard', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate'])
  .controller('dashboardCtrl',
  function ($scope, $location, $state, $stateParams, $http, $mdDialog, $timeout)
  {
    console.log("hola");
  });
