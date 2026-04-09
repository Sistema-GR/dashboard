export default [
    { path: '/', redirect: { name: 'login' }, meta: { public: true, title: 'Login', layout: 'auth' } },
    { path: '/auth', name: 'auth', meta: { public: true },
      children: [
        { path: 'login', name: 'login', component: () => import('@/views/Auth/Login/index.vue')},
        { path: 'signup', name: 'signup', component: () => import('@/views/Auth/Register/index.vue') },
        { path: 'forgotpassword', name: 'forgotpassword', component: () => import('@/views/Auth/ForgotPassword/index.vue') },
        { path: 'changepassword', name: 'changepassword', component: () => import('@/views/Auth/ChangePassword/index.vue') },
        { path: 'insertcode', name: 'insertcode', component: () => import('@/views/Auth/InsertCode/index.vue') },
        { path: 'callback', name: 'auth-callback', component: () => import('@/views/Auth/Login/index.vue') },
      ]
    },
]