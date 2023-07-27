import { userStore, testStore } from '@/store';

export default defineNuxtRouteMiddleware(async (to, from) => {
  await testStore.testApi();
  if(testStore.isOnline) {
    const token = useCookie('token').value;
    if (token) {
      await userStore.getCurrentUser();
    }
  }
});