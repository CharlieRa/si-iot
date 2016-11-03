  'use strict';

  angular.module('si.motes', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate'])
    .controller('motesCtrl', moteCtrl);

    /**
    * Controller de Messages
    **/
    function moteCtrl($scope, $http, $timeout, $location, $mdDialog, $mdToast, $rootScope)
    {
      $http.get('http://127.0.0.1:8888/api/motes')
      .success(function(data, status, headers, config)
      {
        $scope.motes = data;
        console.log(data);
      })
        /*ToDo Manejo de errores que se pueden producir */
      .error(function(data, status, headers, config)
      {
        console.log('No hemos podido publicar tu mensaje');
        console.log(data);
      });

      $scope.errorMessage = "";
      $scope.messages = [];
      $scope.toggle = [{
        si: 'true',
        error: 'false',
        progress: 'true'
      }];
      console.log("asasdds");
      // $scope.currentUser = User.get();
      /**
      * Obtener Posicion de usuario por navegador cuando aplicación inicia
      */
      $scope.load = function () {
      }
      /**
      * Funcion encargada en enviar nuevos mensajes escritos por el usuario al servidor
      */
      $scope.addNewMote = function(ev){
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          controller: newMessageController,
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
                            <md-input-container flex>\
                              <label>Root</label>\
                              <input ng-readonly="true" ng-model="newMote.dagroot"></input>\
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
                          <md-button type="submit" ng-click="createMote()" class="md-primary"> Enviar </md-button>\
                          <md-button ng-click="cancelDialogAddMote()"> Volver </md-button>\
                        </div>\
                      </form>\
                    </md-dialog>',
          targetEvent: ev,
        });
      }
      // <md-input-container flex>\
      //   <label>Comando</label>\
      //   <input ng-readonly="toggleProgress" ng-model="newMote.commands"></input>\
      // </md-input-container>\
      /* Controller del Dialog New Message */
      function newMessageController($scope, $mdDialog, messages, currentUser, $mdToast, $http) {
        $scope.toggleProgress = false;
        $scope.messages = messages;
        $scope.cancelDialogAddMote = function() {
          $mdDialog.cancel();
        };

        $scope.createMote = function()
        {
          $scope.toggleProgress = false;
          // $scope.currentUser = currentUser;
          // $scope.messages = messages;
          console.log($scope.newMote);
          // return;

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
              $mdDialog.hide();
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
    }
