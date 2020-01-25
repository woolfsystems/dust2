import { app } from 'hyperapp'
import withEvents from 'hyperapp-events'
import core from './core.jsx'

app(core(document.getElementById('app')))
