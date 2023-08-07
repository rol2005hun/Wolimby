import { createPinia } from 'pinia';
import { usePostStore } from '@/store/modules/post';
import { useCommentStore } from '@/store/modules/comment';
import { useReplyStore } from '@/store/modules/reply';
import { useUserStore } from '@/store/modules/user';
import { useNotificationStore } from '@/store/modules/notification';
import { useTestStore } from '@/store/modules/test';

export const pinia = createPinia();

export const postStore = usePostStore(pinia);
export const commentStore = useCommentStore(pinia);
export const replyStore = useReplyStore(pinia);
export const userStore = useUserStore(pinia);
export const notificationStore = useNotificationStore(pinia);
export const testStore = useTestStore(pinia);