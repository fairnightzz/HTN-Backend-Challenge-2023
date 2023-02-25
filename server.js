// Setting up server on port 8080

import { createServer } from 'http'

import app from './app.js'

const port = process.env.PORT || 8080

const server = createServer(app)

server.listen(port)
