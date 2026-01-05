//Módulo de gerenciamento de cálculos
export default [
    { path: '/calculus', name: 'calculus', meta: { public: false, requiresAuth: true, roles: ['admin'] },
      children: [
        { path: 'dashboard', name: 'dash', component: () => import('@/views/AdminPanel/Dashboard/index.vue'),
          children: 
          { path: 'files-manager', name: 'files-manager', component: () => import('@/views/AdminPanel/FileManager/index.vue') },
        },                   
        { path: 'create', name: 'create', component: () => import('@/views/Admin/Create/Selector/index.vue'),
          children: [
            { path: 'newcal', name: 'create-newcal', component: () => import('@/views/Admin/Create/NewCal/index.vue') },
            { path: 'imports', name: 'create-imports', component: () => import('@/views/Admin/Create/Imports/index.vue') },
            { path: 'from-template', name: 'create-from-template', component: () => import('@/views/Admin/Create/CreateFromTemplate/index.vue') },
          ]
        },
        { path: 'versionmanager/:id?', name: 'versionmanager', component: () => import('@/views/Admin/Create/VersionManager/index.vue'), props: true, 
          children: { path: 'edit', name: 'editversion', component: () => import('@/views/Admin/Create/EditVersions/index.vue'), props: true },
        },
        { path: 'alloc', name: 'alloc', component: () => import('@/views/Admin/AllocCalc/index.vue') },
        { path: 'previousresults', name: 'previousresults', component: () => import('@/views/Admin/PreviousResults/index.vue') },
        { path: 'dataversions', name: 'dataversions', component: () => import('@/views/Admin/DataDversions/index.vue') },
        { path: 'report', name: 'report', component: () => import('@/views/AdminPanel/Report/index.vue') },
      ] 
    },
]