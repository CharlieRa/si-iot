(function () {
    'use strict';
    angular
        .module('si')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var user;
        var service = {};
        var url = 'http://127.0.0.1:8888';
        service.getAll = getAll;
        service.getById = getById;
        service.getByUsername = getByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.getMe = getMe;
        service.setUser = setUser;
        service.getApiMe = getApiMe;

        return service;

        function setUser(aUser) {
          user = aUser;
        }

        function getMe() {
            return user;
        }

        function getApiMe() {
          return $http.get(url+'/api/me').then(handleSuccess, handleError('Error getting all users'));
        }

        function getAll() {
            return $http.get(url+'/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function getById(id) {
            return $http.get(url+'/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function getByUsername(username) {
            return $http.get(url+'/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
          // return $http.post(url+'/api/users', user).then(handleSuccess, handleError('Error creating user'));
            return $http.post(url+'/api/signup', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put(url+'/api/users/' + user._id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(url+'/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
