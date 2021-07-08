const http = require('http')
const { move } = require('./index.js')

const server = http.createServer((req, res) => {
  const pathname = req.url
  console.log(pathname)

  if (req.method === 'GET') {
    const body = {
      apiversion: '1',
      author: 'tphummel',
      color: '#888888',
      head: 'default',
      tail: 'default',
      version: '0.0.1-beta'
    }

    res.writeHead(200, {
      'content-type': 'application/json;charset=UTF-8'
    })
    return res.end(JSON.stringify(body), 'UTF-8')
  }

  if (req.method !== 'POST') {
    res.writeHead(404)
    return res.end('Not Found')
  }

  if (pathname.startsWith('/start')) {
    // no response required
    res.writeHead(200)
    return res.end('OK')
  } else if (pathname.startsWith('/move')) {
    // https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
    let data = ''

    req.on('data', chunk => {
      data += chunk
    })

    req.on('end', () => {
      const reqBody = JSON.parse(data)
      // if (process.env.DEBUG) console.log(reqBody)
      if (process.env.DEBUG) console.log(JSON.stringify(reqBody.board.snakes))

      const resBody = move(reqBody)
      // if (process.env.DEBUG) console.log(resBody)

      res.writeHead(200, {
        'content-type': 'application/json;charset=UTF-8'
      })
      res.end(JSON.stringify(resBody), 'UTF-8')
    })
  } else if (pathname.startsWith('/end')) {
    res.writeHead(200)
    return res.end('OK')
  } else {
    res.writeHead(404)
    return res.end('Not Found')
  }
})

server.listen(8080)
