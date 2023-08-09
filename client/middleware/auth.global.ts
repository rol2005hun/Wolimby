import { userStore, postStore, testStore } from '@/store';
import axios from 'axios';

export default defineNuxtRouteMiddleware(async (to, from) => {
  await testStore.testApi();
  if(testStore.isOnline) {
    const token = useCookie('token').value;
    if (token) {
      axios.defaults.headers.common['Authorization'] = useCookie('token').value;
      await userStore.getCurrentUser();
      await postStore.getAllPost();
      userStore.token = useCookie('token').value as string;
    }

    if (!token) {
      return navigateTo('http://localhost:3001/auth?redirectTo=' + useRequestURL().href, { external: true });
    }

    if(to.name == undefined) return navigateTo('/home');
  } else {
    return navigateTo('https://account.wolimby.hu/auth?redirectTo=' + useRequestURL().href, { external: true });
  }
});