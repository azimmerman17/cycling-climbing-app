import { useState } from "react"
import { useParams } from "react-router-dom"

import StravaSample from '../flowingSprings'
import Segment_Title from "./Segment_TItle"
import RadioButtons from "./RadioButtons"

const Segments = () => {
  let { segmentId } = useParams()
  let [ radioNme, setRadioNme ] = useState('Details')
  let [ unit, setUnit ] = useState('Imperial')

  let segmentRadios = [
    'Details',
    'Training',
    'Plan'
  ]
  console.log(StravaSample)
  console.log(radioNme)

  return (
    <div>
      <Segment_Title data={StravaSample} unit={unit} setUnit={setUnit}/>
      {/* segment map and profile */}
      <RadioButtons radioNme={radioNme} setRadioNme={setRadioNme} radios={segmentRadios} />
      {/* Use Radios to change the view */}
    </div>

  )
}

export default Segments