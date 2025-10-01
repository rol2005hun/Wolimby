<template>
  <h1>{{ error }}</h1>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { urlStore } from '@/store';

const error = ref('');
const url = useRoute().params.link as string;

function redirect() {
  urlStore.getUrl(url).then(res => {
    if(res.data.success) {
      if (res.data.url.indexOf('http://') == 0 || res.data.url.indexOf('https://') == 0) {
        window.location.href = res.data.url;
      }
      else {
        window.location.href = 'http://' + res.data.url;
      }
    }
  }).catch(() => {
    error.value = urlStore.$state.error;
  });
}

redirect();
</script>

<style lang="scss" scoped>
@import '@/assets/scss/link.scss';
</style>