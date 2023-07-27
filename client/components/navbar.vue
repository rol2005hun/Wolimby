<template>
  <header>
    <nav class="nav">
      <NuxtLink to="/" class="nav-branding">Games</NuxtLink>
      <ul class="nav-menu">
        <li class="nav-item">
          <a v-if="isLoggedIn && isOnline" href="#" class="nav-link" @click="toggleMenu(2)">{{ currentUser.profile.username }}</a>
          <a v-else :href="functions.getDomain() + ':3000/auth'" class="nav-link">Bejelentkezés</a>
          <ul v-if="isLoggedIn && isOnline" class="nav-submenu">
            <li class="nav-submenu-link"><a :href="functions.getDomain() + ':3000/profile'">Profilom</a></li>
            <li class="nav-submenu-link"><a :href="functions.getDomain() + ':3000/settings'">Beállítások</a></li>
            <li class="nav-submenu-link"><a href="#" @click="userStore.logout()">Kijelentkezés</a></li>
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
import { userStore, testStore } from '@/store';
import functions from '@/assets/ts/functions';

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
    submenu.classList.toggle('active');
    isDropdownActive.value = !isDropdownActive.value;
  }
}

onMounted(async () => {
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  document.addEventListener('click', handleOutsideClick);
});

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const menu = document.querySelector('.nav-menu');
  const hamburger = document.querySelector('.nav-hamburger');
  const submenu = document.querySelector('.nav-submenu') as HTMLUListElement;

  if (menu && !menu.contains(target) && hamburger && !hamburger.contains(target)) {
    submenu.classList.remove('active');
    isDropdownActive.value = false;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/navbar.scss';
</style>
    