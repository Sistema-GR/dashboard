import { createRouter, createWebHistory } from 'vue-router'
//Auth
import login from '../views/Auth/Login/index.vue'
import register from '../views/Auth/Register/index.vue'
import forgotpassword from '../views/Auth/ForgotPassword/index.vue'
import changepassword from '../views/Auth/ChangePassword/index.vue'
import insertcode from '../views/Auth/InsertCode/index.vue'
//Admin
import admin from '../views/Admin/index.vue'
import home from "@/views/Admin/Home/index.vue"
import newcal from '../views/Admin/NewCal/index.vue'
import previousresults from '@/views/Admin/PreviousResults/index.vue'
import imports from "@/views/Admin/Imports/index.vue"
import dataversions from '@/views/Admin/DataDversions/index.vue'
//Resource
import resource from '@/views/Admin/Resource/index.vue'
import newResource from '@/views/Admin/Resource/NewResource/index.vue'
import inprogress from '@/views/Admin/Resource/InProgress/index.vue'
import awaiting from '@/views/Admin/Resource/Awaiting/index.vue'
import reopened from '@/views/Admin/Resource/Reopened/index.vue'
import completed from '@/views/Admin/Resource/Completed/index.vue'
import cancel from '@/views/Admin/Resource/Cancel/index.vue'
import infodetails from '@/views/Admin/Resource/InfoDetails/index.vue'
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
        { path: 'dataversions', name: 'dataversions', component: dataversions }
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
        { path: 'view', name: 'view', component: view }, 
        { path: 'edit', name: 'edit', component: edit },
        { path: 'sucess', name: 'sucess', component: sucess },
        { path: 'config', name: 'config', component: config },
      ]
    },
    { path: '/resource', 
      name: 'resource', 
      component: resource,
      children: [
        { path: 'new', name: 'newResource', component: newResource },
        { path: 'inprogress', name: 'inprogress', component: inprogress },
        { path: 'awaiting', name: 'awaiting', component: awaiting },
        { path: 'reopened', name: 'reopened', component: reopened },
        { path: 'completed', name: 'completed', component: completed },
        { path: 'canceled', name: 'cancel', component: cancel },
        { path: 'info', name: 'info', component: infodetails },
      ]
    },
  ]
})

export default router