import React from 'react'
import Gantt from '~/component/gantt.jsx'

export default class extends React.Component{
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
                <section style={{marginBottom: '0.5em'}}>
                    <legend>registrations</legend>
                    <Gantt data={[]} ratio={3}></Gantt>
                </section>
                <section style={{marginBottom: '0.5em'}}>
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