import io from 'socket.io-client'

import CallStore from './lib/filter'
import CoreView from './layout/core.jsx'

const init = {
    url: '/',
    store: new CallStore()
}
  
const actions = {
    router: (state, url) => ({
        ...state,
        url
    }),
    call: (state, action) => {
        console.log('call',action)
    return state
    }
}

const socket = io('localhost:4000', {
    reconnection: true,
})

socket.on('connect', () => {
    console.log('[WS]', 'connected')
    socket.emit('clientCall', 'postcode.lookup', { postcode:'nw ', token: 'bloopsssssss' }, (_e, _r) => {
        if(_e)
            console.error('[WS]', _e)
        else
            console.log('[WS]', 'res', _r)
    })
    socket.on('event', (_evt) => {
        if(/metrics\.trace\.span\.(start|finish)/.test(_evt.event)){
            let [,dir] = /metrics\.trace\.span\.(start|finish)/.exec(_evt.event)
            init.store.addCall(_evt.payload.requestID, _evt.payload)
            console.log(init.store.unique.top(Infinity))
            if(dir === 'start')
                return
            console.info('[WS]', 'call', dir, _evt.payload.action.name, _evt.payload.requestID)
        }else{
            console.info('[WS]', 'event', 'other', _evt)
        }
    })
})

export default {
    init,
    actions,
    view: CoreView(init, actions),
    node: document.getElementById('app')
}
