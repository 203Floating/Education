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
      redirect: '/course',
      meta: {
        isAuthorization: true
      },
      children: [
        {
          path: 'basic/index',
          name: 'Index',
          component: () => import('../views/Basic/index/indexPage.vue'),
          meta: {
            isAuthorization: true
          }
        },
        {
          path: 'basic/school',
          name: 'School',
          component: () => import('../views/Basic/school/schoolPage.vue'),
          meta: {
            breadcrumb: '学校信息',
            isAuthorization: true
          }
        },
        {
          path: 'basic/school/edit/:id',
          name: 'SchoolEdit',
          component: () => import('../views/Basic/school/schoolEdit.vue'),
          meta: {
            breadcrumb: '学校信息编辑',
            isAuthorization: true
          }
        },
        {
          path: 'basic/teacher',
          name: 'Teacher',
          component: () => import('../views/Basic/teacher/teacherPage.vue'),
          meta: {
            isAuthorization: true
          }
        },
        {
          path: 'basic/teacher/edit/:id/:name/:IDnumber',
          name: 'TeacherEdit',
          component: () => import('../views/Basic/teacher/teacherEdit.vue'),
          meta: {
            isAuthorization: true
          }
        },
        {
          path: 'basic/student',
          name: 'Student',
          component: () => import('../views/Basic/student/studentPage.vue'),
          meta: {
            isAuthorization: true
          }
        },
        {
          path: 'basic/student/edit/:id',
          name: 'StudentEdit',
          component: () => import('../views/Basic/student/studentEdit.vue'),
          meta: {
            isAuthorization: true
          }
        },
        {
          path: 'basic/class',
          name: 'Class',
          component: () => import('../views/Basic/class/classPage.vue'),
          meta: {
            isAuthorization: true
          }
        },
        {
          path: 'basic/class/Edit/:id',
          name: 'ClassEdit',
          component: () => import('../views/Basic/class/classEdit.vue'),
          meta: {
            isAuthorization: true
          }
        },
        {
          path: 'basic/grade',
          name: 'Grade',
          component: () => import('../views/Basic/grade/gradePage.vue'),
          meta: {
            isAuthorization: true
          }
        },
        {
          path: '/course',
          name: 'course',
          redirect: '/course/page',
          component: () => import('../views/course/courseVue.vue'),
          children: [
            {
              path: 'interest',
              name: 'interest',
              component: () => import('../views/course/interest/coursePage.vue'),
              meta: {
                isAuthorization: false
              }
            },
            {
              path: 'select',
              name: 'selectPage',
              redirect: '/course/select/add',
              component: () => import('../views/course/selectSet/selectPage.vue'),
              children: [
                {
                  path: 'add',
                  name: 'selectAdd',
                  component: () => import('../views/course/selectSet/selectAdd.vue'),
                  meta: {
                    isAuthorization: false
                  }
                },
                {
                  path: 'student/:id',
                  name: 'selectStudent',
                  component: () => import('../views/course/selectSet/selectStudent.vue'),
                  meta: {
                    isAuthorization: false
                  }
                },
                {
                  path: 'set',
                  name: 'selectSet',
                  redirect: '/course/select/set/number',
                  component: () => import('../views/course/selectSet/selectSet.vue'),
                  meta: {
                    isAuthorization: false
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
              path: 'page',
              name: 'coursePage',
              component: () => import('../views/course/selectSet/coursePage.vue'),
              meta: {
                isAuthorization: false
              }
            }
          ]
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
  const { isAuthorization } = useAuthorization()

  try {
    if (!to.meta.isAuthorization || isAuthorization()) {
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
