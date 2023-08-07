import { userStore, postStore, testStore } from '@/store';

export default defineNuxtRouteMiddleware(async (to, from) => {
  await testStore.testApi();
  if(testStore.isOnline) {
    const token = useCookie('token').value;
    if (token) {
      await userStore.getCurrentUser();
      await postStore.getAllPost();
    }

    if (!token) {
      abortNavigation();
      return navigateTo('https://account.wolimby.hu/auth', { external: true });
    }

    if(to.name == undefined) return navigateTo('/home');
  } else {
    return navigateTo('https://account.wolimby.hu/auth', { external: true });
  }
});