/** @jsx h */
/** @jsxFrag Fragment */
import { h, app } from 'hyperapp'

import '/assets/base.scss'
import { Router, routes } from '/routes.js'


const MenuList = ({items, route, selected}) =>
    (<ol>{items.map(([label,url]) =>
        <li onClick={[route,url]} selected={url === selected}>{label}</li>
    )}</ol>)

export default ({route}) => ({url}) =>
    (<main>
        <hgroup>
            <h1>cast</h1>
            <MenuList items={routes} route={route} selected={url} />
        </hgroup>
        <section id="content">
            <Router url={url} />
        </section>
        <footer>
            <span>fnord software limited &copy; 2020</span>
        </footer>
    </main>)