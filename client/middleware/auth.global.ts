import { userStore, testStore } from '@/store';
import axios from 'axios';

export default defineNuxtRouteMiddleware(async (to, from) => {
  await testStore.testApi();
  if(testStore.isOnline) {
    const token = useCookie('token').value;
    if (token) {
      axios.defaults.headers.common['Authorization'] = useCookie('token').value;
      await userStore.getCurrentUser();
      userStore.token = useCookie('token').value as string;
    }

    if(to.name == undefined) return navigateTo('/createlink');
  }
});