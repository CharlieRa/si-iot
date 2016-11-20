'use strict';

angular.module('si.dashboard', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate', 'chart.js'])
  .config(['ChartJsProvider', function (ChartJsProvider) {
      ChartJsProvider.setOptions({
        chartColors: ['#FF5252', '#FF8A80'],
        responsive: true,
        maintainAspectRatio: false
      });
    }])
  .controller('dashboardCtrl',
  function ($scope, $location, $state, $stateParams, $http, $mdDialog, $timeout, PacketService, $mdToast) {
    $scope.packets = [";aa", 'asddsa'];
    $scope.startPacketCollection = function() {
      PacketService.Start().then(function(response){
        if(response['success'] === false) {
          var mensaje = "Error al intentar iniciar la captura de datos";
        }else{
          var mensaje = "Captura de datos en proceso";
        }
        $mdToast.show(
          $mdToast.simple()
          .content(mensaje)
          .hideDelay(8000));
        });
    }

    $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data = [300, 500, 100];

    $scope.refreshStat = function() {
      initInterval();
    }
    function initInterval() {
      PacketService.getAll().then(function(response){
        if(response['success'] === false) {
          // var mensaje = "Error al intentar iniciar la captura de datos";
          $scope.packets = response;
          console.log($scope.packets);
          // $scope.$apply();
        }else{
          $scope.packets = response;
          var mensaje = "Cpatura de datos en proceso";
          console.log(response);
          console.log(response.length);
        }
        });
    }
  });
