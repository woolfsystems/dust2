import { Promise } from 'bluebird'
import React from 'react'
import ReactDOM from 'react-dom'
import Core from '~/src/core.jsx'

global.Promise=Promise

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