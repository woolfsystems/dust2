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
        return (<section>
            <legend>requests</legend>
            <Gantt data={[]} ratio={3}></Gantt>
        </section>)
    }
}