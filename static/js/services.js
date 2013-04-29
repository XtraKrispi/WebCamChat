var services = angular.module('services', []);

app.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect(null, { rememberTransport: false});
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}])
.factory('imageManipulation', [function(){
  return {
    invertImage: function(data){
      for (var i = 0, l = data.length; i < l; i += 4){
        data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];
      }

      return data;
    },

    flipImage: function(data){
      var pixels = this.getPixelData(data);

      pixels.reverse();


      for (var i = 0; i < pixels.length; i++){
        var pixel = pixels[i];

        for (var j = 0; j < pixel.length; j++){
          data[(i*4)+j] = pixel[j];
        }
      }

      return data;
    },

    getPixelData: function(data){
      var pixels = [];
      for (var i = 0; i < data.length; i += 4){
        var pixel = [];
        pixel.push(data[i]);
        pixel.push(data[i + 1]);
        pixel.push(data[i + 2]);
        pixel.push(data[i + 3]);

        pixels.push(pixel);
      }

      return pixels;
    },

    pushPixel: function (point, data){
      data[data.length] = point;
    },

    findPixels: function(colorFrom, data, colorTo, delta){
      var pixels = this.getPixelData(data);
      delta = delta || 50;
      for (var i = 0; i < pixels.length; i++){
        var pixel = pixels[i];

        var lowerRed = pixel[0] - delta < 0 ? 0 : pixel[0] - delta;
        var upperRed = pixel[0] + delta > 255 ? 255 : pixel[0] + delta;

        var lowerGreen = pixel[1] - delta < 0 ? 0 : pixel[1] - delta;
        var upperGreen = pixel[1] + delta > 255 ? 255 : pixel[1] + delta;

        var lowerBlue = pixel[2] - delta < 0 ? 0 : pixel[2] - delta;
        var upperBlue = pixel[2] + delta > 255 ? 255 : pixel[2] + delta;
        if (
            colorFrom[0] >= lowerRed && colorFrom[0] <= upperRed 
          &&  colorFrom[1] >= lowerGreen && colorFrom[1] <= upperGreen 
          &&  colorFrom[2] >= lowerBlue && colorFrom[2] <= upperBlue)
        {
          var pixelStart = i * 3;

          data[pixelStart] = colorTo[0];
          data[pixelStart+1] = colorTo[1];
          data[pixelStart+2] = colorTo[2];
          data[pixelStart+3] = colorTo[3];
        }
      }

      return data;
    },

    convertRGBAToHex: function (color){
      var r = color[0].toString(16);
      var g = color[1].toString(16);
      var b = color[2].toString(16);
      var a = color[3].toString(16);

      return r+g+b+a;
    }
  }
}]);