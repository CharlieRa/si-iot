  'use strict';

  angular.module('si.users', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate', 'md.data.table'])
    .controller('usersCtrl', userCtrl);

    /**
    * Controller de Messages
    **/
    function userCtrl($scope, $http, $timeout, $location, $mdDialog, $mdToast, $rootScope, $filter, UserService)
    {
      $scope.usersSelected = [];
      $scope.users = [];
      $scope.toggle = [{
        si: 'true',
        general: 'false',
        error: 'false',
        progress: 'true',
        commands: 'false',
        users: 'true'
      }];

      $scope.load = function () {
        UserService.getAll().then(function(response){
          if(response['success'] === false) {
            $mdToast.show(
               $mdToast.simple()
                 .content('Error al intentar para obtener la información del servidor.')
                 .hideDelay(8000));
          }else{
            console.log(response);

            $scope.users = response;
          }
          console.log(response);
          $scope.toggle.users = false;
        });
      };

      /**
      * Funcion encargada en enviar nuevos mensajes escritos por el usuario al servidor
      */
      $scope.addNewUser = function(ev){
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          controller: newUserController,
          controllerAs: 'ctrl',
          clickOutsideToClose: true,
          locals:{
            users: $scope.users
          },
          templateUrl:'main/users/user.dialog.tmpl.html',
          targetEvent: ev,
        });
      }
      function newUserController($scope, $mdDialog, $mdToast, $http, users) {
        $scope.users = users;
        $scope.toggleProgress = false;
        $scope.cancelDialogAddUser = function() {
          $mdDialog.cancel();
        };

        $scope.createUser = function() {
          $scope.toggleProgress = false;
          console.log($scope.newUser);

          if($scope.newUser) {
            $scope.toggleProgress = true;
            UserService.Create($scope.newUser).then(function(response) {
              $mdToast.show(
                $mdToast.simple()
                .content(response['msg'])
                .hideDelay(5000));
                $mdDialog.cancel();
            });
            console.log($scope.users);
            $scope.users.push($scope.newUser);
          }else{
            console.log("malo");
          }
        }
      };

      /**
      * Funcion que elimina usuarios
      */
      $scope.deleteUser = function(ev) {

        if($scope.usersSelected.length == 0 || $scope.usersSelected.length > 1) {
          $mdToast.show(
            $mdToast.simple()
            .content("Solo puedes eliminar un usuario a la vez")
            .hideDelay(5000));
            $mdDialog.cancel();
          return;
        }
        var confirm = $mdDialog.confirm()
        .title('Estas seguro que deseas eliminar al usuario '+$scope.usersSelected[0].username+' ?')
        // .textContent('All of the banks have agreed to forgive you your debts.')
        .ariaLabel('Eliminar Usuario')
        .targetEvent(ev)
        .ok('Eliminar usuario')
        .cancel('Cancelar');

        $mdDialog.show(confirm).then(function() {
          UserService.Delete($scope.usersSelected[0]._id).then(function(response){
            console.log(response);
            var indice = $scope.users.indexOf($scope.usersSelected[0]);
            $scope.users.splice(indice, 1);
            $scope.usersSelected = [];
            $mdToast.show(
              $mdToast.simple()
              .content("Usuario eliminado exitosamente!.")
              .hideDelay(5000));
          });
        });
      }

      /**
      * Funcion que edita un usuario
      */
      $scope.editUser = function(ev) {
        console.log($scope.usersSelected.length);
        if($scope.usersSelected.length == 0 || $scope.usersSelected.length > 1) {
          $mdToast.show(
            $mdToast.simple()
            .content("Solo puedes editar un usuario a la vez")
            .hideDelay(5000));
            $mdDialog.cancel();
          return;
        }

        var indice = $scope.users.indexOf($scope.usersSelected[0]);
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          controller: editUserController,
          controllerAs: 'ctrl',
          clickOutsideToClose: true,
          locals:{
            users: $scope.users,
            indice: indice
          },
          templateUrl:'main/users/user.dialog.tmpl.html',
          targetEvent: ev,
        });
      function editUserController($scope, $mdDialog, $mdToast, $http, users, indice) {
        $scope.users = users;
        $scope.newUser = $scope.users[indice];
        // $scope.indice = inde
        $scope.toggleProgress = false;
        $scope.cancelDialogAddUser = function() {
          $mdDialog.cancel();
        };

        $scope.createUser = function() {
          $scope.toggleProgress = false;
          console.log($scope.newUser);

          if($scope.newUser) {
            $scope.toggleProgress = true;
            UserService.Update($scope.newUser).then(function(response) {
              $mdToast.show(
                $mdToast.simple()
                .content(response['msg'])
                .hideDelay(5000));
                $mdDialog.cancel();
            });
            console.log($scope.users);
          }else{
            console.log("malo");
          }
        }
      };
    }
  }
