import React from 'react'
import PropTypes from 'prop-types'

import '~/assets/style/layout/modal.scss'

import {
    AuthenticationError,
    ApplicationError,
    ServiceError,
    APIError,

    LOGIN_FAILED,
    LOGIN_REJECTED
} from '../lib/errors.js'

export default class extends React.Component {
    static defaultProps = {
        stream: null,
        visible: false,
        promise: {},
        component: undefined
    }
    static propTypes = {
        stream: PropTypes.any,
        visible: PropTypes.bool,
        promise: PropTypes.object,
        component: PropTypes.any
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
        let ModalPromise = (typeof this.props.component !== 'undefined')
            ? this.props.component
            : ()=>(<div/>)
        return (
        <layer id="modal">
            <ModalPromise promise={this.props.promise} />
        </layer>)
    }
}