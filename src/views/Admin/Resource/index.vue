<template>
    <Sidebar :route="'admin'" @update:isSidebarMinimized="handleSidebarMinimized" class="z-50"/>
  
    <Whiteboard title="Recurso" class="overflow-auto z-40 relative" :isSidebarMinimized="isSidebarMinimized">
        
        <div class="flex flex-row items-center w-full justify-start overflow-x-auto border border-gray-200 rounded-lg shadow-md">
            <Block title="Novo" number="100" customClass="bg-blue-500 hover:bg-blue-600" @click="navigateTo('/resource/new')" />
            <Block title="Em Progresso" number="20" customClass="bg-orange-500 hover:bg-orange-600" @click="navigateTo('/resource/inprogress')" />
            <Block title="Pendente" number="36" customClass="bg-yellow-500 hover:bg-yellow-600" @click="navigateTo('/resource/awaiting')" />
            <Block title="Reaberto" number="7" customClass="bg-red-500 hover:bg-red-600" @click="navigateTo('/resource/reopened')" />
            <Block title="Finalizado" number="76" customClass="bg-green-500 hover:bg-green-600" @click="navigateTo('/resource/completed')" />
            <Block title="Cancelado" number="20" customClass="bg-gray-500 hover:bg-gray-600" @click="navigateTo('/resource/canceled')" />
        </div>
    
    </Whiteboard>
  
    <router-view class="z-30 -translate-y-20"></router-view>
  </template>
  
<script>
import { provide, ref } from 'vue'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Block from '@/views/Admin/Resource/components/Block/index.vue'
import infoCard from '@/views/Admin/Resource/components/infoCard/index.vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import { FunnelIcon } from "@heroicons/vue/24/outline";
import { useRouter } from 'vue-router';

export default {
    name:"Recurso",
    components: {Whiteboard, Block, infoCard, FunnelIcon, Sidebar},

    setup() {
    const isSidebarMinimized = ref(false)
    const router = useRouter()

    function navigateTo(route) {
        router.push(route)
    }

    function handleSidebarMinimized(value) {
        isSidebarMinimized.value = value
    }

    provide('isSidebarMinimized', isSidebarMinimized)

    return {
      isSidebarMinimized,
      navigateTo,
      handleSidebarMinimized
    }
  }
}

</script>