import React from 'react'
import PropTypes from 'prop-types'

import {
    AuthenticationError,
    ApplicationError,
    ServiceError,
    APIError,

    LOGIN_FAILED,
    LOGIN_REJECTED
} from '../../lib/errors.js'

export default class extends React.Component {
    static defaultProps = {
        promise: {}
    }
    static propTypes = {
        promise: PropTypes.object
    }
    constructor(props) {
        super(props)
        this.state = {
            ...props,
            user: '',
            pass: ''
        }
    }

    static getDerivedStateFromProps(props, state){
        console.log(props)
        return Object.assign(
            state,
            props
        )
    }

    submit(_e){
        this.props.promise.resolve(_e)
    }
    cancel(){
        this.props.promise.reject(LOGIN_REJECTED)
    }

    render(){
        return (
        <div className="modal--content">
            <h2>login</h2>
            <p>please enter your details below</p>
            <input type="email" defaultValue={this.state.user} placeholder="email" />
            <input type="password" defaultValue={this.state.pass} placeholder="password" />
            <button className="ok" onClick={this.submit.bind(this)}>submit</button>
            <button className="cancel" onClick={this.cancel.bind(this)}>cancel</button>
        </div>)
    }
}

