import React from 'react'

import '/assets/base.scss'
import { Router, routes } from '/routes.js'


class MenuList extends React.Component{
    static defaultProps = {
        items: [],
        selected: '',
        route: () => null
    }
    constructor(props) {
      super(props)
      this.state = {
          ...props
      }
    }
    static getDerivedStateFromProps({selected}, state){
        return Object.assign(
            state,
            {selected}
        )
    }
    render(){
        return (<ol>{this.state.items.map(([label,url],_i) =>
            <li key={_i} onClick={e=>this.state.route(url)} className={url === this.state.selected?'selected':''}>{label}</li>
        )}</ol>)
    }
}

export default class extends React.Component {
    static defaultProps = {
        pipes: { },
        url: '/',
        showLogin: false
    }
    constructor(props) {
      super(props)
      let _surl = localStorage.getItem('url')
      try{
          _surl = JSON.parse(_surl)
      }catch(e){
          _surl = '/'
      }
      this.state = {
          url: _surl,
          showLogin: props.showLogin
      }
    }
    
    route(url){
        localStorage.setItem('url',JSON.stringify(url))
        this.setState({url})
    }
    render(){
        console.log('r',this.state)
        return (<React.Fragment>
                <hgroup>
                    <h1>cast {this.state.showLogin?'LOGIN':''}</h1>
                    <MenuList items={routes} route={this.route.bind(this)} selected={this.state.url} />
                </hgroup>
                <section id="content">
                    <Router url={this.state.url} />
                </section>
                <footer>
                    <span>fnord &copy; 2020</span>
                </footer>
            </React.Fragment>)
    }
}