import { userStore, testStore } from '@/store';

export default defineNuxtRouteMiddleware(async (to, from) => {
  await testStore.testApi();
  if(testStore.isOnline) {
    const token = useCookie('token').value;
    if (token) {
      await userStore.getCurrentUser();
  
      if(token && to.name == 'auth') {
        abortNavigation();
        return navigateTo('/access');
      }
    }

    if (!token && to.name != 'auth') {
      abortNavigation();
      return navigateTo('/auth');
    }

    if(to.name == undefined) return token ? navigateTo('/access') : navigateTo('/auth');
  } else if(to.name != 'auth' && from.name != 'auth') {
    return navigateTo('/auth');
  }
});