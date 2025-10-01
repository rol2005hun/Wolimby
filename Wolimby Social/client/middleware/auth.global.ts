import axios from 'axios';
import { userStore, postStore, testStore } from '@/store';

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
    
    if (!token && to.name != 'post-id') {
      return navigateTo('https://account.wolimby.site/auth?redirectTo=' + useRequestURL().href, { external: true });
    }

    if(to.name == undefined) return navigateTo('/home');
  } else {
    return navigateTo('https://account.wolimby.site/auth?redirectTo=' + useRequestURL().href, { external: true });
  }
});