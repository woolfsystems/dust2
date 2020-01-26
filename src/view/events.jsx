/** @jsx h */
/** @jsxFrag Fragment */

import { h, app } from 'hyperapp'
import Gantt from '/components/gantt.jsx'

const View = state =>
    (<section>
        <legend>requests</legend>
        <Gantt data={[]}></Gantt>
    </section>)

export default View