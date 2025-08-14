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
//Resource
import resource from '@/views/Admin/Resource/index.vue'
import infodetails from '@/views/Admin/Resource/InfoDetails/index.vue'
import annualReports from '@/views/Admin/Resource/AnnualResource/AnnualReportsDashboard.vue'
//AdminPanel
import adminPanel from '@/views/AdminPanel/index.vue'
import dash from '@/views/AdminPanel/Dashboard/index.vue'
import result from '@/views/AdminPanel/Results/index.vue'
import professional from '@/views/AdminPanel/Professional/index.vue'
import steps from '@/views/AdminPanel/Steps/index.vue'
import frequency from '@/views/AdminPanel/Frequency/index.vue'
import infrequency from '@/views/AdminPanel/InfrequencyReason/index.vue'
import resignation from '@/views/AdminPanel/Resignation/index.vue'
import activities from '@/views/AdminPanel/Activities/index.vue'
import service from '@/views/AdminPanel/Service/index.vue'
import training from '@/views/AdminPanel/Training/index.vue'
import report from '@/views/AdminPanel/Report/index.vue'
import groups from '@/views/AdminPanel/Groups/index.vue'
import stagegroup from '@/views/AdminPanel/StageGroup/index.vue'
import rewards from '@/views/AdminPanel/Rewards/index.vue'
import calendar from "@/views/AdminPanel/Calendar/index.vue"
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
import view from '@/views/User/ViewResource/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: login },
    { path: '/register', name: 'register', component: register },
    { path: '/changepassword', name: 'changepassword', component: changepassword },
    { path: '/forgotpassword', name: 'forgotpassword', component: forgotpassword },
    { path: '/insertcode', name: 'insertcode', component: insertcode },
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
            { path: 'versionmanager', name: 'versionmanager', component: versionmanager },
            { path: 'selector', name: 'selector', component: selector },
            { path: 'editversion', name: 'editversion', component: editversion },
          ]
        }
      ]
    },
    
    {
      path: '/admin',
      name: 'adminPanel',
      component: adminPanel,
      children: [
        { path: 'dashboard', name: 'dash', component: dash },
        { path: 'results', name: 'results', component: result },
        { path: 'professional', name: 'professional', component: professional },
        { path: 'groups', name: 'groups', component: groups },
        { path: 'steps', name: 'steps', component: steps },
        { path: 'stagegroup', name: 'stagegroup', component: stagegroup },
        { path: 'frequency', name: 'frequency', component: frequency },
        { path: 'infrequency', name: 'infrequency', component: infrequency },
        { path: 'resignation', name: 'resignation', component: resignation },
        { path: 'activities', name: 'activities', component: activities },
        { path: 'service', name: 'service', component: service },
        { path: 'training', name: 'training', component: training },
        { path: 'report', name: 'report', component: report },
        { path: 'rewards', name: 'reward', component: rewards },
        { path: 'calendar', name: 'calendar', component: calendar },
        { path: 'files-manager', name: 'files-manager', component: FileManager },
        { path: 'roles', name: 'roles', component: roles },
      ]
    },
    { path: '/user', 
      name: 'user', 
      component: user,
      children: [
        { path: 'rewards', name: 'rewards', component: rewards },
        { path: 'form', name: 'form', component: form },
        { path: 'faqs', name: 'faqs', component: faqs },
        { path: 'criteria', name: 'criteria', component: criteria },
        { path: 'status', name: 'status', component: status },
        // { path: 'view', name: 'view', component: view }, 
        { path: 'view/:id', name: 'view', component: view },
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
        { path: 'relatorios-anuais', name: 'annual-reports', component: annualReports },
      ]
    },
    { 
      path: '/resource/info/:id',
      name: 'resource-details',
      component: infodetails,
      props: true
    },
    // Rota adicional para acessar diretamente os relatórios anuais
    { 
      path: '/admin/recursos/relatorios-anuais',
      name: 'admin-annual-reports',
      component: annualReports
    },
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = getUserType();

  // Public routes that don't require authentication
  const publicRoutes = ['login', 'register', 'forgotpassword', 'changepassword', 'insertcode'];
  
  if (publicRoutes.includes(to.name)) {
    // If user is authenticated and trying to access auth pages, redirect to appropriate dashboard
    if (isAuthenticated) {
      const redirectPath = getDashboardRoute();
      return next({ path: redirectPath });
    }
    return next();
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return next({ name: 'login' });
  }

  // Check if user can access the route
  if (!canAccessRoute(to.path)) {
    return next({ path: getDashboardRoute() });
  }

  next();
});

export default router;
