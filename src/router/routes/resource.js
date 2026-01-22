//Módulo de recursos
export default [
    { path: '/resource', name: 'resource', meta: { public: false, requiresAuth: true, roles: ['user','admin'] },
      children: [
        { path: '', name: 'resource-home', component: () => import('@/views/Admin/Resource/index.vue') },
        { path: 'info/:id', name: 'info', component: () => import('@/views/Admin/Resource/InfoDetails/index.vue'), props: true },         
        { path: 'relatorios-anuais', name: 'annual-reports', component: () => import('@/views/Admin/Resource/AnnualResource/AnnualReportsDashboard.vue') },
        { path: 'form', name: 'form',
          children: [
            { path: '', name: 'form-home', component: () => import('@/views/User/ResourceForm/index.vue') },
            { path: 'criteria', name: 'criteria', component: () => import('@/views/User/Criteria/index.vue') },
            { path: 'edit/:id', name: 'edit', component: () => import('@/views/User/Edit/index.vue') },
            { path: 'sucess', name: 'sucess', component: () => import('@/views/User/Sucess/index.vue') },
            { path: 'status', name: 'status', component: () => import('@/views/User/Status/index.vue') },
          ]
        },
      ]
    },
]