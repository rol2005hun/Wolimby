import { userStore, testStore } from '@/store';
import axios from 'axios';
import UserProfile from '@/assets/types/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
    if(useCookie('redirect').value || to.query.source === 'pwa') {
        return navigateTo('https://account.wolimby.hu', { external: true });
    } else {
        await testStore.testApi();
        if(testStore.isOnline) {
            const token = useCookie('token').value;
            if (token) {
                axios.defaults.headers.common['Authorization'] = useCookie('token').value;
                await userStore.getCurrentUser();
                userStore.token = useCookie('token').value as string;
            } else {
                userStore.currentUser = {} as UserProfile;
                userStore.token = '';
            }
        }
    }
});