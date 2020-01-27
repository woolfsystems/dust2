
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
        console.log(selected)
        return {
            selected,
            ...state
        }
    }
    render(){
        return (<ol>{this.state.items.map(([label,url],_i) =>
            <li key={_i} onClick={e=>this.state.route(url)} selected={url === this.state.selected}>{label}</li>
        )}</ol>)
    }
}

export default class extends React.Component {
    static defaultProps = {
        pipes: { },
        url: '/events'
    }
    constructor(props) {
      super(props)
      this.state = {
          url: props.url
      }
    }
    route(url){
        console.log('u',url)
        this.setState({url})
    }
    render(){
        return (<React.Fragment>
            <hgroup>
                <h1>cast</h1>
                <MenuList items={routes} route={this.route.bind(this)} selected={this.state.url} />
            </hgroup>
            <section id="content">
                <Router url={this.state.url} />
            </section>
            <footer>
                <span>fnord software limited &copy; 2020</span>
            </footer>
            </React.Fragment>)
    }
}