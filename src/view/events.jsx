import React from 'react'
import Gantt from '/components/gantt.jsx'

export default class EventView extends React.Component{
    static defaultProps = {
    }
    constructor(props) {
      super(props)
    }
    render(){
        return (<section>
            <legend>requests</legend>
            <Gantt data={[]}></Gantt>
        </section>)
    }
}