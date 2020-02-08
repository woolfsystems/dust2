import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import EventView from '~/view/page/events.jsx'
import RootView  from '~/view/page/root.jsx'
import NodesView from '~/view/page/nodes.jsx'
import ServicesView from '~/view/page/services.jsx'
import JournalView from '~/view/page/journal.jsx'
import RolesView from '~/view/page/roles.jsx'

const SITE_TITLE = 'Dust/Cast'
const SITE_URL = 'http://localhost:4000'

const routes = [
    ['Events', '/events', EventView],
    ['Journal', '/journal', JournalView],
    ['Nodes', '/nodes', NodesView],
    ['Services', '/services', ServicesView],
    ['Roles', '/roles', RolesView]
]

class Router extends React.Component{
    static defaultProps = {
        url: '/',
        title: '',
        view: undefined
	}
	static propTypes = {
        url: PropTypes.string,
        title: PropTypes.string,
        view: PropTypes.elementType
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
                view: _lookup[2],
                title: _lookup[0]
            }
            : {
                url: '/',
                view: RootView,
                title: ''
            }
    }
    render(){
        let TempView = this.state.view
        return (
        <React.Fragment>
            <Helmet titleTemplate={`${SITE_TITLE} - %s`} defaultTitle={SITE_TITLE}>
                <title>{this.state.title}</title>
                <meta charSet="utf-8" />

                <base target="_blank" href={`${SITE_URL}/`} />
                <link rel="canonical" href={`${SITE_URL}${this.state.url}`} />

                <meta name="description" content="Distributed uninterruptable service tree" />
            </Helmet>
            <TempView key={this.state.url} />
        </React.Fragment>)
    }
}

export {
    Router,
    routes
}
