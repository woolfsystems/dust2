import React from 'react'
import { Route, Switch } from 'react-router-dom'

import '~/assets/style/layout/content.scss'

import { Router, routes } from '~/logic/routes.js'
import MenuList from '~/view/component/menulist.jsx'
import Quasi from '~/view/component/quasi.jsx'

const Rar = ({location}) => (<Router url={location.pathname} state={location.state} />)

export default class extends React.Component {
    static defaultProps = {
        pipes: { }
    }
    constructor(props) {
      super(props)

      this.streams = {
          modal: null
      }
    }
    render(){
        return (
        <view-layer id="content">
            <hgroup>
                <h1>dust<span>cast</span></h1>
                <MenuList items={routes} />
            </hgroup>
            <section id="content">
                <Route component={Rar} />
            </section>
            <footer>
                <span>fnord &copy; 2020</span>
            </footer>
        </view-layer>)
    }
}