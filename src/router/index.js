import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/Home/HomeVue.vue'
import LoginIn from '/src/views/LoginIn/LoginIn.vue'
import { inject } from 'vue'
import { useAuthorization } from '../stores/Authorization'
const err = inject('$err')
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      //初始时直接重定向
      redirect: '/basic/school',
      meta: {
        isAuthorization: true
      },
      children: [
        {
          path: 'basic/index',
          name: 'Index',
          component: () => import('../views/Basic/index/indexPage.vue'),
          meta: {
            isAuthorization: false
          }
        },
        {
          path: 'basic/school',
          name: 'School',
          component: () => import('../views/Basic/school/schoolPage.vue'),
          meta: {
            breadcrumb: '学校信息',
            isAuthorization: false
          }
        },
        {
          path: 'basic/school/edit/:id',
          name: 'SchoolEdit',
          component: () => import('../views/Basic/school/schoolEdit.vue'),
          meta: {
            breadcrumb: '学校信息编辑',
            isAuthorization: false
          }
        },
        {
          path: 'basic/teacher',
          name: 'Teacher',
          component: () => import('../views/Basic/teacher/teacherPage.vue'),
          meta: {
            isAuthorization: false
          }
        },
        {
          path: 'basic/teacher/edit/:id/:name/:IDnumber',
          name: 'TeacherEdit',
          component: () => import('../views/Basic/teacher/teacherEdit.vue'),
          meta: {
            isAuthorization: false
          }
        },
        {
          path: 'basic/student',
          name: 'Student',
          component: () => import('../views/Basic/student/studentPage.vue'),
          meta: {
            isAuthorization: false
          }
        },
        {
          path: 'basic/student/edit/:id',
          name: 'StudentEdit',
          component: () => import('../views/Basic/student/studentEdit.vue'),
          meta: {
            isAuthorization: false
          }
        },
        {
          path: 'basic/class',
          name: 'Class',
          component: () => import('../views/Basic/class/classPage.vue'),
          meta: {
            isAuthorization: false
          }
        },
        {
          path: 'basic/class/Edit/:id',
          name: 'ClassEdit',
          component: () => import('../views/Basic/class/classEdit.vue'),
          meta: {
            isAuthorization: false
          }
        },
        {
          path: 'basic/grade',
          name: 'Grade',
          component: () => import('../views/Basic/grade/gradePage.vue'),
          meta: {
            isAuthorization: false
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

router.beforeEach(async (to, from, next) => {
  const { isAuthorization } = useAuthorization()

  await isAuthorization.value

  if (!to.meta.isAuthorization) {
    next()
  } else {
    if (isAuthorization) {
      next()
    } else {
      err('请先登录')
      next({ name: 'LoginIn' })
    }
  }
})

export default router
