/** @jsx h */
/** @jsxFrag Fragment */
import { h, app } from 'hyperapp'

import EventView from '/view/events.jsx'
import RootView  from '/view/root.jsx'
import EditorView from '/view/editor.jsx'
import AdminView from '/view/admin.jsx'

const routes = [
    ['dash','/',RootView],
    ['events','/events',EventView],
    ['admin','/admin',AdminView],
    ['editor','/editor',EditorView]
]
const Router = ({url}) =>
    console.log(url) ||
    (routes.find(([,_url]) =>
        url === _url)[2]
        || RootView)()

export {
    Router,
    routes
}
