  'use strict';

  angular.module('si.motes', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate', 'md.data.table'])
    .controller('motesCtrl', moteCtrl);

    /**
    * Controller de Messages
    **/
    function moteCtrl($scope, $http, $timeout, $location, $mdDialog, $mdToast, $rootScope, $filter, MoteService, UserService, CommandService)
    {
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
          template:'<md-dialog flex="40" aria-label="New Mote"> \
                      <form ng-submit="$event.preventDefault()" name="formNewMote" id="formNewMote">\
                        <md-toolbar>\
                          <div class="md-toolbar-tools">\
                            <h2>Nuevo Mote</h2>\
                          </div>\
                        </md-toolbar>\
                        <md-progress-linear ng-if="toggleProgress" md-mode="indeterminate"></md-progress-linear>\
                        <md-dialog-content>\
                          <div class="md-dialog-content">\
                            <md-input-container flex>\
                              <label>Nombre</label>\
                              <input ng-readonly="toggleProgress" ng-model="newMote.name"></input>\
                            </md-input-container>\
                            <md-input-container flex>\
                              <label>MAC</label>\
                              <input ng-readonly="toggleProgress" ng-model="newMote.mac"></input>\
                            </md-input-container>\
                            <md-input-container flex>\
                              <label>PANID</label>\
                              <input ng-readonly="toggleProgress" ng-model="newMote.panid"></input>\
                            </md-input-container>\
                            <md-input-container flex>\
                              <label>EUI64</label>\
                              <input ng-readonly="toggleProgress" ng-model="newMote.eui64"></input>\
                            </md-input-container>\
                            <md-input-container>\
                              <md-switch ng-model="newMote.dagroot" ng-true-value="\'TRUE\'" ng-false-value="\'FALSE\'">Root</md-switch>\
                            </md-input-container>\
                            <md-input-container flex>\
                              <label>IPv6</label>\
                              <input ng-readonly="toggleProgress" ng-model="newMote.ipv6"></input>\
                            </md-input-container>\
                          </div>\
                        </md-dialog-content>\
                        <div class="md-actions" layout="row" ng-if="!toggleProgress">\
                          <span flex></span>\
                          <md-button ng-click="cancelDialogAddMote()"> Volver </md-button>\
                          <md-button type="submit" ng-click="createMote()" class="md-primary"> Enviar </md-button>\
                        </div>\
                      </form>\
                    </md-dialog>',
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

          /* Se comprueba que el mensaje no este vacío*/
          // if(!$scope.mote == "")
          if($scope.newMote)
          {
            $scope.toggleProgress = true;
            console.log('Guardando a server', $scope.newMote);
            // $http.post('http://54.207.86.25/api/posts',newPost)
            $http.post('http://127.0.0.1:8888/api/motes',$scope.newMote)
            .success(function(data, status, headers, config)
            {
              console.log(data);
              $mdToast.show(
                 $mdToast.simple()
                   .content('Mensaje enviado exitosamente!')
                   .hideDelay(3000)
               );
              // $mdDialog.hide();
            })
              /*ToDo Manejo de errores que se pueden producir */
            .error(function(data, status, headers, config)
            {
              console.log('No hemos podido publicar tu mensaje');
              console.log(data);
              $scope.toggleProgress = false;
              $mdToast.show(
                 $mdToast.simple()
                   .content('No hemos podido publicar tu mensaje, intentalo nuevamente.')
                   .hideDelay(5000));
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
        console.log($scope.metodo);
        console.log($scope.commandsCheckbox);
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


    }
