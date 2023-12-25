import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGetData, usePostData } from '@/utils/asyncAxios'

export const useCommondata = defineStore('commondata', () => {
  const fetchGrades = async () => {
    try {
      const grades = ref([])
      const res = await useGetData('http://localhost:3000/grade')
      grades.value = res.data.data
      return grades.value
    } catch (error) {
      return error
    }
  }
  const fetchCourses = async () => {
    try {
      const course = ref([])
      const res = await useGetData('http://localhost:3000/subject')
      course.value = res.data.data
      return course.value
    } catch (error) {
      return error
    }
  }
  const fetchClass = async () => {
    try {
      const classes = ref([])
      const res = await usePostData('http://localhost:3000/class')
      classes.value = res.data.data
      return classes.value
    } catch (error) {
      return error
    }
  }
  const fetchTeachers = async (sub_id, g_id) => {
    try {
      if (sub_id != -1) {
        const res = await usePostData('http://localhost:3000/teacher', { sub_id: sub_id })
        return res.data
      } else {
        const res = await usePostData('http://localhost:3000/teacher', { g_id: g_id })
        return res.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    fetchGrades, // Expose the function to fetch grades
    fetchCourses,
    fetchClass,
    fetchTeachers
  }
})
