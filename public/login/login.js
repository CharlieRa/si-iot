'use strict';

angular
  .module('si.login', ['ngMaterial', 'ngMessages', 'ui.router', 'ngAnimate', 'satellizer'])
  .config(function($stateProvider)
  {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'login/login.html',
        controller: 'loginCtrl'
      })
  })
  .controller('loginCtrl', loginCtrl);

  function loginCtrl ($scope, $auth, $state, UserService, $mdToast)
  {
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };
    $scope.loading = false;
    $scope.formInput = false;
    $scope.reset = function() {
      $scope.loginForm.$setPristine();
      $scope.loginForm.$setUntouched();
      $scope.user.username = $scope.user.password = '';
    }

    $scope.login = function() {
      if(!angular.isDefined($scope.user)){
        return false;
      }

      if(!$scope.user.username && !$scope.user.password) {
      }else{
        $scope.loading = true;
        $scope.formInput = true;
        $auth.login($scope.user).then(function(data) {
          UserService.setUser($auth.getPayload()._doc);
          $state.go('main');
        })
        .catch(function (response) {
          console.log("error response", response);
          $scope.loading = false;
          $scope.formInput = false;
          $mdToast.show(
            $mdToast.simple()
            .content("Crendeciales incorrectas.")
            .hideDelay(5000));
        });
      }
    }
  }
