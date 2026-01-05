export default [
    //Raíz redireciona para página de login
    { path: '/', redirect: { name: 'login' }, meta: { public: true, title: 'Login', layout: 'auth' } },
    //Módulo de autenticação
    { path: '/auth', name: 'auth', meta: { public: true },
      children: [
        { path: 'login', name: 'login', component: () => import('@/views/Auth/Login/index.vue')},
        { path: 'register', name: 'register', component: () => import('@/views/Auth/Register/index.vue') },
        { path: 'forgotpassword', name: 'forgotpassword', component: () => import('@/views/Auth/ForgotPassword/index.vue') },
        { path: 'changepassword', name: 'changepassword', component: () => import('@/views/Auth/ChangePassword/index.vue') },
        { path: 'insertcode', name: 'insertcode', component: () => import('@/views/Auth/InsertCode/index.vue') },        
      ]
    },
]