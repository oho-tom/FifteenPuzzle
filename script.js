(function(){
	'use strict';

	var canvas = document.getElementById('stage');
	var context;
	var image;
	var IMAGE_URL = '15puzzle.png';

	var tiles = [];
	var ROW_COUNT = 4;
	var COL_COUNT = 4;

	function initTiles(){
		var row, col;
		for(row = 0; row < ROW_COUNT; row++){
			tiles[row] = [];
			for(col = 0; col < COL_COUNT; col++){
				tiles[row][col] = row*ROW_COUNT + col;
			}
		}
	}

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
		initTiles();
		drawPuzzle();
	})
})();
