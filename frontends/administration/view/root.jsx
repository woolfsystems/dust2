import React from 'react'

export default class RootView extends React.Component{
    static defaultProps = {
    }
    constructor(props) {
      super(props)
    }
    render(){
        return (<section>
            <legend>overview</legend>
            <article className="popover"></article>
        </section>)
    }
}