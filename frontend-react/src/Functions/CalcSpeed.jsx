const CalcSpeed = (unit, time, distance) => {
  // convert to mi or km
  if (unit !== 'Metric') distance = distance / 1609.344
  else distance = distance / 1000

  // speed = distance / (time / 3600)
  // converts time from seconds to hours
  return (distance / (time / 3600)).toFixed(2)
}

export default CalcSpeed