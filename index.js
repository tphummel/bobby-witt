function move (reqBody) {
  const { board, you } = reqBody

  const shout = 'shout'

  const head = you.head
  const left = { x: head.x - 1, y: head.y, name: 'left' }
  const right = { x: head.x + 1, y: head.y, name: 'right' }
  const up = { x: head.x, y: head.y + 1, name: 'up' }
  const down = { x: head.x, y: head.y - 1, name: 'down' }

  const neck = you.body[1]

  const movingNorth = neck.y === you.head.y - 1
  const movingSouth = neck.y === you.head.y + 1
  const movingEast = neck.x === you.head.x - 1
  const movingWest = neck.x === you.head.x + 1

  const atNorthWall = you.head.y + 1 === board.height
  const atWestWall = you.head.x === 0
  const atEastWall = you.head.x + 1 === board.width
  const atSouthWall = you.head.y === 0

  let moves = []
  if (!atWestWall && !movingEast) moves.push(left)
  if (!atEastWall && !movingWest) moves.push(right)
  if (!atNorthWall && !movingSouth) moves.push(up)
  if (!atSouthWall && !movingNorth) moves.push(down)

  const occupied = board.snakes.reduce((memo, snake) => {
    for (const seg of snake.body) {
      if (!memo[seg.x]) memo[seg.x] = []
      memo[seg.x][seg.y] = true
    }
    return memo
  }, [])

  moves = moves.filter((move) => {
    const moveIsTerminal = occupied[move.x]?.[move.y] === true
    return !moveIsTerminal
  })

  if (moves.length === 1) return { move: moves[0].name, shout }

  moves = moves.filter((move) => {
    const left = { x: move.x - 1, y: move.y, name: 'left' }
    const right = { x: move.x + 1, y: move.y, name: 'right' }
    const up = { x: move.x, y: move.y + 1, name: 'up' }
    const down = { x: move.x, y: move.y - 1, name: 'down' }

    let nextMoves = []

    if (move.name !== 'right') nextMoves.push(left)
    if (move.name !== 'left') nextMoves.push(right)
    if (move.name !== 'up') nextMoves.push(down)
    if (move.name !== 'down') nextMoves.push(up)

    nextMoves = nextMoves.filter((nextMove) => {
      const isNorthWall = nextMove.y === board.height
      const isWestWall = nextMove.x === -1
      const isEastWall = nextMove.x === board.width
      const isSouthWall = nextMove.y === -1

      if (isNorthWall || isWestWall || isEastWall || isSouthWall) return false

      const isOccupied = occupied[nextMove.x]?.[nextMove.y] === true
      return !isOccupied
    })

    const nextMoveIsTerminal = nextMoves.length === 0
    if (nextMoveIsTerminal) return false
    return true
  })

  if (moves.length === 0) {
    return {
      move: 'up',
      shout: 'no viable moves!'
    }
  }

  return { move: moves[Math.floor(Math.random() * moves.length)].name, shout }
}

const isCloudFlareWorker = typeof addEventListener !== 'undefined' && addEventListener // eslint-disable-line

if (isCloudFlareWorker) {
  addEventListener('fetch', event => { // eslint-disable-line
    event.respondWith(handleRequest(event.request))
  })

  async function handleRequest (request) {
    const { pathname } = new URL(request.url)

    if (request.method === 'GET') {
      console.log('GET /')
      console.log(new Map(request.headers))

      const body = {
        apiversion: '1',
        author: 'tphummel',
        color: '#ffc0cb',
        head: 'viper',
        tail: 'rattle',
        version: '2021-07-11'
      }

      return new Response(JSON.stringify(body), { // eslint-disable-line
        status: 200,
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      })
    }

    if (request.method !== 'POST') {
      return new Response('Not Found', { status: 404 }) // eslint-disable-line
    }

    if (pathname.startsWith('/start')) {
      console.log('POST /start')
      console.log(new Map(request.headers))

      // const reqBody = await request.text()

      // no response required
      return new Response('OK', { status: 200 }) // eslint-disable-line

    } else if (pathname.startsWith('/move')) {
      console.log('POST /move')
      console.log(new Map(request.headers))

      const reqBodyTxt = await request.text()
      const reqBody = JSON.parse(reqBodyTxt)

      const resBody = move(reqBody)

      return new Response(JSON.stringify(resBody), { // eslint-disable-line
        status: 200,
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      })
    } else if (pathname.startsWith('/end')) {
      console.log('POST /end')
      console.log(new Map(request.headers))

      // no response required
      return new Response('OK', { status: 200 }) // eslint-disable-line
    } else {
      return new Response('Not Found', { status: 404 }) // eslint-disable-line
    }
  }
} else {
  module.exports = { move }
}
