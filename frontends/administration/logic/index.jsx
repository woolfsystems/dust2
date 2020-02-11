import React from 'react'
import ReactDOM from 'react-dom'
import Core from '~/logic/core.jsx'

ReactDOM.render(
    <Core />,
    document.querySelector('body > main')
)
document.addEventListener('DOMContentLoaded',() => {
//    document.body.classList.add('loaded')
    console.log('[dom]','loaded')
})
document.fonts.ready.then(() => {
    document.body.removeAttribute('loading')
    console.log('[fonts]','loaded')
})