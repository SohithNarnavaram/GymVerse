/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (2.3.1).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '223d1566f33a3b2f3c0d1c0c0c0c0c0c0'
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
const activeClientIds = new Set()

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(clientId, {
        type: 'KEEPALIVE_RESPONSE',
      })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(clientId, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)

      sendToClient(clientId, {
        type: 'MOCKING_ENABLED',
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId)
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { request } = event

  if (request.mode === 'navigate') {
    return
  }

  if (activeClientIds.size === 0) {
    return
  }

  const requestId = Math.random().toString(16).slice(2)

  event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      if (error.name === 'NetworkError') {
        console.warn(
          '[MSW] Successfully emulated a network error for the "%s %s" request.',
          request.method,
          request.url,
        )
        return
      }

      console.error(
        '[MSW] Caught an exception from the "%s %s" request (%s). This is probably not a problem with Mock Service Worker. There is likely an additional logging output above.',
        request.method,
        request.url,
        `${error.name}: ${error.message}`,
      )
    }),
  )
})

async function handleRequest(event, requestId) {
  const client = await event.target.clients.get(event.clientId)

  if (!client) {
    return passthrough()
  }

  const requestClone = event.request.clone()
  const getOriginalResponse = () => passthrough()

  return client
    .send({
      type: 'REQUEST',
      payload: {
        id: requestId,
        url: event.request.url,
        method: event.request.method,
        headers: Object.fromEntries(event.request.headers.entries()),
        cache: event.request.cache,
        mode: event.request.mode,
        credentials: event.request.credentials,
        destination: event.request.destination,
        integrity: event.request.integrity,
        redirect: event.request.redirect,
        referrer: event.request.referrer,
        referrerPolicy: event.request.referrerPolicy,
        body: await event.request.text(),
        bodyUsed: event.request.bodyUsed,
        keepalive: event.request.keepalive,
      },
    })
    .then((response) => {
      return new Promise((resolve) => {
        if (response.type === 'MOCK_RESPONSE') {
          resolve(response.payload)
        }

        if (response.type === 'NETWORK_ERROR') {
          const { name, message } = response.payload
          const networkError = new Error(message)
          networkError.name = name

          reject(networkError)
        }

        resolve(getOriginalResponse())
      })
    })
    .catch((error) => {
      return getOriginalResponse()
    })
}

function sendToClient(clientId, message) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(new Error(event.data.error))
      }

      resolve(event.data)
    }

    self.clients.get(clientId).then((client) => {
      client.postMessage(
        message,
        [channel.port2],
      )
    })
  })
}

function passthrough() {
  return fetch(event.request)
}

