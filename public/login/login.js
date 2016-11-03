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

  function loginCtrl ($scope, $auth, $state)
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
      console.log($scope.user);
      if(!angular.isDefined($scope.user)){
        return false;
      }

      if(!$scope.user.username && !$scope.user.password) {
      }else{
        console.log($scope.user);
        $scope.loading = true;
        $scope.formInput = true;
        $auth.login($scope.user).then(function(data) {
          console.log(data);
          $state.go('main');
        })
        .catch(function (response) {
          console.log("error response", response);
        });
      }
    }
  }
