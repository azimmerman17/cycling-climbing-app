const CalcTSS = (time, power, FTP) => {
  // TSS = (sec x power x IF®)/(FTP x 3600) x 100
  // IF = NP / FTP
  let intensityFactor = power / FTP
  return ((time * power * intensityFactor) / (FTP * 3600) * 100).toFixed(0)
}

export default CalcTSS
