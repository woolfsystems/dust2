import '/assets/base.scss'
import io from 'socket.io-client'

const socket = io('localhost:4000',{
    reconnection: true,
})
socket.on('connect', () => {
    console.log('WS','connected')
    socket.emit('clientCall','postcode.lookup',{postcode:'nw1 7rp', token: 'blah'},(_e, _r)=>{
        if(_e)
            console.error('WS',_e)
        else
            console.log('WS','res',_r)
    })
})
