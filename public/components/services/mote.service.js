(function () {
    'use strict';
    angular
        .module('si')
        .factory('MoteService', MoteService);

    MoteService.$inject = ['$http'];
    function MoteService($http) {
        var service = {};
        var url = 'http://127.0.0.1:8888';
        service.getAll = GetAll;
        service.getById = GetById;
        service.GetByIp = GetByIp;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.getAllCommands = getAllCommands;
        return service;

        function GetAll() {
            return $http.get(url+'/api/motes').then(handleSuccess, handleError('Error getting all motes'));
        }

        function GetById(id) {
            return $http.get(url+'/api/motes/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByIp(ipv6) {
            return $http.get(url+'/api/motes/' + ipv6).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post(url+'/api/motes', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put(url+'/api/motes/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(url+'/api/motes/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function getAllCommands(moteIp) {
            return $http.get(url+'/api/commands/'+moteIp).then(handleSuccess, handleError('Error getting all motes'));
        }

        function getCommand(moteIp, command) {
            return $http.get(url+'/api/commands/'+moteIp).then(handleSuccess, handleError('Error getting all motes'));
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
