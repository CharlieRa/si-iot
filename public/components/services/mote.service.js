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
        service.sendCommand = sendCommand;
        service.putCommand = putCommand;

        return service;

        function GetAll() {
            return $http.get(url+'/api/motes').then(handleSuccess, handleError('Error getting all motes'));
        }

        function GetById(id) {
            return $http.get(url+'/api/motes/' + id).then(handleSuccess, handleError('Error getting mote by id'));
        }

        function GetByIp(ipv6) {
            return $http.get(url+'/api/motes/' + ipv6).then(handleSuccess, handleError('Error getting mote by motename'));
        }

        function Create(mote) {
            return $http.post(url+'/api/motes', mote).then(handleSuccess, handleError('Error creating mote'));
        }

        function Update(mote) {
            return $http.put(url+'/api/motes/' + mote.id, mote).then(handleSuccess, handleError('Error updating mote'));
        }

        function Delete(id) {
            return $http.delete(url+'/api/motes/' + id).then(handleSuccess, handleError('Error deleting mote'));
        }

        function getAllCommands(moteIp) {
            return $http.get(url+'/api/motes/'+moteIp+'/commands/').then(handleSuccess, handleError('Error al obtener comandos'));
        }

        function sendCommand(moteIp, command) {
          return $http.get(url+'/api/motes/'+moteIp+'/commands/'+command).then(handleSuccess, handleError('Error al obtener la respuesta del comando'));
        }

        function sendCommand(moteIp, command) {
          return $http.get(url+'/api/motes/'+moteIp+'/commands/'+command).then(handleSuccess, handleError('Error al obtener la respuesta del comando'));
        }

        function putCommand(moteIp, command) {
          return $http.put(url+'/api/motes/'+moteIp+'/commands/'+command).then(handleSuccess, handleError('Error al obtener la respuesta del comando'));
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
