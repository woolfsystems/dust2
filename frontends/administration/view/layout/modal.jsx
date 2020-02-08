import React from 'react'
import PropTypes from 'prop-types'

import '~/assets/style/layout/modal.scss'

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
        promise: PropTypes.shape({
            resolve: PropTypes.func,
            reject: PropTypes.func
        }),
        component: PropTypes.elementType
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

    render(){
        let ModalPromise = (typeof this.props.component !== 'undefined')
            ? this.props.component
            : ()=>(<div/>)
        return (
        <view-layer id="modal">
            <ModalPromise promise={this.props.promise} />
        </view-layer>)
    }
}