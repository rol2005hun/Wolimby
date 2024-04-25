<template>
    <main class="createlink">
        <div class="container">
            <div class="forms">
                <div class="form">
                    <p class="title">Wolimby - Rövidítés</p>
                    <form @submit.prevent="createUrl">
                        <div class="input-field">
                            <input type="text" v-model="fullUrl" placeholder="Teljes link" required>
                            <i class="fa-solid fa-link"></i>
                        </div>
                        <div class="input-field">
                            <input type="text" v-model="shortUrl" placeholder="Rövidített link" minlength="3" maxlength="50" required>
                            <i class="fa-solid fa-link-slash"></i>
                        </div>
                        <div class="input-field button">
                            <input type="submit" value="Rövidítés">  
                        </div>
                    </form>
                    <div class="preview">
                        <span v-if="shortUrl" class="text">Előnézet: <a :href="'https://wby.hu/' + shortUrl">{{ 'https://wby.hu/' + shortUrl }}</a></span>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { urlStore, notificationStore } from '@/store';

const fullUrl = ref('');
const shortUrl = ref('');

function createUrl() {
    const url = {
        fullUrl: fullUrl.value,
        shortUrl: shortUrl.value
    }
    
    urlStore.createUrl(url).then(res => {
        if(res.data.success) {
            notificationStore.addNotification({
                id: 0,
                type: 'success',
                message: 'Sikeres URL rövidítés.'
            });
        }
    }).catch(() => {
        notificationStore.addNotification({
            id: 0,
            type: 'error',
            message: urlStore.$state.error
        });
    });
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/createlink.scss';
</style>