import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/Home/HomeVue.vue'
import LoginIn from '/src/views/LoginIn/LoginIn.vue'
import { useAuthorization } from '../stores/Authorization'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      //初始时直接重定向
      redirect: '/basic/index',
      meta: {
        isAuthorization: false
      },
      children: [
        {
          path: 'basic/index',
          name: 'Index',
          component: () => import('../views/Basic/index/indexPage.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '2'
          }
        },
        {
          path: 'basic/school',
          name: 'School',
          component: () => import('../views/Basic/school/schoolPage.vue'),
          meta: {
            breadcrumb: '学校信息',
            isAuthorization: true,
            authorzation: '2'
          }
        },
        {
          path: 'basic/school/edit/:id',
          name: 'SchoolEdit',
          component: () => import('../views/Basic/school/schoolEdit.vue'),
          meta: {
            breadcrumb: '学校信息编辑',
            isAuthorization: true,
            authorzation: '2'
          }
        },
        {
          path: 'basic/teacher',
          name: 'Teacher',
          component: () => import('../views/Basic/teacher/teacherPage.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '2'
          }
        },
        {
          path: 'basic/teacher/edit/:id/:name/:IDnumber',
          name: 'TeacherEdit',
          component: () => import('../views/Basic/teacher/teacherEdit.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '2'
          }
        },
        {
          path: 'basic/student',
          name: 'Student',
          component: () => import('../views/Basic/student/studentPage.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '2'
          }
        },
        {
          path: 'basic/student/edit/:id',
          name: 'StudentEdit',
          component: () => import('../views/Basic/student/studentEdit.vue'),
          meta: {
            isAuthorization: false
            // authorzation: '2'
          }
        },
        {
          path: 'basic/class',
          name: 'Class',
          component: () => import('../views/Basic/class/classPage.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '2'
          }
        },
        {
          path: 'basic/class/Edit/:id',
          name: 'ClassEdit',
          component: () => import('../views/Basic/class/classEdit.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '2'
          }
        },
        {
          path: 'basic/grade',
          name: 'Grade',
          component: () => import('../views/Basic/grade/gradePage.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '2'
          }
        },
        {
          path: '/course',
          name: 'course',
          // redirect: '/course/page',
          component: () => import('../views/course/courseVue.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '2'
          },
          children: [
            {
              path: 'interest',
              name: 'interest',
              component: () => import('../views/course/interest/coursePage.vue'),
              meta: {
                isAuthorization: true,
                authorzation: '2'
              }
            },
            {
              path: 'page',
              name: 'coursePage',
              component: () => import('../views/course/selectSet/coursePage.vue'),
              meta: {
                isAuthorization: false
              }
            },
            {
              path: 'table',
              name: 'alltable',
              component: () => import('../views/course/timetable/timeTable.vue'),
              meta: {
                isAuthorization: false
              }
            },
            {
              path: 'select',
              name: 'selectPage',
              redirect: '/course/select/add',
              component: () => import('../views/course/selectSet/selectPage.vue'),
              meta: {
                isAuthorization: true
              },
              children: [
                {
                  path: 'add',
                  name: 'selectAdd',
                  component: () => import('../views/course/selectSet/selectAdd.vue'),
                  meta: {
                    isAuthorization: true
                  }
                },
                {
                  path: 'student/:id',
                  name: 'selectStudent',
                  component: () => import('../views/course/selectSet/selectStudent.vue'),
                  meta: {
                    isAuthorization: true
                  }
                },
                {
                  path: 'set/:id',
                  name: 'selectSet',
                  // redirect: '/course/select/set/number',
                  component: () => import('../views/course/selectSet/selectSet.vue'),
                  meta: {
                    isAuthorization: true
                  },
                  children: [
                    {
                      path: 'number/:id',
                      name: 'number',
                      component: () => import('../views/course/selectSet/set/numSelect.vue')
                    },
                    {
                      path: 'mutual/:id',
                      name: 'mutual',
                      component: () => import('../views/course/selectSet/set/mutualSelect.vue')
                    },
                    {
                      path: 'connect/:id',
                      name: 'connect',
                      component: () => import('../views/course/selectSet/set/connectSelect.vue')
                    },
                    {
                      path: 'forbid/:id',
                      name: 'forbid',
                      component: () => import('../views/course/selectSet/set/forbidSelect.vue')
                    }
                  ]
                }
              ]
            },
            {
              path: 'DetailSelect',
              name: 'DetailSelect',
              redirect: '/course/detailSelect/DetailContent',
              component: () => import('../views/course/detail/detailPage.vue'),
              children: [
                {
                  path: 'DetailContent/:id',
                  name: 'DetailContent',
                  component: () => import('../views/course/detail/detailContent.vue')
                },
                {
                  path: 'DetailData/:id',
                  name: 'DetailData',
                  component: () => import('../views/course/detail/detailData.vue')
                }
              ]
            }
          ]
        },
        {
          path: 'teacherManage',
          name: 'teacherManage',
          component: () => import('../views/TeacherAuthority/classManage.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '1'
          }
        },
        {
          path: 'teacherEdit',
          name: 'teacherEdit',
          component: () => import('../views/TeacherAuthority/teacherEdit.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '1'
          }
        },
        {
          path: 'studentManage',
          name: 'studentManage',
          component: () => import('../views/TeacherAuthority/studentManage.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '1'
          }
        },
        {
          path: 'selectCourse',
          name: 'selectCourse',
          component: () => import('../views/StudentAuthority/selectCourse.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '0'
          }
        },
        {
          path: 'timeTable',
          name: 'timeTable',
          component: () => import('../views/StudentAuthority/timeTable.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '0'
          }
        },
        {
          path: 'studentEdit',
          name: 'studentEdit',
          component: () => import('../views/StudentAuthority/studentEdit.vue'),
          meta: {
            isAuthorization: true,
            authorzation: '0'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'LoginIn',
      component: LoginIn,
      meta: {
        isAuthorization: false
      }
    },
    {
      path: '/reset',
      name: 'Reset',
      component: () => import('../views/LoginIn/Reset/restPwd.vue'),
      meta: {
        isAuthorization: false
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  const { isAuthorization, getAuthority } = useAuthorization()
  const { level } = getAuthority()
  try {
    if (!to.meta.isAuthorization) {
      next()
    } else if ((isAuthorization() && to.meta.authorzation, level == to.meta.authorzation)) {
      next()
    } else {
      next({ name: 'LoginIn' })
    }
  } catch (error) {
    console.error('检查授权时出错:', error)
    next({ name: 'LoginIn' })
  }
})

export default router
