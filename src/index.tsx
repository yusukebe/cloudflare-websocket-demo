import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'
import ws from './ws.js'

const app = new Hono()

app.get('/', (c) => {
  return c.html(
    <html>
      <body style={{ margin: '1rem', 'font-family': 'monospace' }}>
        <h1>Cloudflare WebSockets Demo</h1>
        <p>
          Number of clicks: <span id="num"></span>
        </p>
        <button id="click">Click me</button>
        <p>
          You can also send a message that the WebSocket server doesn't recognize. This will cause the WebSocket server
          to return an "error" payload back to the client.
        </p>
        <button id="unknown">Simulate Unknown Message</button>
        <p>
          When you're done clicking, you can close the connection below. Further clicks won't work until you refresh the
          page.
        </p>
        <button id="close">Close connection</button>
        <p id="error" style={{ color: 'red' }}></p>
        <h4>Incoming WebSocket data</h4>
        <ul id="events"></ul>
        <script src="/ws.js" type="module"></script>
      </body>
    </html>
  )
})

let count = 0

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        if (event.data === 'CLICK') {
          count += 1
          ws.send(JSON.stringify({ count, tz: new Date() }))
        } else {
          ws.send(JSON.stringify({ error: 'Unknown message received', tz: new Date() }))
        }
      },
      onClose: () => {
        console.log('Connection closed')
      }
    }
  })
)

app.get('/ws.js', (c) => {
  return c.body(ws, 200, {
    'Content-Type': 'text/javascript'
  })
})

export default app
