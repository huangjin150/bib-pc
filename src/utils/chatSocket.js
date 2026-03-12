import Vue from 'vue'
import Stomp from 'stompjs'
import SockJS from 'sockjs-client'
import Api from '@/config/api'

let client = null
let connecting = null
const subs = new Map()

function resolveWsUrl(token) {
  const base = Vue.prototype.host || '/api'
  const path = Api.market.newws
  const url = `${base}${path}`
  return token ? `${url}?token=${encodeURIComponent(token)}` : url
}

function connect(token) {
  const t = token || localStorage.getItem('TOKEN') || ''
  if (client && client.connected) return Promise.resolve(client)
  if (connecting) return connecting
  const socket = new SockJS(resolveWsUrl(t), null, { transports: ['websocket', 'xhr-streaming', 'xhr-polling'] })
  client = Stomp.over(socket)
  client.debug = null
  const headers = t ? { Authorization: t } : {}
  connecting = new Promise((resolve, reject) => {
    client.connect(headers, () => {
      connecting = null
      resolve(client)
    }, (err) => {
      connecting = null
      reject(err)
    })
  })
  return connecting
}

function subscribe(destination, callback, headers = {}) {
  if (!client || !client.connected) return null
  if (subs.has(destination)) {
    try {
      subs.get(destination).unsubscribe()
    } catch (e) { }
    subs.delete(destination)
  }
  const s = client.subscribe(destination, callback, headers)
  subs.set(destination, s)
  return s
}

function send(destination, headers = {}, body = '') {
  if (!client || !client.connected) return
  const payload = typeof body === 'string' ? body : JSON.stringify(body)
  client.send(destination, headers, payload)
}

function disconnect() {
  if (!client) return
  try { client.disconnect() } catch (e) { }
  client = null
  connecting = null
  subs.forEach((sub) => { try { sub.unsubscribe() } catch (e) { } })
  subs.clear()
}

function getClient() {
  return client
}

export default { connect, subscribe, send, disconnect, getClient }