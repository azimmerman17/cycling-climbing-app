const CalcTime = (unit, weight, power, total_elevation_gain) => {
  //  TIME FORUMLA !!!! 
  // t = 9.8067 * kg * m / W (+ 0% to 10%) Resistance
  
  if (unit !== 'Metric') weight = (weight * 0.453592)
  weight += 9.07185

  return 9.8097 * weight * total_elevation_gain / power
}

export default CalcTime