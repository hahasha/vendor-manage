const formatDate = date => {
  if (date.toString().length > 1) {
    return date
  } else {
    return '0' + date
  }
}
/**
 * getDate(0) 表示获取当天日期
 * getDate(-3) 表示获取3天前的日期
 *  */
export const getDate = day => {
  const date = new Date()
  const targetDate = date.getTime() + day * 24 * 60 * 60 * 1000 // 第day天的时间戳
  date.setTime(targetDate)
  const tYear = date.getFullYear()
  const tMouth = formatDate(date.getMonth() + 1)
  const tDay = formatDate(date.getDate())
  return tYear + '-' + tMouth + '-' + tDay
}
