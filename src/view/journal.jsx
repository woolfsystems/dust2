import React from 'react'
import Gantt from '/components/gantt.jsx'

export default class EventView extends React.Component{
    static defaultProps = {
    }
    constructor(props) {
      super(props)
      this.state = {
          ...props
      }
    }
    static getDerivedStateFromProps(props, state){
        return Object.assign(
            state,
            props
        )
    }
    render(){
        return (<React.Fragment>
                <section>
                    <legend>registrations</legend>
                    <Gantt data={[]} ratio={3}></Gantt>
                </section>
                <section>
                    <legend>applications</legend>
                    <Gantt data={[]} ratio={3}></Gantt>
                </section>
                <section>
                    <legend>conversions</legend>
                    <Gantt data={[]} ratio={3}></Gantt>
                </section>
            </React.Fragment>)
    }
}