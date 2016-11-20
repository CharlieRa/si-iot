'use strict';

angular
  .module('si.main', ['ngMaterial', 'ngMessages', 'ui.router'])
  .config(function($stateProvider, $urlRouterProvider)
  {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'main/main.html',
        controller: 'mainCtrl',
        authenticate: true
      })
      .state('main.dashboard', {
        templateUrl: 'main/dashboard/dashboard.html',
        controller: 'dashboardCtrl',
        authenticate: true
      })
      .state('main.motes', {
        templateUrl: 'main/motes/motes.html',
        controller: 'motesCtrl',
        authenticate: true
      })
      .state('main.networks', {
        templateUrl: 'main/networks/networks.html',
        controller: 'networksCtrl',
        authenticate: true
      })
      .state('main.users', {
        templateUrl: 'main/users/users.html',
        controller: 'usersCtrl',
        authenticate: true
      })
      // .state('main.feedbacks', {
      //   templateUrl: 'main/feedbacks/feedbacks.html',
      //   controller: 'feedbacksCtrl',
      //   authenticate: true
      // });
      // $mdButtonProvider.disableWarnings();
      $urlRouterProvider.otherwise('main/dashboard');
  })
  .directive('scrollBottom', function ()
  {
    return {
      scope: {
        scrollBottom: "="
      },
      link: function (scope, element) {
        scope.$watchCollection('scrollBottom', function (newValue) {
          if (newValue)
          {
            $(element).scrollTop($(element)[0].scrollHeight);
          }
        });
      }
    }
  })
  .controller('mainCtrl', function ($scope, $state, $mdSidenav ,$mdDialog, $mdToast, $rootScope, $location, UserService) {
    UserService.getApiMe().then(function(response, err){
      $scope.user = response;
      // console.log($scope.user);
      if($scope.user.admin) {
        $scope.menuItems = [
          {
            name: 'Dashboard',
            icon: 'dashboard',
            sref: '.dashboard'
          },
          {
            name: 'Redes',
            icon: 'timeline',
            sref: '.networks'
          },
          {
            name: 'Motes',
            icon: 'view_module',
            sref: '.motes'
          },
          {
            name: 'Usuarios',
            icon: 'person',
            sref: '.users'
          }
        ];
      }else{
        $scope.menuItems = [
          {
            name: 'Dashboard',
            icon: 'dashboard',
            sref: '.dashboard'
          },
          {
            name: 'Motes',
            icon: 'view_module',
            sref: '.motes'
          },
        ];
      }
    });

    // $state.transitionTo('main.motes');
    $state.transitionTo('main.dashboard');

    /**/
    $scope.selectItem = function(item) {
      $mdSidenav('left').close();
    }

    $scope.notificationToast = function() {
      $mdToast.show({
        controller: 'ToastCtrl',
        template:'<md-toast class="pointer" style="background-color: #16a085;"> \
                    <md-button ng-click="showActionToast()">\
                      Nuevo comentario en uno de tus Post!\
                    </md-button>\
                    <md-button ng-click="closeToast()">\
                      Cerrar\
                    </md-button>\
                  </md-toast>',
        hideDelay: 2000,
        position: 'top right'
      });
    };

    $scope.logout = function() {
      $location.path('/logout');
    };
    $scope.si = function() {
      $state.transitionTo('main.networks');
    };
    $scope.isActive = function(route) {
      return route === $location.path();
    };
    $scope.showSideNav = function(){
      $mdSidenav('left').open()
    }
    $scope.closeSideNav = function(){
      $mdSidenav('left').close()
    }
    $scope.go = function(path){
      $state.transitionTo(path);
    }
  })
