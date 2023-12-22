import { userStore, chatStore } from '@/store';

export default defineNuxtRouteMiddleware(async (to, from) => {
    await userStore.getUsers();
    await chatStore.getUserChats(userStore.currentUser._id);
});