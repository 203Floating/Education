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
