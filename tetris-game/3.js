/* Modified by III M, 2023 */
var size, width, height, X=10, Y=20;
var level, lines, score, best=0;
var move;

var grid= [];
var current, next;
var state;
var ctx;

var colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];
// 16bit tetromino representation with rotations 
var pieces = [
 [0x0F00, 0x2222, 0x00F0, 0x4444], // I
 [0x44C0, 0x8E00, 0x6440, 0x0E20], // J
 [0x4460, 0x0E80, 0xC440, 0x2E00], // L
 [0x6600, 0x6600, 0x6600, 0x6600], // O
 [0x06C0, 0x8C40, 0x6C00, 0x4620], // S
 [0x0E40, 0x4C40, 0x4E00, 0x4640], // T
 [0x0C60, 0x4C80, 0xC600, 0x2640]  // Z
]; 

// help fun's 
function id(el) { return document.getElementById(el); }
function val(el) { return document.getElementById(el).value; }
function set(el, val) { return document.getElementById(el).innerHTML = val; };

//------------------------------------------------------------------
// draw fun's
//------------------------------------------------------------------
function drawRect(x,y,style)
{
	ctx.fillStyle = 'black';
	ctx.fillRect(x*size,y*size,size,size);

	if(style)
	{
		ctx.fillStyle = style;
		ctx.fillRect(x*size+1,y*size+1,size-1,size-1);
	}
} 

function drawBoard()
{
	var x,y;
	for(x=0; x<X; x++) 
		for(y=0; y<Y; y++)
			drawRect(x,y,grid[x][y]);
}

function drawCurrent()
{
	if(!current.piece) return;
	var b, x=0, y=0;
	for(b=0x8000; b>0; b = b>>1) {
		if(x+current.x>=0 && x+current.x<X && y+current.y>=0 && y+current.y<Y && (current.piece & b))
			drawRect(x+current.x, y+current.y, current.color);
		if (++x === 4) {
			x = 0;
			++y;
		}
    }
}

function drawNext()
{
	var b, x=0, y=0;
	for(b=0x8000; b>0; b = b>>1) {
		drawRect(x+10.7,y,(next.piece & b) ? next.color : 0);
		if (++x === 4) {
			x = 0;
			++y;
		}
    }
}

function drawLabel(name, value, x, y, style) 
{
	var fontsize = parseInt(size*0.7);
	ctx.font = "bold " + fontsize + "px Arial";
	ctx.fillStyle= style;
	ctx.textAlign = 'left';
	ctx.fillText(name + ": ",x,y);
	ctx.textAlign = 'right';
	ctx.fillText(value,x+fontsize*6,y);
} 

//------------------------------------------------------------------
// game fun's
//------------------------------------------------------------------

// check current piece collision with the board
function collision()
{
	var b, x=0, y=0;
	var x0 = current.x;
	var y0 = current.y;
	for(b = 0x8000; b>0; b = b>>1) {
		if(current.piece & b) {
			if((x0+x)<0 || (x0+x)>=X || (y0+y)<0 || (y0+y)>=Y || grid[x0+x][y0+y]!=0)
				return true;
		}
		if (++x === 4) {
			x = 0;
			++y;
		}
    }
	return false;
}

// add current piece to the board
function addCurrent()
{
	var x=0, y=0;
	for(b = 0x8000; b>0; b = b>>1) {
		if(current.piece & b)
			grid[x+current.x][y+current.y] = current.color;
		if (++x === 4) {
			x = 0;
			++y;
		}
    }
}

// remove full horizontal lines
function removeLine(y0) {
	var x, y;
    for(y=y0; y>=0; y--) {
        for(x=0; x<X; x++)
          grid[x][y]  = (y==0) ? 0 : grid[x][y-1]
    }
}
	
// remove full horizontal lines
function removeLines() {
	var x, y, full, n=0;
	for(y=Y; y>0; y--) {
      full = true;
      for(x=0; x<X ;x++) {
         if (!grid[x][y])
            full = false;
      }
      if (full) {
          removeLine(y);
          y++; //next line
          n++;
      }
    }
	if (n>0) {
		// add empty rows
		for(y=0; y<n; y++)
			for(x=0; x<X ;x++) 
				grid[x][y] = 0;
	}
	return n;
}

// rotate current piece
function rotateL() {
	current.rot++; 
	if(current.rot==4) current.rot = 0;
	current.piece = pieces[current.num][current.rot];
}

function rotateR() {
	current.rot--; 
	if(current.rot<0) current.rot = 3;
	current.piece = pieces[current.num][current.rot];
}


function randompiece()
{
	var p = {}
	p.num = Math.floor(Math.random()*7);
	p.rot = Math.floor(Math.random()*4);
	p.piece = pieces[p.num][p.rot];
	p.color = colors[p.num];
	p.x = X/2 - 2;
	p.y = 0;
	return p;
}

function applyMove()
{
	addCurrent();
	var n = removeLines();
	if(n) {
		lines += n;
		score += 100*Math.pow(2,n-1); // 100*2^(n-1)
		if(score > best) best = score;
	}
	current = next;
	if(collision()) {
		current = {};
		state = 'end';
	}
	else
		next = randompiece();
	update();
}

//------------------------------------------------------------------
// animation clock
//------------------------------------------------------------------
var lastLoop=0, fps_avg=0;
var t=0, time, step=1;
function frame()
{
	window.requestAnimationFrame(frame);
	
	// time elapse
    var thisLoop = new Date;
	if(lastLoop == 0) { lastLoop = thisLoop; return; }
    var dt = (thisLoop - lastLoop) / 1000.0; 
	lastLoop = thisLoop;

	// update state
	if(state!='end')
	{
	t += dt;
	time += dt;
	
	if(move=='left') { current.x--; if(collision()) current.x++;  move=''; }
	if(move=='right') { current.x++; if(collision()) current.x--;  move=''; }
	if(move=='rotate') { rotateL(); if(collision()) rotateR(); move=''; }
	if(move=='drop') { while(!collision()) current.y++; current.y--; applyMove(); move=''; }
//	if(move=='drop') { current.y++; if(collision()) { current.y--; applyMove(); move=''; } }

	if(t>step || move=='down') {
		current.y++;
		if(collision()) {
			current.y--;
			applyMove();
		}
		t = 0;
		move = '';	
	}
	}
	
	// draw
	ctx.clearRect(0, 0, width, width);	
	drawBoard();
	drawCurrent();
	drawNext();
	
	var x = 10.7*size, y=6*size;
	drawLabel("LINIE", lines, x, y, "gray");
	drawLabel("POZIOM", level, x, y+2*size, "gray");
	drawLabel("CZAS", time.toFixed(0), x, y+3*size, "gray");

}

//------------------------------------------------------------------
// api
//------------------------------------------------------------------
function showmessage(msg)
{
	set('message', msg);
	id('message-box').style.display = 'block';
	state = "end";
}

function update()
{
	set('score', score);	
	set('best', best);

	if (state=="end") {
	if(score && score == best)
			showmessage('You are the best. Try again!');
		else
			showmessage('Game over. Try again!');
	} 
}


window.addEventListener("keydown",function(e){
    switch(e.keyCode){
        case 37: move = 'left'; break;
        case 38: move = 'rotate'; break;
        case 39: move = 'right'; break;
        case 40: move = 'down';	break;      
		case 32: move = 'drop'; break;
    }
    switch(e.keyCode){
		case 37: case 38: case 39: case 40: case 32: e.preventDefault();
	}
});

var lastposX, lastposY, ismoving;
window.onload = function() {
	var el = document.getElementById('canvas');
	touchdetect(el, function(a){
		switch(a.mode){
			case  'touchstart':
				lastposX = a.x;
				lastposY = a.y;
				ismoving = false;
				break;
			case  'touchmove': 
				if(a.x - lastposX <= -size) { move ='left'; lastposX = a.x; ismoving = true; }
				if(a.x - lastposX >=  size) { move ='right'; lastposX = a.x; ismoving = true; }
				//console.log(a.x - lastposX); 
				break;	
			case  'touchend':
				if(!ismoving) {
					//if(a.y - lastposY <= -size) { move ='up'; lastposY = a.y; }
					if(a.y - lastposY >=  size) { move ='drop'; lastposY = a.y; }
					if(Math.abs(a.dx)<size/2 && Math.abs(a.dy)<size/2) { move ='rotate'; }
				}
				break;
		}
	});
};

function newgame()
{
	var style = window.getComputedStyle(document.getElementById("canvas"), null);
	width = parseInt(style.getPropertyValue("width"));
	height = parseInt(style.getPropertyValue("height"));
	size = height/20; 
	id('canvas').width = width;
	id('canvas').height = height;
	ctx = id('canvas').getContext("2d");
	score = 0;
	level = 1;
	lines = 0;
	time = 0;
	t = 0;
	current = randompiece();
	next = randompiece();

	id('message-box').style.display = 'none';
	state = 'play';
	// generate board
	for (var x=0; x<X; x++) {
		grid[x]= [];
		for (var y=0; y<Y; y++) {
			grid[x][y]= 0;
		}
	}
	update();		
}
