var directives = angular.module('directives', ['services']);

directives.directive('webcamCanvas', function(){
	return {
		restrict: 'A',
		scope: {
			data: '=imageData',
			id: '=socketId'
		},
		link: function(scope, elem, attrs){
			scope.$watch('data', function(newValue, oldValue){
				var bytearray = new Uint8Array(newValue);
				var context = elem[0].getContext('2d');
				var imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
	 
	           	var imgdatalen = imageData.data.length;
	 			var j = 0;
	          	for(var i=0;i<imgdatalen;i += 4)
	          	{
	          	    imageData.data[i] = bytearray[j++];
	          	    imageData.data[i+1] = bytearray[j++];
	          	    imageData.data[i+2] = bytearray[j++];
	          	    imageData.data[i+3] = 255;
	          	} 

				context.putImageData(imageData, 0, 0);

			});

			elem.attr('id', scope.id)
		}
	}
});

directives.directive('mywebcam', ['socket', function(socket){
	return {
		retrict: 'A',
		scope: {
			width: '@width',
			height: '@height'
		},
		template: '<video id="myVideo"></video><canvas id="myFeed" width="{{width}}" height="{{height}}"></canvas><canvas id="myDisplay" width="64" height="48"></canvas>',
		link: function(scope, elem, attrs){
			var video = elem.find('video')[0];
			var feed = elem.find('#myFeed')[0];
			var display = elem.find('#myDisplay')[0];
			var displayContext = display.getContext('2d');
			var feedContext = feed.getContext('2d');

			if (navigator.getUserMedia){
				navigator.getUserMedia({
					video: true,
					audio: false
				}, onSuccess, function(){});
				// do something
			} else {
				alert('webRTC is not supported in this browser. You can only watch');
			}

			function onSuccess(stream){
				video.autoplay = true;

				var videoSource;

				if (window.webkitURL){
					videoSource = window.webkitURL.createObjectURL(stream);
				} else {
					videoSource = stream;
				}

				video.src = videoSource;

				streamFeed();
			}

			function streamFeed(){
				//requestAnimationFrame(streamFeed);
				//displayContext.clearRect(0, 0, display.width, display.height);
				feedContext.drawImage(video, 0, 0, feed.width, feed.height);

				var imgData = feedContext.getImageData(0, 0, feed.width, feed.height);

			    var canvaspixelarray = imgData.data; 
 
     			var canvaspixellen = canvaspixelarray.length;
     			var withoutAlpha = feed.width * feed.height * 3;
     			var bytearray = new Uint8Array(withoutAlpha);
 				var j = 0;
			    for (var i=0;i<canvaspixellen;i += 4) {
			    	bytearray[j++] = canvaspixelarray[i];
			    	bytearray[j++] = canvaspixelarray[i+1];
			    	bytearray[j++] = canvaspixelarray[i+2];
			    }

				socket.emit('senddata', {imageData: bytearray});

				//displayContext.putImageData(imgData, 0, 0);
				setTimeout(function(){ streamFeed(); }, 1000/15);
			}
		}
	}
}]);