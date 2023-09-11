const CalcPower = (unit, weight, time, total_elevation_gain ) => {
  if (unit !== 'Metric') weight = (weight * 0.453592)
  weight += 9.07185

  // power = 9.8 * weight * total_elevation_gain / time
  return Math.floor(9.8 * weight * total_elevation_gain / time).toFixed(0)

}

export default CalcPower