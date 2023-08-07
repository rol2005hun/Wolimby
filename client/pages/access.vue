<template>
    <h1 class="text">Üdv <strong class="username-roles">{{ currentUser.profile?.username }}</strong>, a Wolimby Account-ban, a lenti ikonok közül az egyikre kattintva átírányítás történik meg.</h1>
    <div class="project">
        <div class="project-icon 1">
            <a :href="domains.domain1"><img src="https://i.imgur.com/N72oZnx.png" alt="domain1"></a>
        </div>
        <div class="project-icon 1">
            <a :href="domains.domain2"><img src="https://i.imgur.com/N72oZnx.png" alt="domain2"></a>
        </div>
        <div class="project-icon 3">
            <a :href="domains.domain3"><img src="https://i.imgur.com/SsMjPCz.png" alt="domain3"></a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { userStore } from '@/store';

const { currentUser } = storeToRefs(userStore);

interface Domains {
    domain1: string,
    domain2: string,
    domain3: string,
}
const domains = ref<Domains>({
    domain1: '',
    domain2: '',
    domain3: '',
});

onMounted(async () => {
    if (typeof window !== 'undefined') {
        domains.value = {
            domain1: `https://games.${location.hostname.split('.').slice(-2).join('.')}`,
            domain2: `http://shortify.${location.hostname.split('.').slice(-2).join('.')}`,
            domain3: `http://me.${location.hostname.split('.').slice(-2).join('.')}`,
        //   domain4: `https://cloud.${location.hostname.split('.').slice(-2).join('.')}`,
        //   domain5: `https://games.${location.hostname.split('.').slice(-2).join('.')}`,
        };
    }
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/access.scss';
</style>