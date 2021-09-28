'use strict'

const tap = require('tap')

const { move } = require('./index.js')

tap.test('move returns a valid move', function (t) {
  const validMoves = ['up', 'down', 'left', 'right']

  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 4,
        y: 4
      },
      body: [
        { x: 4, y: 4 },
        { x: 4, y: 5 },
        { x: 4, y: 6 }
      ]
    }
  }

  const result = move(game)
  t.ok(validMoves.includes(result.move))

  t.end()
})

tap.test('avoid hitting the north wall', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 1,
        y: 10
      },
      body: [
        { x: 1, y: 10 },
        { x: 1, y: 9 },
        { x: 1, y: 8 }
      ]
    }
  }

  const result = move(game)
  t.ok(result.move === 'left' || result.move === 'right')
  t.end()
})

tap.test('avoid hitting the west wall', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 0,
        y: 5
      },
      body: [
        { x: 0, y: 5 },
        { x: 1, y: 5 },
        { x: 2, y: 5 }
      ]
    }
  }

  const result = move(game)
  t.ok(result.move === 'up' || result.move === 'down')
  t.end()
})

tap.test('avoid hitting the northwest corner', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 0,
        y: 10
      },
      body: [
        { x: 0, y: 10 },
        { x: 1, y: 10 },
        { x: 2, y: 10 }
      ]
    }
  }

  const expected = 'down'
  const result = move(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('avoid hitting the southwest corner, southbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 0,
        y: 0
      },
      body: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 }
      ]
    }
  }

  const expected = 'right'
  const result = move(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('avoid hitting the south wall', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 5,
        y: 0
      },
      body: [
        { x: 5, y: 0 },
        { x: 5, y: 1 },
        { x: 5, y: 2 }
      ]
    }
  }

  const result = move(game)
  const note = 'move left or right when you hit south wall head on'
  t.ok(result.move === 'left' || result.move === 'right', note)
  t.end()
})

tap.test('avoid hitting the southeast corner, eastbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 10,
        y: 0
      },
      body: [
        { x: 10, y: 0 },
        { x: 9, y: 0 },
        { x: 8, y: 0 }
      ]
    }
  }

  const expected = 'up'
  const result = move(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('survive the northeast corner, northbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 10,
        y: 10
      },
      body: [
        { x: 10, y: 10 },
        { x: 10, y: 9 },
        { x: 10, y: 8 }
      ]
    }
  }

  const expected = 'left'
  const result = move(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('avoid hitting the northeast corner, eastbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 10,
        y: 10
      },
      body: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ]
    }
  }

  const expected = 'down'
  const result = move(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('avoid hitting the east wall, southbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 10,
        y: 9
      },
      body: [
        { x: 10, y: 9 },
        { x: 10, y: 10 },
        { x: 9, y: 10 }
      ]
    }
  }

  const result = move(game)
  const note = 'move left or down to avoid the east wall, southbound'
  t.ok(result.move === 'left' || result.move === 'down', note)
  t.end()
})

tap.test('avoid hitting the east wall and another snake, eastbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: [
        {
          id: 'c8cb622e-7bde-4bdf-b570-2303c83777c0',
          name: 'me',
          health: 92,
          body: [
            { x: 10, y: 5 },
            { x: 9, y: 5 },
            { x: 8, y: 5 }
          ],
          latency: 0,
          head: { x: 10, y: 5 },
          length: 3,
          shout: '',
          squad: ''
        },
        {
          id: 'ca66924c-d5fe-4035-9bc1-17f63ba39852',
          name: 'opp',
          health: 96,
          body: [
            { x: 10, y: 4 },
            { x: 9, y: 4 },
            { x: 8, y: 4 }
          ],
          latency: 0,
          head: { x: 5, y: 9 },
          length: 4,
          shout: '',
          squad: ''
        }
      ]
    },
    you: {
      head: {
        x: 10,
        y: 5
      },
      body: [
        { x: 10, y: 5 },
        { x: 9, y: 5 },
        { x: 8, y: 5 }
      ]
    }
  }

  const expected = 'up'
  const result = move(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('avoid terminal move one removed, pinned in the corner', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: [
        {
          id: 'c8cb622e-7bde-4bdf-b570-2303c83777c0',
          name: 'me',
          health: 92,
          head: { x: 10, y: 9 },
          length: 4,
          body: [
            { x: 10, y: 9 },
            { x: 9, y: 9 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
          ],
          latency: 0,
          shout: '',
          squad: ''
        }
      ]
    },
    you: {
      head: { x: 10, y: 9 },
      body: [
        { x: 10, y: 9 },
        { x: 9, y: 9 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ]
    }
  }

  const expected = 'down'
  const result = move(game)
  const note = 'valid moves are up or down, but up is terminal one move later'
  t.equal(result.move, expected, note)

  t.end()
})

tap.test('stay alive longer even if the next move appears terminal', (t) => {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: [
        {
          id: 'c8cb622e-7bde-4bdf-b570-2303c83777c0',
          name: 'me',
          health: 92,
          length: 5,
          head: { x: 10, y: 10 },
          body: [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 9, y: 9 },
            { x: 9, y: 8 },
            { x: 10, y: 8 }
          ],
          latency: 0,
          shout: '',
          squad: ''
        }
      ]
    },
    you: {
      head: { x: 10, y: 10 },
      body: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 9, y: 9 },
        { x: 9, y: 8 },
        { x: 10, y: 8 }
      ]
    }
  }

  const expected = 'down'
  const result = move(game)
  const note = 'down appears terminal in one move, but take it to extend the game'
  t.equal(result.move, expected, note)

  t.end()
})

tap.test('avoid hazard sauce, simplest possible case', (t) => {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: [
        {
          id: 'c8cb622e-7bde-4bdf-b570-2303c83777c0',
          name: 'me',
          health: 99,
          length: 3,
          head: { x: 2, y: 10 },
          body: [
            { x: 2, y: 10 },
            { x: 1, y: 10 },
            { x: 0, y: 10 }
          ],
          latency: 0,
          shout: '',
          squad: ''
        }
      ],
      hazards: [
        { x: 3, y: 10 }
      ]
    },
    you: {
      head: { x: 2, y: 10 },
      body: [
        { x: 2, y: 10 },
        { x: 1, y: 10 },
        { x: 0, y: 10 }
      ]
    }
  }

  const expected = 'down'
  const result = move(game)
  const note = 'always choose south/down to avoid the hazard east/right'
  t.equal(result.move, expected, note)

  t.end()
})

tap.test('avoid head to head: one safe option', (t) => {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: [
        {
          id: 'c8cb622e-7bde-4bdf-b570-2303c83777c0',
          name: 'us',
          health: 99,
          length: 3,
          head: { x: 5, y: 5 },
          body: [
            { x: 5, y: 5 },
            { x: 5, y: 6 },
            { x: 4, y: 6 }
          ],
          latency: 0,
          shout: '',
          squad: ''
        },
        {
          id: 'opponent-123asd',
          name: 'them',
          health: 99,
          length: 3,
          head: { x: 6, y: 4 },
          body: [
            { x: 6, y: 4 },
            { x: 7, y: 4 },
            { x: 7, y: 3 }
          ],
          latency: 0,
          shout: '',
          squad: ''
        }
      ],
      hazards: []
    },
    you: {
      head: { x: 5, y: 5 },
      body: [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 4, y: 6 }
      ]
    }
  }

  const expected = 'left'
  const result = move(game)
  const note = 'choose the one safe move that avoids potential head to head meetings'
  t.equal(result.move, expected, note)

  t.end()
})

tap.test('avoid head to head: two safe options', (t) => {
  const you = {
    head: { x: 9, y: 2 },
    body: [
      { x: 9, y: 2 },
      { x: 9, y: 1 },
      { x: 9, y: 0 }
    ]
  }

  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: [
        {
          id: 'c8cb622e-7bde-4bdf-b570-2303c83777c0',
          name: 'us',
          health: 99,
          length: 3,
          head: you.head,
          body: you.body,
          latency: 0,
          shout: '',
          squad: ''
        },
        {
          id: 'opponent-123asd',
          name: 'them',
          health: 99,
          length: 3,
          head: { x: 9, y: 4 },
          body: [
            { x: 9, y: 4 },
            { x: 9, y: 5 },
            { x: 9, y: 6 }
          ],
          latency: 0,
          shout: '',
          squad: ''
        }
      ],
      hazards: []
    },
    you: you
  }

  const result = move(game)
  const note = 'choose either left or right, the moves that avoids potential head to head meetings'
  t.ok(result.move === 'left' || result.move === 'right', note)
  t.ok(result.move !== 'up', note)

  t.end()
})

tap.test('avoid head to head: two safe options (#2)', (t) => {
  const you = {
    head: { x: 9, y: 7 },
    body: [
      { x: 9, y: 7 },
      { x: 9, y: 8 },
      { x: 10, y: 8 }
    ]
  }

  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: [
        {
          id: 'c8cb622e-7bde-4bdf-b570-2303c83777c0',
          name: 'us',
          health: 99,
          length: 3,
          head: you.head,
          body: you.body,
          latency: 0,
          shout: '',
          squad: ''
        },
        {
          id: 'opponent-123asd',
          name: 'them',
          health: 99,
          length: 3,
          head: { x: 9, y: 5 },
          body: [
            { x: 9, y: 5 },
            { x: 8, y: 5 },
            { x: 7, y: 5 },
            { x: 7, y: 6 },
            { x: 8, y: 6 }
          ],
          latency: 0,
          shout: '',
          squad: ''
        }
      ],
      hazards: []
    },
    you: you
  }

  const result = move(game)
  const note = 'choose either left or right, the moves that avoids potential head to head meetings'
  t.ok(result.move === 'left' || result.move === 'right', note)
  t.ok(result.move !== 'down', note)

  t.end()
})

tap.test('eat food if hungry', (t) => {
  const you = {
    head: { x: 5, y: 5 },
    body: [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 5, y: 7 }
    ],
    health: 30
  }

  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: [
        {
          id: 'id',
          name: 'us',
          health: 30,
          length: 3,
          head: you.head,
          body: you.body,
          latency: 0,
          shout: '',
          squad: ''
        }
      ],
      food: [{ x: 4, y: 5 }],
      hazards: []
    },
    you: you
  }

  const result = move(game)
  const note = 'eat the food to the left'
  t.equal(result.move, 'left', note)
  t.end()
})
