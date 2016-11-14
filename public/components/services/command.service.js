(function () {
    'use strict';
    angular
        .module('si')
        .factory('CommandService', CommandService);

    CommandService.$inject = ['$http'];
    function CommandService($http) {
        var service = {};
        var url = 'http://127.0.0.1:8888';
        service.GetAll = GetAll;
        // service.GetById = GetById;
        service.GetByCommand = GetByCommand;
        // service.Create = Create;
        // service.Update = Update;
        // service.Delete = Delete;

        return service;

        function GetAll(moteIp) {
            return $http.get(url+'/api/commands/'+moteIp).then(handleSuccess, handleError('Error getting all commands'));
        }

        // function GetById(id) {
        //     return $http.get(url+'/api/commands/' + id).then(handleSuccess, handleError('Error getting user by id'));
        // }

        function GetByCommand(command) {
            return $http.get(url+'/api/commands/'+command).then(handleSuccess, handleError('Error getting command'));
        }

        // function Create(user) {
        //     return $http.post(url+'/api/commands', user).then(handleSuccess, handleError('Error creating user'));
        // }
        //
        // function Update(user) {
        //     return $http.put(url+'/api/commands/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        // }
        //
        // function Delete(id) {
        //     return $http.delete(url+'/api/commands/' + id).then(handleSuccess, handleError('Error deleting user'));
        // }

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
