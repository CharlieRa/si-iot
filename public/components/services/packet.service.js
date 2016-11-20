(function () {
    'use strict';
    angular
        .module('si')
        .factory('PacketService', PacketService);

    PacketService.$inject = ['$http'];
    function PacketService($http) {
        var service = {};
        var url = 'http://127.0.0.1:8888';
        service.getAll = GetAll;
        service.getById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.Start = Start;

        return service;

        function GetAll() {
            return $http.get(url+'/api/packets').then(handleSuccess, handleError('Error getting all packets'));
        }

        function Start() {
            return $http.get(url+'/api/packets/start').then(handleSuccess, handleError('Error getting all packets'));
        }


        function GetById(id) {
            return $http.get(url+'/api/packets/' + id).then(handleSuccess, handleError('Error getting network by id'));
        }

        function Create(network) {
          return $http.post(url+'/api/packets', network).then(handleSuccess, handleError('Error creating network'));
        }

        function Update(network) {
            return $http.put(url+'/api/packets/' + network.id, network).then(handleSuccess, handleError('Error updating network'));
        }

        function Delete(id) {
            return $http.delete(url+'/api/packets/' + id).then(handleSuccess, handleError('Error deleting network'));
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
