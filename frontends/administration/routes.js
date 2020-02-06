import React from 'react'
import PropTypes from 'prop-types'

import EventView from '/view/events.jsx'
import RootView  from '/view/root.jsx'
import NodesView from '/view/nodes.jsx'
import ServicesView from '/view/services.jsx'
import JournalView from '/view/journal.jsx'
import RolesView from '/view/roles.jsx'

const routes = [
    ['events', '/events', EventView],
    ['journal', '/journal', JournalView],
    ['nodes', '/nodes', NodesView],
    ['services', '/services', ServicesView],
    ['roles', '/roles', RolesView]
]

class Router extends React.Component{
    static defaultProps = {
		url: '/'
	}
	
	static propTypes = {
		url: PropTypes.string
    }
    constructor(props) {
        super(props)
        this.state = {
            ...props
        }
    }
    static getDerivedStateFromProps({url}, state) {
        let _lookup = routes.find(([,_url]) =>
                url === _url)
        return typeof _lookup !== 'undefined'
            ? {
                url,
                view: _lookup[2]
            }
            : {
                url: '/',
                view: RootView
            }
    }
    render(){
        let TempView = this.state.view
        return (<TempView key={this.state.url} />)
    }
}

export {
    Router,
    routes
}
