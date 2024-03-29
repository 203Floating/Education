// vue-plugin.js

import { success, err, warning } from './popupUtils'
import { usePostData, useDeleteData, useGetData, uselogin } from './asyncAxios'
import { changeCourse, findSub, changeWeek, timetableDay } from './courseUtils'
import { provide } from 'vue'
export default {
  install: (app) => {
    // 在全局提供计数器和增量函数
    app.config.globalProperties.$success = success
    app.config.globalProperties.$err = err
    app.config.globalProperties.$warning = warning
    app.config.globalProperties.$usePostData = usePostData
    app.config.globalProperties.$useGetData = useGetData
    app.config.globalProperties.$useDeleteData = useDeleteData
    app.config.globalProperties.$uselogin = uselogin
    app.config.globalProperties.$changeCourse = changeCourse
    app.config.globalProperties.$findSub = findSub
    app.config.globalProperties.$changeWeek = changeWeek
    app.config.globalProperties.$timetableDay = timetableDay
    // 在组件树的根部提供计数器和增量函数
    app.mixin({
      beforeCreate() {
        provide('$success', success)
        provide('$err', err)
        provide('$warning', warning)
        provide('$useDeleteData', useDeleteData)
        provide('$useGetData', useGetData)
        provide('$uselogin', uselogin)
        provide('$usePostData', usePostData)
        provide('$changeCourse', changeCourse)
        provide('$findSub', findSub)
        provide('$changeWeek', changeWeek)
        provide('$timetableDay', timetableDay)
      }
    })
  }
}
