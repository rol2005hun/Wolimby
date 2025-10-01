<template>
  <Navbar/>
  <NuxtPage />
  <Notifications />
</template>

<script setup lang="ts">
import { notificationStore, testStore } from '@/store';
import functions from '@/assets/ts/functions';

function getRedirect() {
  const redirect = functions.getCookie('redirect');
  if(!redirect) {
    functions.setCookie('redirect', 'true', 999);
  }
}

onMounted(() => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('A serviceWorker nem fut ebben a böngészőben.');
  }

  navigator.serviceWorker.register('./sw.js');
  if(!testStore.isOnline) {
    notificationStore.addNotification({
      id: 0,
      type: 'information',
      message: 'A Wolimby szerverei jelenleg alszanak.'
    });
  }
});
</script>

<style lang="scss">
@use '@/assets/scss/default.scss';
</style>