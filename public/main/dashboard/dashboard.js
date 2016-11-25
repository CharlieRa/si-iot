'use strict';

angular.module('si.dashboard', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate', 'chart.js'])
  .config(['ChartJsProvider', function (ChartJsProvider) {
      ChartJsProvider.setOptions({
        chartColors: ['#FF5252', '#FF8A80'],
        responsive: true,
        maintainAspectRatio: false,
      });
    }])
  .controller('dashboardCtrl',
  function ($scope, $location, $state, $stateParams, $http, $mdDialog, $timeout, PacketService, $mdToast) {
    $scope.query = {
      order: 'name',
      limit: 10,
      page: 1
    };
    $scope.coapCodes = {
      '1': 'GET',
      '2': 'POST',
      '3': 'PUT',
      '4': 'DELETE',
      '69': 'SUCCESS',
      '128': 'BAD REQUEST',
      '162': 'REDIRECTION',
      '404': 'NOT FOUND'
    }
    $scope.packets = [];
    $scope.packetGroup = [];
    $scope.layerGroup = [];
    $scope.ipv6DstGroup = [];
    $scope.ipv6SrcGroup = [];
    $scope.coapPackets = [];
    $scope.icmpv6Packets = [];
    $scope.options = {
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    stepSize: 1,
                    beginAtZero: true
                }
            }]
        }
      };
    $scope.load = function () {
      $scope.labelsPieChart = [];
      $scope.dataPieChart = [];
      $scope.labelsBarChartSrc = [];
      $scope.dataBarChartSrc = [];
      $scope.labelsBarChartDst = [];
      $scope.dataBarChartDst = [];
      $scope.labelsChartCoapCode = [];
      $scope.dataChartCoapCode = [];
    }
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

    $scope.refreshStat = function() {
      initInterval();
      initInterval2();
      initInterval3();
      // console.log(packetsGr);
    }

    /**
    *
    */
    function initInterval() {
      PacketService.getAll().then(function(response){
        if(response['success'] === false) {
          $scope.packets = response;
          console.log($scope.packets);
        }else{
          angular.forEach(response, function(value, key) {
            if(!(value.highest_layer in $scope.packetGroup)) {
              $scope.packetGroup[value.highest_layer] = [];
              $scope.packetGroup[value.highest_layer].push(value);
            }else{
              $scope.packetGroup[value.highest_layer].push(value);
            }
          });
          $scope.packets = response;
          for (var key in $scope.packetGroup) {
            console.log(key);
            $scope.labelsPieChart.push(key);
            $scope.dataPieChart.push($scope.packetGroup[key].length);
          }
        }
      });
    }

    /**
    *
    */
    function initInterval2() {
      PacketService.getByLayer('coap').then(function(response){
        if(response['success'] === false) {
          $scope.packets = response;
          console.log($scope.packets);
        }else{
          console.log(response);
          $scope.coapPackets = response;
          $scope.labelsBarChart = [];
          $scope.dataBarChart = [];
          angular.forEach(response, function(value, key) {
            if(!(value.ipv6_dst in $scope.ipv6DstGroup)) {
              $scope.ipv6DstGroup[value.ipv6_dst] = [];
              $scope.ipv6DstGroup[value.ipv6_dst].push(value);
            }else{
              $scope.ipv6DstGroup[value.ipv6_dst].push(value);
            }

            if(!(value.ipv6_src in $scope.ipv6SrcGroup)) {
              $scope.ipv6SrcGroup[value.ipv6_src] = [];
              $scope.ipv6SrcGroup[value.ipv6_src].push(value);
            }else{
              $scope.ipv6SrcGroup[value.ipv6_src].push(value);
            }

            if(!(value.coap_code in $scope.layerGroup)) {
              $scope.layerGroup[value.coap_code] = [];
              $scope.layerGroup[value.coap_code].push(value);
            }else{
              $scope.layerGroup[value.coap_code].push(value);
            }
          });

          for (var key in $scope.layerGroup) {
            $scope.labelsChartCoapCode.push($scope.coapCodes[String(key)]);
            $scope.dataChartCoapCode.push($scope.layerGroup[key].length);
          }

          for (var key in $scope.ipv6SrcGroup) {
            $scope.labelsBarChartSrc.push(key);
            $scope.dataBarChartSrc.push($scope.ipv6SrcGroup[key].length);
          }

          for (var key in $scope.ipv6DstGroup) {
            $scope.labelsBarChartDst.push(key);
            $scope.dataBarChartDst.push($scope.ipv6DstGroup[key].length);
          }

          // for (var key in $scope.ipv6SrcGroup) {
          //   $scope.labelsBarChartSrc.push(key);
          //   $scope.dataBarChartSrc.push($scope.ipv6SrcGroup[key].length);
          // }
        }
      });
    }

    function initInterval3() {
      PacketService.getByLayer('icmpv6').then(function(response){
        if(response['success'] === false) {
          $scope.packets = response;
          // console.log($scope.packets);
        }else{
          $scope.icmpv6Packets = response;
          // console.log(response);
          angular.forEach(response, function(value, key) {
            if(!(value.ipv6_dst in $scope.ipv6DstGroup)) {
              $scope.ipv6DstGroup[value.ipv6_dst] = [];
              $scope.ipv6DstGroup[value.ipv6_dst].push(value);
            }else{
              $scope.ipv6DstGroup[value.ipv6_dst].push(value);
            }
          });
        }
      });
    }
  });
