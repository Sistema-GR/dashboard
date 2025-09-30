<!-- src/components/NotificationBell/index.vue -->
<template>
  <div class="relative">
    <button @click="toggleDropdown" class="relative text-white p-2 rounded-full hover:bg-white/20">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span v-if="unreadCount > 0" class="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
        {{ unreadCount }}
      </span>
    </button>

    <div v-if="isOpen" class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border max-h-96 overflow-y-auto">
      <div class="p-4 border-b font-bold text-gray-700">Notificações</div>
      <ul>
        <li v-if="!notifications.length" class="px-4 py-3 text-sm text-gray-500">Nenhuma notificação nova.</li>
        <li v-for="notification in notifications" :key="notification.id" @click="handleNotificationClick(notification)" class="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b">
          <p class="text-sm text-gray-800">{{ notification.message }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ formatDate(notification.created_at) }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const notifications = ref([]);
const isOpen = ref(false);
let pollingInterval = null;

const unreadCount = computed(() => notifications.value.length);

const fetchUnreadNotifications = async () => {
  try {
    const response = await axios.get('/api/notifications/unread/', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    notifications.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const markAsRead = async (notificationId) => {
  try {
    await axios.post(`/api/notifications/${notificationId}/mark-as-read/`, {}, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
  }
};

const handleNotificationClick = async (notification) => {
  await markAsRead(notification.id);
  
  // Remove a notificação da lista localmente para uma resposta de UI imediata
  notifications.value = notifications.value.filter(n => n.id !== notification.id);
  
  if (notification.link) {
    router.push(notification.link);
  }
  
  isOpen.value = false;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

onMounted(() => {
  fetchUnreadNotifications();
  // Verifica por novas notificações a cada 30 segundos
  pollingInterval = setInterval(fetchUnreadNotifications, 30000); 
});

onUnmounted(() => {
  clearInterval(pollingInterval);
});
</script>