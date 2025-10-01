import { postStore } from '@/store';

export default defineNuxtRouteMiddleware(async (to, from) => {
    await postStore.getPost(to.params.id as string);
});