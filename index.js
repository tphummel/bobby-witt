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

  console.log('possible moves based on board edges:', legalBoardMoves.length)

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

  console.log('possible moves based on avoiding other snakes:', nonTerminalMoves.length)

  if (nonTerminalMoves.length === 0) return { move: 'up', shout, isChoice: false, isRandomized: false }
  if (nonTerminalMoves.length === 1) return { move: nonTerminalMoves[0].name, shout, isChoice: false, isRandomized: false }
  const isChoice = true

  console.log(`there are ${nonTerminalMoves.length} non-terminal moves to consider. evaluating further`)

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

  console.log('viable moves based on look ahead:', lookAheadMoves.length)

  if (lookAheadMoves.length === 0) return { move: nonTerminalMoves[Math.floor(Math.random() * nonTerminalMoves.length)].name, shout, isChoice, isRandomized: true }
  if (lookAheadMoves.length === 1) return { move: lookAheadMoves[0].name, shout, isChoice, isRandomized: false }

  console.log(`there are ${lookAheadMoves.length} moves which are safe when we look ahead one move. evaluating further`)

  const potentialHeadToHead = board.snakes.reduce((memo, snake) => {
    const snakeIsOurself = you.head.x === snake.head.x && you.head.y === snake.head.y
    if (snakeIsOurself) return memo

    const oppLength = snake.length

    const up = { x: snake.head.x, y: snake.head.y + 1 }
    const down = { x: snake.head.x, y: snake.head.y - 1 }
    const left = { x: snake.head.x - 1, y: snake.head.y }
    const right = { x: snake.head.x + 1, y: snake.head.y }
    const snakeNextMoves = [up, down, left, right]

    // intentionally ignoring opponent snake bodies, we've already accounted for those above
    // some snake body will be covered here due to naive approach of using all four directions from head.
    for (const space of snakeNextMoves) {
      if (!memo[space.x]) memo[space.x] = []
      if (!memo[space.x][space.y]) {
        memo[space.x][space.y] = oppLength
      } else {
        if (oppLength > memo[space.x][space.y]) {
          memo[space.x][space.y] = oppLength
        }
      }
    }

    return memo
  }, [])

  const attackMoves = lookAheadMoves.filter((move) => {
    const potentialHeadToHeadLength = potentialHeadToHead[move.x]?.[move.y]
    const moveIsPotentialHeadToHead = potentialHeadToHeadLength >= 1
    const headToHeadIsSmaller = potentialHeadToHeadLength < you.length

    return moveIsPotentialHeadToHead && headToHeadIsSmaller
  })

  console.log('possible moves attacking shorter snake, head-to-head collision:', attackMoves.length)

  if (attackMoves.length === 1) return { move: attackMoves[0].name, shout, isChoice, isRandomized: false }

  let preferredMoves

  if (attackMoves.length >= 2) {
    preferredMoves = attackMoves
  } else {
    const defensiveMoves = lookAheadMoves.filter((move) => {
      const potentialHeadToHeadLength = potentialHeadToHead[move.x]?.[move.y]
      const moveIsPotentialHeadToHead = potentialHeadToHeadLength >= 1
      return !moveIsPotentialHeadToHead
    })

    console.log('possible moves on defense, avoiding head-to-head:', defensiveMoves.length)

    if (defensiveMoves.length === 0) preferredMoves = lookAheadMoves
    if (defensiveMoves.length === 1) return { move: defensiveMoves[0].name, shout, isChoice, isRandomized: false }
    if (defensiveMoves.length >= 2) preferredMoves = defensiveMoves
  }

  console.log('continuing evaluation of preferred moves:', preferredMoves.length)

  if (board.hazards?.length > 0) {
    const hazards = board.hazards.reduce((memo, haz) => {
      if (!memo[haz.x]) memo[haz.x] = []
      memo[haz.x][haz.y] = true
      return memo
    }, [])

    const nonHazMoves = preferredMoves.filter((move) => {
      const moveIsHazard = hazards[move.x]?.[move.y] === true
      return !moveIsHazard
    })

    console.log('possible moves avoiding hazard sauce:', nonHazMoves.length)

    // TODO: if hazard is every direction, head toward the center of the board. if nonHazMoves.length === 0
    if (nonHazMoves.length === 1) return { move: nonHazMoves[0].name, shout, isChoice, isRandomized: false }
    if (nonHazMoves.length > 1) preferredMoves = nonHazMoves
  }
  console.log('preferred moves:', preferredMoves.length)
  if (preferredMoves.length === 1) return { move: preferredMoves[0].name, shout, isChoice, isRandomized: false }

  const isHungry = you.health <= 100
  console.log('hungry:', isHungry, you.health)
  if (isHungry && preferredMoves.length > 1) {
    const cups = board.food.reduce((memo, cup) => {
      if (!memo[cup.x]) memo[cup.x] = []
      memo[cup.x][cup.y] = true
      return memo
    }, [])

    for (const move of preferredMoves) {
      const foodIsAvailable = cups[move.x]?.[move.y]
      if (foodIsAvailable) {
        console.log('Eating adjacent food')
        return { move: move.name, shout, isChoice, isRandomized: false }
      }
    }
  }

  console.log('final possible moves, randomizing a choice:', preferredMoves.length)

  return { move: preferredMoves[Math.floor(Math.random() * preferredMoves.length)].name, shout, isChoice, isRandomized: true }
}

const isCloudFlareWorker = typeof addEventListener !== 'undefined' && addEventListener // eslint-disable-line

if (isCloudFlareWorker) {
  addEventListener('fetch', event => { // eslint-disable-line
    event.respondWith(handleRequest(event))
  })

  async function handleRequest (event) {
    const { request } = event
    const { pathname } = new URL(request.url)

    console.log(request.method, request.pathname)
    let eventData = getEventData(event)

    if (request.method === 'GET') {
      console.log(new Map(request.headers))

      const body = {
        apiversion: '1',
        author: 'tphummel',
        color: '#ffc0cb',
        head: 'viper',
        tail: 'rattle',
        version: BATTLESNAKE_VERSION // eslint-disable-line
      }

      const res = new Response(JSON.stringify(body), { // eslint-disable-line
        status: 200,
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      })

      eventData.res_status = res.status
      event.waitUntil(postLog(eventData))
      return res
    }

    if (request.method !== 'POST') {
      const res = new Response('Not Found', { status: 404 }) // eslint-disable-line
      eventData.res_status = res.status
      event.waitUntil(postLog(eventData))
      return res
    }

    const reqBodyTxt = await request.text()
    const reqBody = JSON.parse(reqBodyTxt)
    eventData = mergeReqEvent(eventData, reqBody)
    let res

    if (pathname.startsWith('/start')) {
      res = new Response('OK', { status: 200 }) // eslint-disable-line

    } else if (pathname.startsWith('/move')) {
      const resBody = move(reqBody)

      eventData.res_move = resBody.move
      eventData.res_shout = resBody.shout
      eventData.move_is_choice = resBody.isChoice
      eventData.move_is_randomized = resBody.isRandomized

      const resBodyOut = {
        move: resBody.move,
        shout: resBody.shout
      }

      res = new Response(JSON.stringify(resBodyOut), { // eslint-disable-line
        status: 200,
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      })
    } else if (pathname.startsWith('/end')) {
      const gameId = eventData.game_id
      const mySnakeId = eventData.you_id

      const gameUrl = `https://engine.battlesnake.com/games/${gameId}`
      const opts = {
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }
      const gameRes = await fetch(gameUrl, opts) // eslint-disable-line
      const gameResText = await gameRes.text()
      const game = JSON.parse(gameResText)
      const me = game.LastFrame.Snakes.find(snake => snake.ID === mySnakeId)

      if (me.Death === null) {
        eventData.outcome = 'win'
      } else {
        eventData.outcome = 'loss'
        eventData.death_turn = me.Death.Turn
        eventData.death_cause = me.Death.Cause
        eventData.death_by = me.Death.EliminatedBy
      }
      res = new Response('OK', { status: 200 }) // eslint-disable-line
    } else {
      res = new Response('Not Found', { status: 404 }) // eslint-disable-line
    }

    eventData.res_status = res.status
    event.waitUntil(postLog(eventData))
    return res
  }

  function postLog (data) {
    console.log('sending event to honeycomb')
    return fetch('https://api.honeycomb.io/1/events/' + encodeURIComponent(HONEYCOMB_DATASET), { // eslint-disable-line
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers([['X-Honeycomb-Team', HONEYCOMB_KEY]]) // eslint-disable-line
    })
  }

  function getEventData (event) {
    const { pathname } = new URL(event.request.url)
    const cf = event.request.cf !== undefined ? event.request.cf : {}
    const headers = new Map(event.request.headers)

    return {
      battlesnake: BATTLESNAKE_NAME, // eslint-disable-line
      battlesnake_version: BATTLESNAKE_VERSION, // eslint-disable-line
      req_method: event.request.method,
      req_pathname: pathname,
      req_lat: cf.latitude,
      req_lon: cf.longitude,
      req_continent: cf.continent,
      req_country: cf.country,
      req_region: cf.region,
      req_city: cf.city,
      req_timezone: cf.timezone,
      req_region_code: cf.regionCode,
      req_metro_code: cf.metroCode,
      req_postal_code: cf.postalCode,
      req_colo: cf.colo,
      req_cf_ray: headers.get('cf-ray')
    }
  }

  function mergeReqEvent (eventData, reqBody) {
    eventData.game_id = reqBody.game.id
    eventData.game_timeout = reqBody.game.timeout
    eventData.game_source = reqBody.game?.source
    eventData.ruleset_name = reqBody.game?.ruleset?.name
    eventData.ruleset_version = reqBody.game?.ruleset?.version
    eventData.turn = reqBody.turn
    eventData.board_height = reqBody.board.height
    eventData.board_width = reqBody.board.width
    eventData.board_food_count = reqBody.board.food?.length
    eventData.board_hazard_count = reqBody.board.hazards?.length
    eventData.board_snakes_count = reqBody.board.snakes?.length
    eventData.you_id = reqBody.you.id
    eventData.you_name = reqBody.you.name
    eventData.you_health = reqBody.you.health
    eventData.you_length = reqBody.you.length
    eventData.you_shout = reqBody.you.shout
    eventData.you_squad = reqBody.you.squad
    eventData.you_latency = reqBody.you.latency
    eventData.you_head_x = reqBody.you.head.x
    eventData.you_head_y = reqBody.you.head.y

    return eventData
  }
} else {
  module.exports = { move }
}
