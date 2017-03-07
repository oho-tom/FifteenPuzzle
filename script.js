(function(){
  'use strict';

  var canvas = document.getElementById('stage');
  var context;
  var image;
  var IMAGE_URL = '15puzzle.png';

  function drawPuzzle(){
    context.drawImage(image, 0, 0);
  }

  if(!canvas.getContext){
    alert('Canvas not supported ...');
    return;
  }
  context = canvas.getContext('2d');

  image = document.createElement('img');
  image.src = IMAGE_URL;
  image.addEventListener('load', function(){
    drawPuzzle();
  })
})();
