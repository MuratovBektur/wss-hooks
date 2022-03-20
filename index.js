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
const isEmpty = (data) => data === null || data === undefined;
function wss(options, cb) {
    const socketServer = new WebSocketServer(options, cb);
    socketServer.on("connection", function connection(ws) {
        ws.post = function (event, data) {
            let preparedData = [event];
            if (!isEmpty(data)) {
                preparedData.push(data);
            }
            return ws.send(JSON.stringify(preparedData));
        };
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
async function pathToHooks(dirname, nameFolder) {
    const normalizedFolder = path.join(dirname, nameFolder);
    const files = await fs.readdirSync(normalizedFolder);
    await Promise.all(files.map(async (file) => {
        await import(normalizedFolder + '/' + file);
    }));
}
module.exports = {
    wss,
    hook,
    pathToHooks
};
