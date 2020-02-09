import React from 'react'
import PropTypes from 'prop-types'

import "~/assets/style/component/modal/login.scss"

import {
    AuthenticationError,
    ApplicationError,
    ServiceError,
    APIError,

    LOGIN_OK,
    LOGIN_FAILED,
    LOGIN_REJECTED
} from '~/lib/errors.js'

export default class extends React.Component {
    static defaultProps = {
        channel: {}
    }
    static propTypes = {
        channel: PropTypes.object
    }
    constructor(props) {
        super(props)
        this.state = {
            ...props,
            user: 'blah',
            pass: 'foop'
        }
    }

    static getDerivedStateFromProps(props, state){
        console.log(props)
        return Object.assign(
            state,
            props
        )
    }
    message(...args){
        return this.props.channel.postMessage(JSON.stringify(args))
    }

    submit(_e){
        this.message('resolve', LOGIN_OK)
    }
    cancel(){
        this.message('reject', LOGIN_REJECTED)    
    }

    render(){
        return (
        <fieldset className="modal--content types--modal--login">
            <h2>login</h2>
            <p>please enter your details below</p>
            <form>
                <view-input type="email" value={this.state.user} placeholder="email/username" required />
                <view-input type="password" value={this.state.pass} placeholder="password" required />
            </form>
            <button className="resolve" onClick={this.submit.bind(this)}>submit</button>
            <button className="reject" onClick={this.cancel.bind(this)}>cancel</button>
        </fieldset>)
    }
}

