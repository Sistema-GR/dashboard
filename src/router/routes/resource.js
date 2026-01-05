//Módulo de recursos
export default [
    { path: '/resource', name: 'resource', meta: { public: false, requiresAuth: true, roles: ['user','admin'] }, component: () => import('@/views/Admin/Resource/index.vue'),
      children: [
        { path: 'info', name: 'info',
            children: { path: '/:id', name: 'resource-details', component: () => import('@/views/Admin/Resource/InfoDetails/index.vue'), props: true }, 
        },
        { path: 'relatorios-anuais', name: 'annual-reports', component: () => import('@/views/Admin/Resource/AnnualResource/AnnualReportsDashboard.vue') },
        { path: 'form', name: 'form', component: () => import('@/views/User/ResourceForm/index.vue'),
          children: [
            { path: 'criteria', name: 'criteria', component: () => import('@/views/User/Criteria/index.vue') },
            { path: 'edit/:id', name: 'edit', component: () => import('@/views/User/Edit/index.vue') },
            { path: 'sucess', name: 'sucess', component: () => import('@/views/User/Sucess/index.vue') },
            { path: 'status', name: 'status', component: () => import('@/views/User/Status/index.vue') },
          ]
        },
      ]
    },
]