"use strict";
const { WebSocketServer } = require('ws');
const Emitter = require("events");
const path = require('path');
const fs = require('fs');
const emitter = new Emitter();
function getJSON(str) {
    try {
        let result = JSON.parse(str);
        return result;
    }
    catch (e) {
        return false;
    }
}
const normalizeData = (data) => {
    let result = data.toString();
    let o = getJSON(result);
    return Array.isArray(o) && o.length > 0 && o;
};
function wss(options, cb) {
    const socketServer = new WebSocketServer(options, cb);
    socketServer.on("connection", function connection(ws) {
        ws.on("message", function message(data) {
            data = normalizeData(data);
            if (data && typeof data[0] === 'string') {
                emitter.emit(data[0], {
                    data: data[1],
                    wss: socketServer,
                    ws
                });
            }
        });
    });
    return socketServer;
}
function hook(event, cb) {
    emitter.on(event, cb);
}
function pathToHooks(dirname, nameFolder) {
    let normalizedFolder = path.join(dirname, nameFolder);
    fs
        .readdirSync(normalizedFolder)
        .forEach(function (file) {
        require(normalizedFolder + '/' + file);
    });
}
module.exports = {
    wss,
    hook,
    pathToHooks
};
