(function () {
    'use strict';
    angular
        .module('si')
        .factory('NetworkService', NetworkService);

    NetworkService.$inject = ['$http'];
    function NetworkService($http) {
        var service = {};
        var url = 'http://127.0.0.1:8888';
        service.getAll = GetAll;
        service.getById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.getByUsers = getByUsers;

        return service;

        function GetAll() {
            return $http.get(url+'/api/networks').then(handleSuccess, handleError('Error getting all networks'));
        }

        function getByUsers(user) {
            return $http.get(url+'/api/networks').then(handleSuccess, handleError('Error getting all networks'));
        }

        function GetById(id) {
            return $http.get(url+'/api/networks/' + id).then(handleSuccess, handleError('Error getting network by id'));
        }

        function Create(network) {
          console.log(network);
            return $http.post(url+'/api/networks', network).then(handleSuccess, handleError('Error creating network'));
        }

        function Update(network) {
            return $http.put(url+'/api/networks/' + network.id, network).then(handleSuccess, handleError('Error updating network'));
        }

        function Delete(id) {
            return $http.delete(url+'/api/networks/' + id).then(handleSuccess, handleError('Error deleting network'));
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
