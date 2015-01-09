//var module = angular.module('socket.io', []);
machine.factory('socket', function(){
  var socket = io.connect( 'http://localhost:8888' );
  return socket;  
});
