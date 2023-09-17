const getTrainingZone = (FTP, power) => {
  let ratio = power / FTP
  let trainingZone
  
  console.log(power, FTP, ratio)
  
  if (ratio < .55 ) return trainingZone = 'Zone 1: Active Recovery'
  else if (ratio < .75) return trainingZone = 'Zone 2: Endurance'
  else if (ratio < .83) return trainingZone = 'Zone 3: Tempo'
  else if (ratio < .90) return trainingZone = 'Zone 3: Tempo / Sweet Spot'
  else if (ratio < .97) return trainingZone = 'Sweet Spot/ Zone 4: Lactate Threshold'
  else if (ratio < 1.05) return trainingZone = 'Zone 4: Lactate Threshold'
  else if (ratio < 1.2) return trainingZone = 'Zone 5: VO2 Max'
  else if (ratio < 1.5) return trainingZone = 'Zone 6: Anaerobic Capacity'
  else if (ratio > 1.5) return 'Zone 7: Neuromuscular Power'

}

export default getTrainingZone
