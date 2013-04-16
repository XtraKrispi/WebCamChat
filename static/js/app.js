navigator.getUserMedia ||
	(navigator.getUserMedia = navigator.mozGetUserMedia ||
	 navigator.webkitGetUserMedia || navigator.msGetUserMedia);

window.requestAnimationFrame ||
	(window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback){
			window.setTimeout(callback, 1000/60);
		});

var app = angular.module('webcamApp', ['controllers']);

			