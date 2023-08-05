import { createPinia } from 'pinia';
import { useUrlStore } from '@/store/modules/url';
import { useUserStore } from '@/store/modules/user';
import { useNotificationStore } from '@/store/modules/notification';
import { useTestStore } from '@/store/modules/test';

export const pinia = createPinia();

export const urlStore = useUrlStore(pinia);
export const userStore = useUserStore(pinia);
export const notificationStore = useNotificationStore(pinia);
export const testStore = useTestStore(pinia);