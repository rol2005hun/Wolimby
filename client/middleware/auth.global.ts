import { userStore } from '@/store';

export default defineNuxtRouteMiddleware(async (to, from) => {
    await userStore.getCurrentUser();
    if(!userStore.isLoggedIn && to.name != 'auth') {
        return navigateTo('/auth');
    } else if(userStore.isLoggedIn && to.name == 'auth') {
        return navigateTo('/access');
    }
});