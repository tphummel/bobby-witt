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

  const legalBoardMoves = []
  if (!atWestWall && !movingEast) legalBoardMoves.push(left)
  if (!atEastWall && !movingWest) legalBoardMoves.push(right)
  if (!atNorthWall && !movingSouth) legalBoardMoves.push(up)
  if (!atSouthWall && !movingNorth) legalBoardMoves.push(down)

  if (process.env.DEBUG) console.log('possible moves based on board boundaries', legalBoardMoves.length)

  const occupied = board.snakes.reduce((memo, snake) => {
    for (const seg of snake.body) {
      if (!memo[seg.x]) memo[seg.x] = []
      memo[seg.x][seg.y] = true
    }
    return memo
  }, [])

  const nonTerminalMoves = legalBoardMoves.filter((move) => {
    const moveIsTerminal = occupied[move.x]?.[move.y] === true
    return !moveIsTerminal
  })

  if (process.env.DEBUG) console.log('possible moves based on location of other snakes', nonTerminalMoves.length)

  if (nonTerminalMoves.length === 0) return { move: 'up', shout }
  if (nonTerminalMoves.length === 1) return { move: nonTerminalMoves[0].name, shout }

  // 2 or 3 non-terminal moves exist, looking to narrow down the best one

  const lookAheadMoves = nonTerminalMoves.filter((move) => {
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

  if (process.env.DEBUG) console.log('possible moves based on look ahead', lookAheadMoves.length)

  if (lookAheadMoves.length === 0) return { move: nonTerminalMoves[Math.floor(Math.random() * nonTerminalMoves.length)].name, shout }
  if (lookAheadMoves.length === 1) return { move: lookAheadMoves[0].name, shout }

  // TODO: avoid head to head. more pressing than hazards. less pressing or equal to look ahead
  const potentialHeadToHead = board.snakes.reduce((memo, snake) => {
    const snakeIsOurself = you.head.x === snake.head.x && you.head.y === snake.head.y
    if (snakeIsOurself) return memo

    const up = { x: snake.head.x, y: snake.head.y + 1 }
    const down = { x: snake.head.x, y: snake.head.y - 1 }
    const left = { x: snake.head.x - 1, y: snake.head.y }
    const right = { x: snake.head.x + 1, y: snake.head.y }
    const snakeNextMoves = [up, down, left, right]

    // intentionally ignoring opponent snake bodies, we've already accounted for those above
    // some snake body will be covered here due to naive approach of using all four directions from head.
    snakeNextMoves.forEach(space => {
      if (!memo[space.x]) memo[space.x] = []
      memo[space.x][space.y] = true
    })

    return memo
  }, [])

  const movesToAvoidHeadToHead = lookAheadMoves.filter((move) => {
    const moveIsPotentialHeadToHead = potentialHeadToHead[move.x]?.[move.y] === true
    return !moveIsPotentialHeadToHead
  })

  if (process.env.DEBUG) console.log('possible moves avoiding possible head-to-head collision', movesToAvoidHeadToHead.length)

  if (movesToAvoidHeadToHead.length === 1) return { move: movesToAvoidHeadToHead[0].name, shout }

  if (board.hazards) {
    const hazards = board.hazards.reduce((memo, haz) => {
      if (!memo[haz.x]) memo[haz.x] = []
      memo[haz.x][haz.y] = true
      return memo
    }, [])

    const nonHazMoves = movesToAvoidHeadToHead.filter((move) => {
      const moveIsHazard = hazards[move.x]?.[move.y] === true
      return !moveIsHazard
    })

    if (process.env.DEBUG) console.log('possible moves avoiding hazard sauce', nonHazMoves.length)

    if (nonHazMoves.length === 1) return { move: nonHazMoves[0].name, shout }
    if (nonHazMoves.length >= 1) return { move: nonHazMoves[Math.floor(Math.random() * nonHazMoves.length)].name, shout }
  }

  if (process.env.DEBUG) console.log('final possible moves, randomizing a choice', movesToAvoidHeadToHead.length)

  return { move: movesToAvoidHeadToHead[Math.floor(Math.random() * movesToAvoidHeadToHead.length)].name, shout }
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
