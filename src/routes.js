import React from 'react'
import PropTypes from 'prop-types'

import EventView from '/view/events.jsx'
import RootView  from '/view/root.jsx'
import EditorView from '/view/editor.jsx'
import AdminView from '/view/admin.jsx'
import JournalView from '/view/journal.jsx'

const routes = [
    ['dash','/',RootView],
    ['events','/events',EventView],
    ['journal','/journal',JournalView],
    ['admin','/admin',AdminView],
    ['editor','/editor',EditorView]
]

class Router extends React.Component{
    static defaultProps = {
		url: ''
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
    static getDerivedStateFromProps({url}, state){
        return {
            url,
            view: routes.find(([,_url]) =>
                url === _url)[2]
                || RootView,
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
