(function(){
	'use strict';

	var canvas = document.getElementById('stage');
	var context;
	var image;
	var IMAGE_URL = '15puzzle.png';

	var tiles = [];
	var ROW_COUNT = 4;
	var COL_COUNT = 4;
	var PIC_WIDTH = 280;
	var PIC_HEIGHT = 280;
	var TILE_WIDTH = PIC_WIDTH / COL_COUNT;
	var TILE_HEIGHT = PIC_HEIGHT / ROW_COUNT;

	var UDLR = [
		[0, -1],
		[0, 1],
		[-1, 0],
		[1, 0]
	];

	// シャッフルで動かす回数
	var moveCount = 2;

	function initTiles(){
		var row, col;
		for(row = 0; row < ROW_COUNT; row++){
			tiles[row] = [];
			for(col = 0; col < COL_COUNT; col++){
				tiles[row][col] = row*ROW_COUNT + col;
			}
		}
		// 右下のマスには空白を示す値を入れる
		tiles[ROW_COUNT-1][COL_COUNT-1] = -1;
	}

	function drawPuzzle(){
		var row, col;
		var dx, dy;
		var sx, sy;
		for(row = 0; row < ROW_COUNT; row++){
			for(col = 0; col < COL_COUNT; col++){
				dx = col * TILE_WIDTH;
				dy = row * TILE_HEIGHT;
				sx = (tiles[row][col] % COL_COUNT) * TILE_WIDTH;
				sy = Math.floor((tiles[row][col] / COL_COUNT)) * TILE_HEIGHT;

				// -1のマスは塗りつぶす
				if(tiles[row][col] === -1){
					context.fillStyle = '#eeeeee';
					context.fillRect(dx, dy , TILE_WIDTH, TILE_HEIGHT);
				}
				// それ以外のマスは画像を切り出して描画
				else {
					context.drawImage(image, sx, sy, TILE_WIDTH, TILE_HEIGHT, dx, dy, TILE_WIDTH, TILE_HEIGHT);
				}
			}
		}
	}

	// 終了判定
	function checkResult(){
		var row, col;
		for(row = 0; row < ROW_COUNT; row++){
			for(col = 0; col < COL_COUNT; col++){
				// 右下のマスまで走査したら終了
				if(row === ROW_COUNT - 1 && col === COL_COUNT - 1){
					return true;
				}
				// マスの数字が位置に応じた値かチェック
				if(tiles[row][col] !== COL_COUNT * row + col){
					return false;
				}
			}
		}
		return true;
	}

	// シャッフル処理
	function moveBlank(count){
		var blankRow, blankCol;
		var targetRow, targetCol;
		var targetPosition;

		blankRow = ROW_COUNT - 1;
		blankCol = COL_COUNT - 1;

		while (true) {
			targetPosition = Math.floor(Math.random() * UDLR.length);
			targetRow = blankRow + UDLR[targetPosition][1];
			targetCol = blankCol + UDLR[targetPosition][0];

			// ターゲットがマスの外なら処理をスキップ
			if(targetRow < 0 || targetRow >= ROW_COUNT){
				continue;
			}
			if(targetCol < 0 || targetCol >= COL_COUNT){
				continue;
			}

			// 値を入れ替え
			tiles[blankRow][blankCol] = tiles[targetRow][targetCol];
			tiles[targetRow][targetCol] = -1;
			blankRow = targetRow;
			blankCol = targetCol;

			// 再描画
			drawPuzzle();

			// 規定回数シャッフルしたら終了
			if(!--count){
				break;
			}
		}
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
		moveBlank(moveCount);
		drawPuzzle();
	})

	canvas.addEventListener('click', function(e) {
		var x, y;
		var rect;
		rect = e.target.getBoundingClientRect();
		x = e.clientX - rect.left;
		y = e.clientY - rect.top;
		var row, col;
		row = Math.floor(y / TILE_HEIGHT);
		col = Math.floor(x / TILE_WIDTH);
		var i;
		var targetRow, targetCol;

		// 空のタイルなら何もしない
		if(tiles[row][col] === -1){
			return;
		}
		// 空以外なら上下左右に空きがあるか調べる
		for(i = 0; i < UDLR.length; i++){
			targetRow = row + UDLR[i][1];
			targetCol = col + UDLR[i][0];
			// タイルからはみ出したらスキップ
			if(targetRow < 0 || targetRow >= ROW_COUNT){
				continue;
			}
			if(targetCol < 0 || targetCol >= COL_COUNT){
				continue;
			}

			// 空きが見つかった場合、数字を入れ替え、再描画し、ループを終了
			if(tiles[targetRow][targetCol] === -1){
				tiles[targetRow][targetCol] = tiles[row][col];
				tiles[row][col] = -1;
				drawPuzzle();
				// 終了判定
				if(checkResult()){
					alert('Game Clear');
				}
				break;
			}
		}
	});
})();
