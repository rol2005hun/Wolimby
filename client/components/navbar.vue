<template>
  <header>
    <nav class="nav">
      <NuxtLink :to="isLoggedIn ? '/access' : '/auth'" class="nav-branding">Account</NuxtLink>
      <ul class="nav-menu">
        <li class="nav-item">
          <a v-if="isLoggedIn && isOnline" href="#" class="nav-link" @click="toggleMenu(2)">{{ currentUser.profile.username }}</a>
          <NuxtLink v-else to="/auth" class="nav-link" @click="toggleMenu(2)">Bejelentkezés</NuxtLink>
          <ul v-if="isLoggedIn && isOnline" class="nav-submenu">
            <li class="nav-submenu-link"><NuxtLink to="/profile">Profilom</NuxtLink></li>
            <li class="nav-submenu-link"><NuxtLink to="/settings">Beállítások</NuxtLink></li>
            <li class="nav-submenu-link"><p @click="logout()">Kijelentkezés</p></li>
          </ul>
        </li>
      </ul>
      <div class="nav-hamburger" @click="toggleMenu(1)">
        <span class="nav-bar"></span>
        <span class="nav-bar"></span>
        <span class="nav-bar"></span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { userStore, notificationStore, testStore } from '@/store';

const isDropdownActive = ref(false);
const { isLoggedIn, currentUser } = storeToRefs(userStore);
const { isOnline } = storeToRefs(testStore);

function toggleMenu(option: number) {
  const body = document.querySelector('body');
  const hamburger = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-menu');
  const submenu = document.querySelector('.nav-submenu') as HTMLUListElement;

  if (option === 1) {
    if (!hamburger?.classList.contains('active') || !menu?.classList.contains('active')) {
      body!.style.overflowX = 'hidden';
      setTimeout(() => {
        body!.style.removeProperty('overflow-x');
      }, 200);
    }
    hamburger?.classList.toggle('active');
    menu?.classList.toggle('active');
  } else if (option === 2) {
    submenu ? submenu.classList.toggle('active') : null;
    isDropdownActive.value = !isDropdownActive.value;
  }
}

onMounted(async () => {
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const menu = document.querySelector('.nav-menu');
  const hamburger = document.querySelector('.nav-hamburger');
  const submenu = document.querySelector('.nav-submenu') as HTMLUListElement;

  if (submenu  && menu && !menu.contains(target) && hamburger && !hamburger.contains(target)) {
    submenu.classList.remove('active');
    isDropdownActive.value = false;
  }
}

function logout() {
  userStore.logout();
  notificationStore.addNotification({
    id: 0,
    type: 'success',
    message: 'Sikeresen kijelentkezés.',
  });
}
</script>

<style lang="scss">
@import '@/assets/scss/navbar.scss';
</style>
    