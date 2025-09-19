import { createRouter, createWebHistory } from 'vue-router'
import { getUserType, canAccessRoute, getDashboardRoute } from '@/service/userType'
//Auth
import login from '../views/Auth/Login/index.vue'
import register from '../views/Auth/Register/index.vue'
import forgotpassword from '../views/Auth/ForgotPassword/index.vue'
import changepassword from '../views/Auth/ChangePassword/index.vue'
import insertcode from '../views/Auth/InsertCode/index.vue'
//Admin
import admin from '../views/Admin/index.vue'
import home from "@/views/Admin/Home/index.vue"
import newcal from '../views/Admin/Create/NewCal/index.vue'
import previousresults from '@/views/Admin/PreviousResults/index.vue'
import alloc from '@/views/Admin/AllocCalc/index.vue'
import imports from "@/views/Admin/Create/Imports/index.vue"
import dataversions from '@/views/Admin/DataDversions/index.vue'
import versionmanager from '@/views/Admin/Create/VersionManager/index.vue'
import roles from '@/views/Admin/Roles/index.vue'
import create from '@/views/Admin/Create/index.vue'
import selector from '@/views/Admin/Create/Selector/Index.vue'
import editversion from '@/views/Admin/Create/EditVersions/index.vue'
import permissionsaccess from '@/views/Admin/PermissionsAccess/index.vue'
import AnnualReportsDashboard from '@/views/Admin/Resource/AnnualResource/AnnualReportsDashboard.vue'
import createfromtemplate from '@/views/Admin/Create/CreateFromTemplate/index.vue'
//Resource
import resource from '@/views/Admin/Resource/index.vue'
import infodetails from '@/views/Admin/Resource/InfoDetails/index.vue'
//AdminPanel
import adminPanel from '@/views/AdminPanel/index.vue'
import dash from '@/views/AdminPanel/Dashboard/index.vue'
import report from '@/views/AdminPanel/Report/index.vue'
import rewards from '@/views/AdminPanel/Rewards/index.vue'
import FileManager from '@/views/AdminPanel/FileManager/index.vue'
//user
import user from '@/views/User/index.vue'
import form from '@/views/User/ResourceForm/index.vue'
import faqs from '@/views/User/Faqs/index.vue'
import criteria from '@/views/User/Criteria/index.vue'
import status from '@/views/User/Status/index.vue'
import edit from '@/views/User/Edit/index.vue'
import sucess from '@/views/User/Sucess/index.vue'
import config from '@/views/User/Config/index.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: login },
    {
      path: '/auth',
      name: 'auth',
      children: [
        { path: 'register', name: 'register', component: register },
        { path: 'changepassword', name: 'changepassword', component: changepassword },
        { path: 'forgotpassword', name: 'forgotpassword', component: forgotpassword },
        { path: 'insertcode', name: 'insertcode', component: insertcode },        
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: admin,
      children: [
        { path: 'overview', name: 'overview', component: home },
        { path: 'newcal', name: 'newcal', component: newcal },
        { path: 'previousresults', name: 'previousresults', component: previousresults },
        { path: 'imports', name: 'inports', component: imports },
        { path: 'config', name: 'configs', component: config },
        { path: 'alloc', name: 'alloc', component: alloc },
        { path: 'dataversions', name: 'dataversions', component: dataversions },
        { path: 'permissionsaccess', name: 'PermissionsAccess', component: permissionsaccess },
        {
          path: 'create',
          name: 'create',
          component: create,
          children: [
            { path: 'newcal', name: 'create-newcal', component: newcal },
            { path: 'imports', name: 'create-imports', component: imports },
            { path: 'from-template', name: 'create-from-template', component: createfromtemplate },
            { path: 'selector', name: 'selector', component: selector },
            { path: 'editversion/:id', name: 'editversion', component: editversion, props: true },
            { path: 'versionmanager/:id', name: 'versionmanager', component: versionmanager, props: true },
          ]
        }
      ]
    },
    
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      children: [
        { path: 'dashboard', name: 'dash', component: dash },
        { path: 'report', name: 'report', component: report },

        { path: 'files-manager', name: 'files-manager', component: FileManager },
        { path: 'roles', name: 'roles', component: roles },
        {
          path: 'recursos/relatorios-anuais',
          name: 'annual-reports',
          component: AnnualReportsDashboard
        },
      ]
    },
    { path: '/user', 
      name: 'user', 
      component: user,
      children: [
        { path: 'rewards', name: 'user-rewards', component: rewards },
        { path: 'form', name: 'form', component: form },
        { path: 'faqs', name: 'faqs', component: faqs },
        { path: 'criteria', name: 'criteria', component: criteria },
        { path: 'status', name: 'status', component: status },
        { path: 'edit/:id', name: 'edit', component: edit },
        { path: 'sucess', name: 'sucess', component: sucess },
        { path: 'config', name: 'config', component: config },
      ]
    },
    { path: '/resource', 
      name: 'resource', 
      component: resource,
      children: [

        { path: 'info', name: 'info', component: infodetails },
      ]
    },
    { 
      path: '/resource/info/:id',
      name: 'resource-details',
      component: infodetails,
      props: true
    },

    { 
      path: '/rewards/view',
      name: 'admin-view-rewards',
      component: rewards,
      meta: { requiresAdmin: true } 
    },

  ]
})

router.beforeEach((to, from, next) => {

  
  if (from.name === 'admin-view-rewards') {
    if (to.name !== 'admin-view-rewards') {
      localStorage.removeItem('tempTargetCpf');
    }
  }


  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = getUserType();

  const publicRoutes = ['login', 'register', 'forgotpassword', 'changepassword', 'insertcode'];
  
  if (publicRoutes.includes(to.name)) {
    if (isAuthenticated) {
      const redirectPath = getDashboardRoute();
      return next({ path: redirectPath });
    }
    return next();
  }

  if (!isAuthenticated) {
    return next({ name: 'login' });
  }

  if (!canAccessRoute(to.path)) {
    return next({ path: getDashboardRoute() });
  }

  next();

  
});

export default router;