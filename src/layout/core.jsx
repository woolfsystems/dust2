/** @jsx h */
/** @jsxFrag Fragment */
import { h, app } from 'hyperapp'

import '/assets/base.scss'
import { Router, routes } from '/routes.js'


const MenuList = ({items, route, state: {url}}) =>
    (<ol>{items.map(([label,_url]) =>
        <li onClick={[route,_url]} selected={_url === url}>{label}</li>
    )}</ol>)
    
export default (initial, actions) =>
    (state = initial) =>
        (<main>
            <hgroup>
                <h1>cast</h1>
                <MenuList items={routes} route={actions.router} state={state} />
            </hgroup>
            <section id="content">
                <Router url={state.url} />
            </section>
            <footer>
                <span>fnord software limited &copy; 2020</span>
            </footer>
        </main>)

// h("main", {}, [
//     h("h1", {}, state),
//     h("button", { onClick: state => state - 1 }, "-"),
//     h("button", { onClick: state => state + 1 }, "+")
// ])