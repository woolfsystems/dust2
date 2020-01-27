import io from 'socket.io-client'
import {h} from 'hyperapp'
import Tone from 'tone'

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
  //set the attributes using the set interface
//   synth.set("detune", -1200);
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
})

const controller = {

}

export default CoreView
