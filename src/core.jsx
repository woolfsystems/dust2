import io from 'socket.io-client'
import Tone from 'tone'
import SocketIOFileClient from 'socket.io-file-client'

import CallStore from './lib/filter'
import CoreView from './layout/core.jsx'

const init = {
    url: '/',
    store: new CallStore()
}
const events = {
    'route': (state, actions) => {
        console.log('route',)
    }
}
const actions = {
    route: (state, url, data, emit) => {
        console.log('a',url,data,emit)
        return ({
        ...state,
        url
    })},
    call(state, action) {
        console.log('call',action)
    return state
    }
}

const login = (_socket) => new Promise((resolve, reject) => {
    if(confirm('Login?'))
        resolve()
    else
        reject(new Error('LOGIN_REJECTED'))
})

const socketCall = (_socket) => (_call, _meta) => new Promise((resolve, reject) => {
    _socket.emit('clientCall', _call, _meta, (_e, _r) => _e
        ? login(_socket)
            .then(_u => socketCall(_socket)(_call, _meta))
        : resolve(_r))
})

let synth
if(window.sounds){
    synth = new Tone.Synth({
        oscillator : {
            type : "pwm",
            modulationFrequency : 0.2
        },
        envelope : {
            attack : 0.02,
            decay : 0.2,
            sustain : 0.3,
            //release : 0.9,
        }
    }).toMaster();
}

try{
    const socket = io('localhost:4000', {
        reconnection: true,
    })

    const call = socketCall(socket)

    // const uploader = SocketIOFileClient(socket)

    // const bindSubmitToUpload = function(_form, _ul_elem, next) {
    //     _form.addEventHandler('onsubmit', _ev => {
    //         _ev.preventDefault()
    //         next(uploader.upload(_ul_elem))
    //     })
    // }
    socket.on('event', (_evt) => {
        if(/metrics\.trace\.span\.(start|finish)/.test(_evt.event)){
            let [,dir] = /metrics\.trace\.span\.(start|finish)/.exec(_evt.event)
            init.store.addCall(_evt.payload.requestID, _evt.payload)
            console.log(init.store.unique.top(Infinity))
            if(dir === 'start'){
                if(window.sounds){
                    synth.triggerAttackRelease("C4",'2n')
                }
                return
            }
            if(window.sounds){
                synth.triggerAttackRelease("G4",'2n')
            }
            console.info('[WS]', 'CALL', dir, _evt.payload.action.name, _evt.payload.requestID)
        }else{
            console.info('[WS]', 'OTHER', _evt)
        }
    })
    socket.on('metric', (_evt) => {
        console.info('[WS]', 'METRIC', _evt)
    })
    socket.onclose = (_evt) => {
        console.info('[WS]','CLOSE', _evt)
    }
    socket.on('connection_error', (_evt) => {
        console.info('[WS]','CONN_ERR', _evt)
    })
    socket.on('disconnect', (_evt) => {
        console.info('[WS]','DISCO', _evt)
    })
    socket.on('reconnect', (_evt) => {
        console.info('[WS!]','RECO', _evt)
    })
    socket.on('reconnect_error', (_evt) => {
        console.info('[WS!]', 'RECO_ERR', _evt)
    })
    socket.on('connect', () => {
        console.log('[WS]', 'connected')
        
        call('postcode.lookup', { postcode:'nw', token: 'bloopsssssss' }).then(r => {
            console.log('=>','[call]', r)
        }).catch(e => {
            console.error('=>','[call]', e)
        })

        call('postcode.lookup', { postcode:'nw2', token: 'bloopsssssss' }).then(r => {
            console.log('=>','[call 2]', r)
        }).catch(e => {
            console.error('=>','[call 2]', e)
        })
    })
    socket.on('error', (_evt) => {
        console.error('[WS!]', _evt)
    })
}catch(e){
    console.log('[SOCKET ERROR]',e)
}

const controller = {

}

export default CoreView
