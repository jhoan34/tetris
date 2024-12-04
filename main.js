import './style.css'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const BLOCK_SIZE = 30
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

let score = 0

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT
ctx.scale(BLOCK_SIZE, BLOCK_SIZE)

const board = [ 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,0,0,1,1,1,1],
]

const piece = {
  position : {x: 5 , y: 5},
  shape : [
    [1,1],
    [1,1],
  ]
}

const PIECES = [
  [
    [1,1],
    [1,1],
  ],
  [
    [1,1,1,1], 
  ],
  [
    [0,1,0],
    [1,1,1],
  ],
  [
    [1,1, 0],
    [0,1,1],
  ],
  [
    [1,0],
    [1,0],
    [1,1],
  ]

]


/*
function update() {
  draw()
  window.requestAnimationFrame(update)
}
*/
let dropCounter = 0
let lastTime = 0
function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time
  dropCounter += deltaTime
  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0
    if (checkCollisions()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
  draw()
  window.requestAnimationFrame(update)
  
}


function draw() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        ctx.fillStyle = "yellow"
        ctx.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        ctx.fillStyle = "red"
        ctx.fillRect(piece.position.x + x, piece.position.y + y, 1, 1)
      }
    })
  })
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') {
    piece.position.x--
    if (checkCollisions()) {
      piece.position.x++
      console.log('Collision detected: ', checkCollisions())
    }

  } else if (e.code === 'ArrowRight') {
    piece.position.x++
    if (checkCollisions()) {
      piece.position.x--
      console.log('Collision detected: ', checkCollisions())
    }

  } else if (e.code === 'ArrowDown') {
    piece.position.y++
    if (checkCollisions()) {
      piece.position.y--
      console.log('Collision detected: ', checkCollisions())
      solidifyPiece()
      removeRows()
    }

  }
  if (e.code === 'ArrowUp') {
    const rotated = []
    for (let y = 0; y < piece.shape[0].length; y++) {
      const row = []
      for (let x = piece.shape.length - 1; x >= 0 ; x--) {
        console.log(piece.shape[x][y])
        row.push(piece.shape[x][y])
      }
      console.log(row)
      rotated.push(row)

    }
    piece.shape = rotated
  }
})

function checkCollisions() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[piece.position.y + y]?.[piece.position.x + x] !== 0
      )
    })
  })
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        console.log(piece.position.x)
        console.log(board[piece.position.y + y][52])
        board[piece.position.y + y][piece.position.x + x] = 1 
      }
    })
  })
   

  piece.position.x = Math.floor( BOARD_WIDTH / 2 - 2 )
  piece.position.y = 0
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  if (checkCollisions()) {
    window.alert('GAME OVER')
    board.forEach((row, y) => {
      row.fill(0)
    })
    
    piece.position.x = Math.floor( BOARD_WIDTH / 2 - 2 )
    piece.position.y = 0
    piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  }
}



function removeRows() {
  const rowsToremove = [];

  // Detecta las filas que deben eliminarse
  board.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      rowsToremove.push(y);
    }
  });

  // Elimina las filas desde el final hacia el principio
  rowsToremove.reverse().forEach((y) => {
    board.splice(y, 1); // Elimina la fila completa
    const newrow = Array(BOARD_WIDTH).fill(0); // Asegúrate de usar BOARD_WIDTH
    board.unshift(newrow); // Añade una nueva fila vacía en la parte superior}
    score += 10
  });
}


update()

