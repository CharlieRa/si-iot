'use strict';

angular
  .module('si',[
    'ui.router',
    'si.login',
    'si.logout',
    'si.main',
    'si.motes',
    'ngCookies',
    'ngResource',
    'satellizer',
    'ngAnimate'])
    // .config(["$authProvider", function($authProvider, $urlRouterProvider, $stateProvider)
  .config(function($urlRouterProvider, $stateProvider, $authProvider)
  {
    $authProvider.authHeader = 'x-access-token';
    $authProvider.httpInterceptor = true; // Add Authorization header to HTTP request
    $authProvider.loginUrl = 'http://127.0.0.1:8888/api/auth';
    $authProvider.signupUrl = "http://127.0.0.1:8888/api/signup";
    $urlRouterProvider.otherwise('/login');
    // $httpProvider.interceptors.push('authInterceptor');
  })
  .run(function ($rootScope, $auth, $state, $location) {
    console.log("hola");
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

      // if yes and if this user is not logged in, redirect him to login page
      console.log(requiredLogin);
      console.log($auth.isAuthenticated());

      if (requiredLogin && !$auth.isAuthenticated()) {
        event.preventDefault();
        $state.go('login');
      }
    });
  });
