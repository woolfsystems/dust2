import '/assets/base.scss'
import io from 'socket.io-client'

const socket = io('localhost:4000',{
    reconnection: true,
})
socket.on('connect', () => {
    console.log('[WS]','connected')
    socket.emit('clientCall','postcode.lookup',{postcode:'nw ', token: 'bloopsssssss'},(_e, _r)=>{
        if(_e)
            console.error('[WS]',_e)
        else
            console.log('[WS]','res',_r)
    })
    socket.on('event', (_evt) => {
        console.info('[WS]','event',_evt)
    })
})
