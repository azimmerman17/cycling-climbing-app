// Converts Delivered Date to Shown Date
// USe UTC Day for accuracy

const DateConv = (dateOrig) => {
  let newDate = new Date(dateOrig)

  // get day of week?
  let newDateDay = newDate.getUTCDay()     // gets day of week in number (Sunday = 0)
  let day                                   // string form of day of week
  switch (newDateDay) {
    case 0:
      day = 'Sun'
      break
    case 1:
      day = 'Mon'
      break
    case 2:
      day = 'Tue'
      break
    case 3:
      day = 'Wed'
      break
    case 4:
      day = 'Thu'
      break
    case 5:
      day = 'Fri'
      break
    case 6:
      day = 'Sat'
      break
    default:
      break
  }
  // get month
  let newDateMonth = newDate.getUTCMonth()      // Gets Month in number (January = 0)
  let month                                     // String form of the Month
  switch (newDateMonth) {
    case 0:
      month = 'January'
      break;
    case 1:
      month = 'Febuary'
      break
    case 2:
      month = 'March'
      break
    case 3:
      month = 'April'
      break
    case 4:
      month = 'May'
      break
    case 5:
      month = 'June'
      break
    case 6:
      month = 'July'
      break
    case 7:
      month = 'August'
      break
    case 8:
      month = 'September'
      break
    case 9:
      month = 'October'
      break
    case 10:
      month = 'November'
      break
    case 11:
      month = 'December'
      break 
    default:
      break;
  }

  // get day
  let date = newDate.getUTCDate()           // Gets Date in month no need to convert

  // get year
  let year = newDate.getUTCFullYear()       // Get 4 diget year no need to conver

  return `${day} ${month} ${date}, ${year}`
}

export default DateConv