import React from 'react'
import PropTypes from 'prop-types'

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

var attemptLogin

const login = (_pcall, _socket) => (_err) => new Promise((resolve, reject) =>
    attemptLogin(_socket)
        .then(authWrapper(_pcall, _socket))
        .catch(_login_err =>reject(_login_err)))

const authWrapper = (_pcall, _socket) => (_meta = {}) => new Promise((resolve, reject) =>
    _pcall(_socket)
        .catch(login(_pcall,_socket)))

const socketCall = (_call, _meta) => (_socket) => new Promise((resolve, reject) => {
    _socket.emit('clientCall', _call, _meta, (_e, _r) => _e
        ? reject(_e)
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


const controller = {

}

export default class extends React.Component {
    static defaultProps = {
        showLogin: false
    }
    static propTypes = {
        showLogin: PropTypes.bool
    }
    constructor(props) {
      super(props)
      this.state = {
          ...props
      }
    }
    connectIO(){
        try{
            this.socket = io('localhost:4000', {
                reconnection: true,
            })
        
            this.call = (_call, _meta) =>
                authWrapper(socketCall(_call, _meta), this.socket)
        
            // const uploader = SocketIOFileClient(socket)
        
            // const bindSubmitToUpload = function(_form, _ul_elem, next) {
            //     _form.addEventHandler('onsubmit', _ev => {
            //         _ev.preventDefault()
            //         next(uploader.upload(_ul_elem))
            //     })
            // }
            this.socket.on('event', (_evt) => {
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
            this.socket.on('metric', (_evt) => {
                console.info('[WS]', 'METRIC', _evt)
            })
            this.socket.onclose = (_evt) => {
                console.info('[WS]','CLOSE', _evt)
            }
            this.socket.on('connection_error', (_evt) => {
                console.info('[WS]','CONN_ERR', _evt)
            })
            this.socket.on('disconnect', (_evt) => {
                console.info('[WS]','DISCO', _evt)
            })
            this.socket.on('reconnect', (_evt) => {
                console.info('[WS!]','RECO', _evt)
            })
            this.socket.on('reconnect_error', (_evt) => {
                console.info('[WS!]', 'RECO_ERR', _evt)
            })
            
            this.socket.on('error', (_evt) => {
                console.error('[WS!]', _evt)
            })
        }catch(e){
            console.log('[SOCKET ERROR]',e)
        }
        
    }
    setupIO(){
        this.socket.on('connect', () => {
            console.log('[WS]', 'connected')
            
            this.call('postcode.lookup', { postcode:'nw', token: 'bloopsssssss' })().then(r => {
                console.log('=>','[call]', r)
            }).catch(e => {
                console.error('=>','[call]', e)
            })
    
            this.call('postcode.lookup', { postcode:'nw2', token: 'bloopsssssss' })().then(r => {
                console.log('=>','[call 2]', r)
            }).catch(e => {
                console.error('=>','[call 2]', e)
            })
        })
    }
    showLogin(){
        this.setState(state => ({
            showLogin: true
        }))
        return new Promise((resolve, reject)=> {
            this.loginResolve = resolve
            this.loginReject = reject
            setTimeout(()=>{
                return confirm('Login?')
                    ? this.loginResolve()
                    : this.loginReject(new Error('LOGIN_REJECTED'))
            },1000)
        })
    }
    hideLogin(){
        this.setState(state => ({
            showLogin: false
        }))
    return true
    }
    componentDidMount() {
        attemptLogin = (_socket) => new Promise((resolve, reject) =>
            this.showLogin().catch(e=>{
                this.hideLogin() && reject(e)
            }))
        this.connectIO()
        this.setupIO()
    }
    render(){
        return (<CoreView showLogin={this.state.showLogin} />)
    }
}