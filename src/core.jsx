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

const socket = io('localhost:4000', {
    reconnection: true,
})

const uploader = SocketIOFileClient(socket)

const bindSubmitToUpload = function(_form, _ul_elem, next) {
    _form.addEventHandler('onsubmit', _ev => {
        _ev.preventDefault()
        next(uploader.upload(_ul_elem))
    })
}

socket.on('connect', () => {
    console.log('[WS]', 'connected')
    socket.emit('clientCall', 'postcode.lookup', { postcode:'nw ', token: 'bloopsssssss' }, (_e, _r) => {
        if(_e)
            console.error('[WS?]', _e)
        else
            console.log('[WS]', 'res', _r)
    })
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
            console.info('[WS]', 'call', dir, _evt.payload.action.name, _evt.payload.requestID)
        }else{
            console.info('[WS]', 'event', 'other', _evt)
        }
    })
    socket.on('error', (_evt) => {
        console.error('[WS!]', _evt)
    })

})

const controller = {

}

export default CoreView
