//转换课程id为课程名
export const changeCourse = (str, course) => {
  // 添加检查确保 str 不为 null 或 undefined
  if (str === null || str === undefined) {
    console.error('Input string is null or undefined')
    return
  }
  // 否则，执行原先的逻辑
  const strs = str.split(',').map((item) => {
    return course.value.find((c) => c.ac_id == item)?.ac_name || 'unknown'
  })
  return strs.join(',')
}

//查找课程函数
export const findSub = (id1, id2, arr) => {
  return !arr.value.some((item) => item.c_ids == id1 || item.c_ids == id2)
}
export const changeWeek = (id) => {
  if (id == '1') return '星期一'
  else if (id == '2') return '星期二'
  else if (id == '3') return '星期三'
  else if (id == '4') return '星期四'
  else return '星期五'
}
export const timetableDay = (str, course) => {
  // 添加检查确保 str 不为 null 或 undefined
  if (str === null || str === undefined) {
    console.error('Input string is null or undefined')
    return
  }
  // 否则，执行原先的逻辑
  return str.split(',').map((item) => {
    return course.value.find((c) => c.mc_id == item)?.mc_name || 'unknown'
  })
}
