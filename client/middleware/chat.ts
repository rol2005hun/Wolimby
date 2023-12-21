import { userStore, chatStore } from '@/store';

export default defineNuxtRouteMiddleware(async (to, from) => {
    await userStore.getUsers();
    await chatStore.getChats(userStore.currentUser._id);
});