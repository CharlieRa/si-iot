'use strict';

angular
  .module('si',[
    'ui.router',
    'si.login',
    'si.logout',
    'si.main',
    'si.dashboard',
    'si.users',
    'si.motes',
    'si.networks',
    'ngCookies',
    'ngResource',
    'satellizer',
    'ngAnimate'])
    // .config(["$authProvider", function($authProvider, $urlRouterProvider, $stateProvider)
  .config(function($urlRouterProvider, $stateProvider, $authProvider, $mdThemingProvider)
  {
    $authProvider.authHeader = 'x-access-token';
    $authProvider.httpInterceptor = true; // Add Authorization header to HTTP request
    $authProvider.loginUrl = 'http://127.0.0.1:8888/api/auth';
    $authProvider.signupUrl = "http://127.0.0.1:8888/api/signup";
    $urlRouterProvider.otherwise('/login');

    $mdThemingProvider
      .theme('default')
        .primaryPalette('deep-purple', {
          'default': '900'
        })
        .accentPalette('teal', {
          'default': '500'
        })
        .warnPalette('defaultPrimary');

    $mdThemingProvider.theme('dark', 'default')
      .primaryPalette('defaultPrimary')
      .dark();

    $mdThemingProvider.theme('grey', 'default')
      .primaryPalette('grey');

    $mdThemingProvider.theme('custom', 'default')
      .primaryPalette('defaultPrimary', {
        'hue-1': '50'
    });

    $mdThemingProvider.definePalette('defaultPrimary', {
      '50':  '#FFFFFF',
      '100': '#65294b',
      '200': '#E75753',
      '300': '#E75753',
      '400': '#E75753',
      '500': '#E75753',
      '600': '#E75753',
      '700': '#E75753',
      '800': '#E75753',
      '900': '#E75753',
      'A100': '#E75753',
      'A200': '#E75753',
      'A400': '#E75753',
      'A700': '#E75753'
    });
  })
  .run(function ($rootScope, $auth, $state, $location) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart',  function (event, next) {
      if($auth.isAuthenticated()){
        // $state.go('/');
        // $urlRouterProvider.otherwise('/');
        $location.path('/');
        // $state.transitionTo('main.motes');
        return;
      }
      var requiredLogin = false;
      // check if this state need login
      if (next.authenticate)
        requiredLogin = true;

      if (requiredLogin && !$auth.isAuthenticated()) {
        event.preventDefault();
        $state.go('login');
      }
    });
  });
