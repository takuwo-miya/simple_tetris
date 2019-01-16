//テトリ・ミノの形
var mino_shapes = [
  [
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,1,0],
      [0,0,1,0],
      [0,0,1,0],
      [0,0,1,0]
    ]
  ],
  [
    [
      [0,0,0,0],
      [0,2,2,0],
      [0,2,2,0],
      [0,0,0,0]
    ]
  ],
  [
    [
      [0,0,0,0],
      [0,3,3,0],
      [3,3,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [3,0,0,0],
      [3,3,0,0],
      [0,3,0,0]
    ]
  ],
  [
    [
      [0,0,0,0],
      [4,4,0,0],
      [0,4,4,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,4,0,0],
      [4,4,0,0],
      [4,0,0,0]
    ]
  ],
  [
    [
      [0,0,0,0],
      [5,0,0,0],
      [5,5,5,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,5,5,0],
      [0,5,0,0],
      [0,5,0,0]
    ],
    [
      [0,0,0,0],
      [0,0,0,0],
      [5,5,5,0],
      [0,0,5,0]
    ],
    [
      [0,0,0,0],
      [0,5,0,0],
      [0,5,0,0],
      [5,5,0,0]
    ]
  ],
  [
    [
      [0,0,0,0],
      [0,0,6,0],
      [6,6,6,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,6,0,0],
      [0,6,0,0],
      [0,6,6,0]
    ],
    [
      [0,0,0,0],
      [0,0,0,0],
      [6,6,6,0],
      [6,0,0,0]
    ],
    [
      [0,0,0,0],
      [6,6,0,0],
      [0,6,0,0],
      [0,6,0,0]
    ]
  ],
  [
    [
      [0,0,0,0],
      [0,7,0,0],
      [7,7,7,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,7,0,0],
      [0,7,7,0],
      [0,7,0,0]
    ],
    [
      [0,0,0,0],
      [0,0,0,0],
      [7,7,7,0],
      [0,7,0,0]
    ],
    [
      [0,0,0,0],
      [0,7,0,0],
      [7,7,0,0],
      [0,7,0,0]
    ]
  ]
];
var shift = 8;
//テトリ・ミノの生成
var mino = creat_mino();

function creat_mino() {
    id = Math.floor(Math.random()*mino_shapes.length);
    return mino_shapes[id][0];
}
//盤面の生成
var field = [];
var Field = (function(x,y){
      while (y--) {
        field.push(new Array(x).fill(0))
      }
}(12,20));

for (let i = 0; i < 20; i++) {
    field[i][0] = -1;
    field[i][11] = -1;
}
for (let p = 0; p < 12; p++) {
    field[19][p]  = -1;
}

var box_bfr = [];
var Box_bfr = (function(x,y) {
  while (y--) {
    box_bfr.push(new Array(x).fill(0));
  }
}(4,4));

var player = {
    pos: {x: 4, y: 0},
    mino: mino
}

function jugde() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (mino[y][x] !== 0 &&
               (field[y + player.pos.y] &&
                field[y + player.pos.y][x + player.pos.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function clearLine() {
    let new_line = [-1,0,0,0,0,0,0,0,0,0,0,-1];
    for (let y = 0; y < 19; y++) {
     line = true;
      for (let x = 1; x < 11; x++) {
         if (field[y][x] === 0) {
          line = false;
      }
    }
    if (line) {
      field.splice(y,1);
      field.unshift(new_line);
    }
  }
}

function drop_mino() {
  player.pos.y++;
    if (jugde()) {
      player.pos.y--;
      for (let y = 0; y < mino.length; y++) {
          for (let x = 0; x < mino[y].length; x++) {
            if(mino[y][x] !== 0)
            field[y + player.pos.y][x + player.pos.x] = mino[y][x];
        }
    }
      clearLine();
      player.pos.x = 4;
      player.pos.y = 0;
      mino = creat_mino();
      shift = 8;
    }
}

function rotate(){
  box_bfr = mino;
  ++shift;
    mino = mino_shapes[id][shift%mino_shapes[id].length];

    if (jugde()) {
      for(let i = 0; i < 4; i++){
          for(let j = 0; j < 4; j++){
              mino[i][j] = box_bfr[i][j];
            }
        }
    }
}

function draw_mino() {
    var canvas = document.getElementById("cvs");
    var c = canvas.getContext("2d");
    canvas.setAttribute("tabindex",0);

    var cell = 0.9;

    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);

    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            if (field[y][x] == -1) {
                c.fillStyle = 'white';
                c.fillRect(x,y,cell,cell);
            }
            if (field[y][x] == 1) {
                c.fillStyle = '#00FFFF';
                c.fillRect(x,y,cell,cell);
            }
            if (field[y][x] == 2) {
                c.fillStyle = 'yellow';
                c.fillRect(x,y,cell,cell);
            }
            if (field[y][x] == 3) {
                c.fillStyle = 'green';
                c.fillRect(x,y,cell,cell);
            }
            if (field[y][x] == 4) {
                c.fillStyle = 'red';
                c.fillRect(x,y,cell,cell);
            }
            if (field[y][x] == 5) {
                c.fillStyle = 'blue';
                c.fillRect(x,y,cell,cell);
            }
            if (field[y][x] == 6) {
                c.fillStyle = '#FF6600';
                c.fillRect(x,y,cell,cell);
            }
            if (field[y][x] == 7) {
                c.fillStyle = 'purple';
                c.fillRect(x,y,cell,cell);
            }
            }
        }


    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (mino[y][x] == 1) {
              c.fillStyle = '#00FFFF';
              c.fillRect(x + player.pos.x, y + player.pos.y,cell,cell);
          }
          if (mino[y][x] == 2) {
              c.fillStyle = 'yellow';
              c.fillRect(x + player.pos.x, y + player.pos.y,cell,cell);
          }
          if (mino[y][x] == 3) {
              c.fillStyle = 'green';
              c.fillRect(x + player.pos.x, y + player.pos.y,cell,cell);
          }
          if (mino[y][x] == 4) {
              c.fillStyle = 'red';
              c.fillRect(x + player.pos.x, y + player.pos.y,cell,cell);
          }
          if (mino[y][x] == 5) {
              c.fillStyle = 'blue';
              c.fillRect(x + player.pos.x, y + player.pos.y,cell,cell);
          }
          if (mino[y][x] == 6) {
              c.fillStyle = '#FF6600';
              c.fillRect(x + player.pos.x, y + player.pos.y,cell,cell);
          }
          if (mino[y][x] == 7) {
              c.fillStyle = 'purple';
              c.fillRect(x + player.pos.x, y + player.pos.y,cell,cell);
          }
        }

    }
}

//キーイベント
function key(e){

    var key = e.keyCode;
    switch (key) {
    case 37:
      player.pos.x--;
      if (jugde()) {
       player.pos.x++;
      }
      break;

    case 38:
      rotate();
      break;

    case 39:
      player.pos.x++;
      if (jugde()) {
        player.pos.x--;
      }
      break;

  }
}

function main_loop() {
  setInterval(drop_mino,500);
  setInterval(draw_mino,100);
}

window.onload = function() {
    var canvas = document.getElementById("cvs");
    var c = canvas.getContext("2d");
    canvas.addEventListener("keydown",key,false);
    c.scale(25,25);
    main_loop();
}
