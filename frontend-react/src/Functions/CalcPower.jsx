const CalcPower = (unit, weight, time, total_elevation_gain ) => {
  if (unit !== 'Metric') weight = (weight * 0.453592)
  weight += 9.07185

  // power = 9.8 * weight * total_elevation_gain / time (+10% for resistance)
  return ((9.8 * weight * total_elevation_gain / time) * 1.1).toFixed(0)

}

export default CalcPower