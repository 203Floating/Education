import { ElMessage } from 'element-plus'
export const success = (title) => {
  ElMessage({
    showClose: true,
    message: `${title}` || '恭喜你，这是一条成功消息',
    type: 'success'
  })
}
export const warning = (title) => {
  ElMessage({
    showClose: true,
    message: `${title}` || '恭喜你，这是一条成功消息',
    type: 'warning'
  })
}
export const err = (title) => {
  ElMessage({
    showClose: true,
    message: `${title}` || '恭喜你，这是一条成功消息',
    type: 'error'
  })
}
