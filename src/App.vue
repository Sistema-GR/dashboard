<template>
  <router-view></router-view>
</template>

<script>
import Login from "./views/Auth/Login/index.vue";
export default {
  components: {
    Login,
  },
};
</script>