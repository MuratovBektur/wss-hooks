# WSS-Hooks
Wrapper over 'ws' package that adds some functionality:
* Accepts an array where the first element is the name of the event as a string and the optional second element is the data.
* Allows you to work with each event in a separate file
* Allows you to continue working with the 'ws' package, since WSS-Hooks returns the WebSocketServer object from 'ws' package
* Automatically convert object and array to JSON using ws.post, which expects as the first argument the name of the event and as an optional second argument the data to be passed to the client.

## Installation
This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install wss-hooks
```

## Usage
### main file
```typescript
import { wss, pathToHooks } from 'wss-hooks'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {
  port: 8080
}

async function start () {
  try {
    const WSS = wss(options) // options for the WebSocketServer object from 'ws' package
    await pathToHooks(__dirname, 'hooks') // path to hooks folder
    WSS.on('connection', (ws) => { 
      // your code
    })
  } catch (err) {
    console.error(err)
  }
}

start()

```
### hooks/echo
```typescript
import { hook } from 'wss-hooks'

hook('echo', ({ data, ws, wss }) => {
   console.log('wss', wss.clients.size);
   ws.post('custom-event', data) // if array comes from client as: '[ "echo" , {"name":"John","skills": ["html", "css"]}]',  
                                 // then it will return to the client: '[ "custom-event" , {"name":"John","skills": ["html", "css"]}]'})
```
