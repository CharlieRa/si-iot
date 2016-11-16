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
      // .state('main.perfil', {
      //   templateUrl: 'main/perfil/perfil.html',
      //   controller: 'perfilCtrl',
      //   authenticate: true
      // })
      // .state('main.feedbacks', {
      //   templateUrl: 'main/feedbacks/feedbacks.html',
      //   controller: 'feedbacksCtrl',
      //   authenticate: true
      // });
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
  .controller('mainCtrl', function ($scope, $state, $mdSidenav ,$mdDialog, $mdToast, $rootScope, $location) {

    $state.transitionTo('main.motes');

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
        name: 'Table',
        icon: 'view_module',
        sref: '.table'
      },
      {
        name: 'Table',
        icon: 'view_module',
        sref: '.table'
      },
      {
        name: 'Table',
        icon: 'view_module',
        sref: '.table'
      },
    ];

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
    $scope.openNotifications = function() {
      $mdSidenav('right').open()
    };
    $scope.closeNotifications = function() {
      $mdSidenav('right').close()
    };
  })
  .controller('ToastCtrl', function($scope, $mdToast, $state, $rootScope) {
    $scope.closeToast = function() {
      $mdToast.hide();
    };

    $scope.showActionToast = function() {
      $state.go('main.comments', {id: '5670caffc36b80f54793c8f5'});
      $mdToast.hide();
      console.log($rootScope.notifications);
    };

    $scope.getNotifications = function(userId)
    {
      if(userId === undefined)
        return false;
      else{
        $http.post('/api/notifications',{
          content : userId
        })
        .success(function(data, status, headers, config)
        {
          console.log(data);
          if(data.length == 0)
          {
            console.log("no hay notificaciones");
          }
        })
        .error(function(data, status, headers, config)
        {
          console.log("error al obtener notificaiones");
        });
      }
    };
  });
