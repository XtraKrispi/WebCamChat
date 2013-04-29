var controllers = angular.module('controllers', ['services', 'directives']);

app.controller('WebCamCtrl', ['$scope', 'socket', function($scope, socket){
	$scope.options = {};

	$scope.clients = [];

	socket.on('newdata', function(data){
		var id = data.id;

		var item = _.find($scope.clients, function(client){ return client.id == id; });
		if (item){
			item.imageData = data.imageData;
		} else {
			$scope.clients.push(data);			
		}
	});

	socket.on('disconnect', function(data){
		var index = _($scope.clients).indexOf(function(client){ return client.id == data.id });
		removeFromArray($scope.clients, index);
	});

	$scope.username = prompt("What's your name?");

	var removeFromArray = function(array, from, to) {
		if (array && array.length > 0){
			var rest = array.slice((to || from) + 1 || array.length);
			array.length = from < 0 ? array.length + from : from;
			return array.push.apply(array, rest);
		}
	};
}]);