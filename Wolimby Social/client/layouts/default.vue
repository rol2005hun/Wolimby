<template>
  <Navbar v-if="$route.path !== '/auth'"/>
  <NuxtPage />
  <Notifications />
</template>
  
<script setup lang="ts">
import { notificationStore, testStore } from '@/store';

onMounted(() => {
  if(!testStore.isOnline) {
    notificationStore.addNotification({
      id: 0,
      type: 'information',
      message: 'A Wolimby Social szerverei jelenleg alszanak.'
    });
  }
});
</script>

<style lang="scss">
@import '@/assets/scss/default.scss';
</style>