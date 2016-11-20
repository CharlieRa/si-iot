  'use strict';

  angular.module('si.motes', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate', 'md.data.table'])
    .controller('motesCtrl', moteCtrl);

    /**
    * Controller de Messages
    **/
    function moteCtrl($scope, $http, $timeout, $location, $mdDialog, $mdToast, $rootScope, $filter, MoteService, UserService)
    {
      $scope.commandModel = [];
      $scope.motesSelected = [];
      $scope.motes = [];
      $scope.commandsButtons = [];
      $scope.commandsCheckbox = [];
      $scope.metodo = [];
      $scope.commandsMethodsBtn = ['get', 'post', 'put', 'delete'];
      $scope.messages = [];
      $scope.toggle = [{
        si: 'true',
        general: 'false',
        error: 'false',
        progress: 'true',
        commands: 'false',
        motes: 'true'
      }];

      $scope.load = function () {
        MoteService.getAll().then(function(response){
          if(response['success'] === false) {
            $mdToast.show(
               $mdToast.simple()
                 .content('Error al intentar para obtener la información del servidor.')
                 .hideDelay(8000));
          }else{
            $scope.motes = response;
          }
          console.log(response);
          $scope.toggle.motes = false;
        });
      };

      // $scope.currentUser = User.get();
      /**
      * Funcion encargada en enviar nuevos mensajes escritos por el usuario al servidor
      */
      $scope.addNewMote = function(ev){
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          controller: newMoteController,
          controllerAs: 'ctrl',
          clickOutsideToClose: true,
          locals: {
            currentUser: $scope.currentUser,
            messages: $scope.messages,
            positionActual: $rootScope.positionActual
          },
          templateUrl:'main/motes/motes.dialog.tmpl.html',
          targetEvent: ev,
        });
      }
      function newMoteController($scope, $mdDialog, messages, currentUser, $mdToast, $http) {
        $scope.toggleProgress = false;
        $scope.messages = messages;
        $scope.cancelDialogAddMote = function() {
          $mdDialog.cancel();
        };

        $scope.createMote = function()
        {
          $scope.toggleProgress = false;
          console.log($scope.newMote);

          if($scope.newMote) {
            $scope.toggleProgress = true;
            console.log('Guardando a server', $scope.newMote);
            MoteService.Create($scope.newMote).then(function(response) {
              $mdToast.show(
                 $mdToast.simple()
                   .content('Mote Creado!')
                   .hideDelay(3000)
               );
               $scope.toggleProgress = false;
            });
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
        console.log($scope.motesSelected);
        console.log($scope.metodo);
        console.log($scope.commandModel);
        // console.log();
        angular.forEach($scope.motesSelected, function(value, key){
          MoteService.sendCommand(value.ipv6, $scope.commandModel).then(function(response){
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
                console.log(response);
                // var moteReceived = $filter("filter")($scope.motes, {ipv6:response['mote']}, true)[0];
                // var indice = $scope.motes.indexOf(moteReceived);
                // angular.forEach(response['response'], function(value, key){
                //   value = value.replace(/</g,"");
                //   value = value.replace(/>/g,"");
                //   value = value.replace(/\//g,"");
                //   response['response'][key] = value;
                // });
                // $scope.motes[indice].commands = response['response'];

            }
          })
        });
        return;
      };
      $scope.getCommands = function() {
        $scope.toggle.general = true;
        var ipv6Array = [];
        angular.forEach($scope.motesSelected, function(value, key){
          MoteService.getAllCommands(value.ipv6).then(function(response){
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

      /**
      * Funcion que elimina usuarios
      */
      $scope.deleteMote = function(ev) {

        if($scope.motesSelected.length == 0 || $scope.motesSelected.length > 1) {
          $mdToast.show(
            $mdToast.simple()
            .content("Solo puedes eliminar un mote a la vez")
            .hideDelay(5000));
            $mdDialog.cancel();
          return;
        }
        var confirm = $mdDialog.confirm()
        .title('Estas seguro que deseas eliminar el mote con ip '+$scope.motesSelected[0].ipv6+' ?')
        // .textContent('All of the banks have agreed to forgive you your debts.')
        .ariaLabel('Eliminar Mote')
        .targetEvent(ev)
        .ok('Eliminar Mote')
        .cancel('Cancelar');

        $mdDialog.show(confirm).then(function() {
          MoteService.Delete($scope.motesSelected[0]._id).then(function(response){
            console.log(response);
            var indice = $scope.motes.indexOf($scope.motesSelected[0]);
            $scope.motes.splice(indice, 1);
            $scope.motesSelected = [];
            $mdToast.show(
              $mdToast.simple()
              .content("Mote eliminado exitosamente!.")
              .hideDelay(5000));
          });
        });
      }


    }
