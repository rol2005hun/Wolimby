<template>
  <Navbar />
  <NuxtPage />
  <Notifications />
  <Footer />
</template>

<script setup lang="ts">
import { notificationStore, testStore } from '@/store';
import functions from '@/assets/ts/functions';

onMounted(() => {
  try {
    const bg = functions.getCookie('bgimage');
    if (import.meta.client && bg && bg !== 'none') {
      document.body.style.backgroundImage = 'url(' + bg + ')';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundSize = 'auto';
      document.body.style.animation = 'none';
    }
  } catch(e) {}

  if(!testStore.isOnline) {
    notificationStore.addNotification({
      id: 0,
      type: 'information',
      message: 'A Wolimby Games szerverei jelenleg alszanak.'
    });
  }
});
</script>

<style lang="scss">
@use '@/assets/scss/default.scss';
</style>