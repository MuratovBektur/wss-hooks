const { WebSocketServer } = require('ws')
const Emitter = require("events")
const path = require('path')
const fs = require('fs')

const emitter = new Emitter()
type WebSocketServerCb = (...args: any[]) => any
type WebSocketServerOptions = {
  [key: string]: any
}

function getJSON(str: any): Array <any> | Object| false {
  try {
    let result = JSON.parse(str)
    return result
  } catch (e) {
    return false
  }
}

const normalizeData = (data: BinaryData): Array <any> | false => {
  let result: any = data.toString()
  let o: Array <any> | Object| false = getJSON(result)

  return Array.isArray(o) && o.length > 0 && o
}

function wss (options: WebSocketServerOptions, cb: WebSocketServerCb) {
  const socketServer = new WebSocketServer(options, cb)
  socketServer.on("connection", function connection(ws: any) {
    ws.on("message", function message(data: any) {
      data = normalizeData(data)
      if (data && typeof data[0] === 'string') {
        emitter.emit(data[0], {
          data: data[1],
          wss: socketServer,
          ws
        })
      }
    })
  })
  return socketServer
}

function hook (event: string, cb: (data: any) => any) {
  emitter.on(event, cb)
}

function pathToHooks (dirname: 'string', nameFolder: 'string') {
  let normalizedFolder = path.join(dirname, nameFolder)

  fs
    .readdirSync(normalizedFolder)
    .forEach(function (file: string) {
      require(normalizedFolder + '/' + file)
    })
}

module.exports = {
  wss,
  hook,
  pathToHooks
}