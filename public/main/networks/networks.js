  'use strict';

  angular.module('si.networks', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate', 'md.data.table'])
    .controller('networksCtrl', networkCtrl);

    /**
    * Controller de Messages
    **/
    function networkCtrl($scope, $http, $timeout, $location, $mdDialog, $mdToast, $rootScope, $filter, MoteService, UserService, NetworkService)
    {
      $scope.toggle = [{
        network: 'true'
      }];
      $scope.networks = [];
      $scope.load = function () {
        NetworkService.getAll().then(function(response){
          if(response['success'] === false) {
            $mdToast.show(
               $mdToast.simple()
                 .content('Error al intentar para obtener la información del servidor.')
                 .hideDelay(8000));
          }else{
            $scope.networks = response;
          }
          console.log(response);
          $scope.toggle.network = false;
        });
      };

      // $scope.currentUser = User.get();
      /**
      * Funcion encargada en enviar nuevos mensajes escritos por el usuario al servidor
      */
      $scope.addNewNetwork = function(ev){
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          controller: newNetworkController,
          controllerAs: 'ctrl',
          clickOutsideToClose: true,
          locals: {
            // currentUser: $scope.currentUser,
            // messages: $scope.messages,
            // positionActual: $rootScope.positionActual
          },
          templateUrl: '/main/networks/network.dialog.tmpl.html',
          targetEvent: ev,
        });
      }
      function newNetworkController($scope, $mdDialog, $mdToast, MoteService, UserService) {
        $scope.motes = [];
        $scope.motesSelected = [];
        $scope.users = [];
        $scope.usersSelected = [];
        // $scope.newNetwork = [];
        $scope.toggleProgress = false;

        /* Se obtienen los motes a asignar */
        MoteService.getAll().then(function(response){
          if(response['success'] === false) {
            $mdToast.show(
               $mdToast.simple()
                 .content('Error al intentar para obtener los motes a asignar a la Red.')
                 .hideDelay(5000));
          }else{
            $scope.motes = response;
          }
        });

        /* Se obtienen los usuarios a asignar */
        UserService.getAll().then(function(response){
          if(response['success'] === false) {
            $mdToast.show(
               $mdToast.simple()
                 .content('Error al intentar para obtener los motes a asignar a la Red.')
                 .hideDelay(5000));
          }else{
            $scope.users = response;
          }
        });

        /* Cancel dialog */
        $scope.cancelDialog = function() {
          $mdDialog.cancel();
        };

        /* Create Network*/
        $scope.createNetwork = function()
        {
          $scope.toggleProgress = true;
          $scope.newNetwork.motes = $scope.motesSelected;
          $scope.newNetwork.users = $scope.usersSelected;

          /* Se comprueba que el mensaje no este vacío*/
          if($scope.newNetwork) {
            console.log('Guardando a server', $scope.newNetwork);
            NetworkService.Create($scope.newNetwork);
          }else{
            console.log("malo");
          }
        }
      };

      $scope.sendCommands = function() {
        console.log($scope.motesSelected);
        if($scope.motesSelected.length != 0) {
          var commands = [];
          var check = true;
          angular.forEach($scope.motesSelected, function(value, key){
            console.log(key);
            if(value.commands.length == 0) {
              $mdToast.show(
                 $mdToast.simple()
                   .content('No hay comandos comunes para enviar a estos motes.')
                   .hideDelay(5000));
             $scope.commandsButtons  = [];
             check = false;
            }
            if(check) {
              // var missing_days = value.commands;
              var nextObject = $scope.motesSelected[key+1 % $scope.motesSelected.length];
              if(nextObject){
                commands = commonValues(value.commands, nextObject.commands);
              }
            }
          });
          console.log(commands);
          $scope.commandsButtons  = commands;
        }
      }
      function commonValues(obj1, obj2) {
        var values = [];
        for(var i in obj1) {
          var exist = obj2.indexOf(obj1[i])
          if(exist != -1) {
              values.push(obj1[i]);
          }
        }
        return values;
      }
      $scope.sendCommand = function(){
        console.log($scope.metodo);
        console.log($scope.commandsCheckbox);
      };
      $scope.getCommands = function() {
        $scope.toggle.general = true;
        var ipv6Array = [];
        angular.forEach($scope.motesSelected, function(value, key){
          NetworkService.getAllCommands(value.ipv6).then(function(response){
            if(response['success'] === false) {
              $mdToast.show(
                 $mdToast.simple()
                   .content('Error al intentar comandos del mote IP: '+value.ipv6)
                   .hideDelay(3000));
            }else{
              $mdToast.show($mdToast.simple()
                .content('Nuevo mensaje de Mote: ')
                .hideDelay(3000));
                $scope.messages.push(response);
                var moteReceived = $filter("filter")($scope.motes, {ipv6:response['mote']}, true)[0];
                var indice = $scope.motes.indexOf(moteReceived);
                angular.forEach(response['response'], function(value, key){
                  value = value.replace(/</g,"");
                  value = value.replace(/>/g,"");
                  value = value.replace(/\//g,"");
                  response['response'][key] = value;
                });
                $scope.motes[indice].commands = response['response'];
            }
          })
        });
        $scope.toggle.general = false;
      }


    }
