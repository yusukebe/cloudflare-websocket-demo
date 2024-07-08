/**
 * Based on websocket-template
 * https://github.com/cloudflare/websocket-template/blob/main/template.js
 */

let ws

async function websocket(url) {
  ws = new WebSocket(url)

  if (!ws) {
    throw new Error("server didn't accept ws")
  }

  ws.addEventListener('open', () => {
    console.log('Opened websocket')
    updateCount(0)
  })

  ws.addEventListener('message', ({ data }) => {
    const { count, tz, error } = JSON.parse(data)
    addNewEvent(data)
    if (error) {
      setErrorMessage(error)
    } else {
      setErrorMessage()
      updateCount(count)
    }
  })

  ws.addEventListener('close', () => {
    console.log('Closed websocket')

    const list = document.querySelector('#events')
    list.innerText = ''
    updateCount(0)
    setErrorMessage()
  })
}

const url = new URL(window.location)
url.protocol = url.protocol === 'https:' ? 'wss' : 'ws'
url.pathname = '/ws'
websocket(url)

document.querySelector('#click').addEventListener('click', () => {
  ws.send('CLICK')
})

const updateCount = (count) => {
  document.querySelector('#num').innerText = count
}

const addNewEvent = (data) => {
  const list = document.querySelector('#events')
  const item = document.createElement('li')
  item.innerText = data
  list.prepend(item)
}

const closeConnection = () => ws.close()

document.querySelector('#close').addEventListener('click', closeConnection)
document.querySelector('#unknown').addEventListener('click', () => ws.send('HUH'))

const setErrorMessage = (message) => {
  document.querySelector('#error').innerHTML = message ? message : ''
}
