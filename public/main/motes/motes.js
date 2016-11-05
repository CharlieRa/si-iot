  'use strict';

  angular.module('si.motes', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate'])
    .controller('motesCtrl', moteCtrl);

    /**
    * Controller de Messages
    **/
    function moteCtrl($scope, $http, $timeout, $location, $mdDialog, $mdToast, $rootScope, $filter)
    {
      $scope.load = function () {
        $http.get('http://127.0.0.1:8888/api/motes')
        .success(function(data, status, headers, config) {
          angular.forEach(data, function(value, key){
            value.selected = false;
          });
          $scope.motes = data;
          console.log(data);
        })
        .error(function(data, status, headers, config) {
          $mdToast.show(
            $mdToast.simple()
            .content('Error: '+data)
            .hideDelay(3000)
          );
        });
      }
      $scope.errorMessage = "";
      $scope.messages = [];
      $scope.toggle = [{
        si: 'true',
        error: 'false',
        progress: 'true',
        commands: 'false'
      }];
      // $scope.currentUser = User.get();

      $scope.items = [1,2,3,4,5];
      $scope.options = [
        {value:'Option1', selected:true},
        {value:'Option2', selected:false}
      ];

      $scope.toggleAll = function() {
         var toggleStatus = !$scope.isAllSelected;
         angular.forEach($scope.options, function(itm){ itm.selected = toggleStatus; });
      }

      $scope.optionToggled = function(){
        $scope.isAllSelected = $scope.options.every(function(itm){ return itm.selected; })
      }

      $scope.message = [];
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
      // <md-input-container flex>\
      //   <label>Comando</label>\
      //   <input ng-readonly="toggleProgress" ng-model="newMote.commands"></input>\
      // </md-input-container>\
      /* Controller del Dialog New Message */
      function newMoteController($scope, $mdDialog, messages, currentUser, $mdToast, $http) {
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
      $scope.getCommands = function (moteIps) {
        var ipv6Array = [];
        angular.forEach($scope.motes, function(value, key){
          if(value.selected) {
            ipv6Array.push(value.ipv6);
          }
         });
         angular.forEach(ipv6Array, function(value, key){


        // var ip = 'bbbb::12:4b00:3a5:6b3c';
        // var moteReceived = $filter("filter")($scope.motes, {name:'a'});
        // console.log(moteReceived);
        $http.get('http://127.0.0.1:8888/api/commands/'+value)
        .success(function(data, status, headers, config) {
          console.log(data);
          $mdToast.show($mdToast.simple()
            .content('Mensaje recibido!')
            .hideDelay(3000));
            $scope.messages.push(data);
            // $scope.messages.push(data);
            var moteReceived = $filter("filter")($scope.motes, {ipv6:value}, true)[0];
            var indice = $scope.motes.indexOf(moteReceived);
            console.log(indice);
            $scope.motes[indice].commands = data['response'];
            console.log(moteReceived);
        })
        .error(function(data, status, headers, config) {
          console.log(data);
          console.log('Error: '+data['response']['code']);
          $scope.toggleProgress = false;
          $mdToast.show(
             $mdToast.simple()
               .content("Error: "+data['response']['code'])
               .hideDelay(5000));
        });
        });
      }


    }
