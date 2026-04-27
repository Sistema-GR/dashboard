//Módulo de usuários
export default [
    { path: '/user', name: 'user', meta: { public: false, requiresAuth: true }, redirect: { name: 'home' },
      children: [
        { path: 'home', name: 'home', component: () => import('@/views/Admin/Home/index.vue') },
        { path: 'rewards', name: 'rewards', component: () => import('@/views/AdminPanel/Rewards/index.vue')},     
        { path: 'faqs', name: 'faqs', component: () => import('@/views/User/Faqs/index.vue') },       
        { path: 'config', name: 'configs', component: () => import('@/views/User/Config/index.vue') },
        { path: 'permissionsaccess', name: 'permissions-access', component: () => import('@/views/Admin/PermissionsAccess/index.vue'), meta: { requiresAdmin: true } },
      ]
    },
]