//converts time from seconds to hh:mm:ss format

const TimeConvSec = (time) => {
  let hr = Math.floor(time / 3660)
  let min = Math.floor(time % 3660 / 60)
  let sec = Math.floor(time % 3660 % 60)
  
  if (time > 60 && sec <10) sec = `0${sec}`
  if (time > 3600 && min < 10) min = `0${min}`

  return `${hr > 0 ? `${hr}:` : ''}${min}:${sec}`
}

export default TimeConvSec