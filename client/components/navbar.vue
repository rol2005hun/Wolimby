<template>
  <header>
    <nav class="nav">
      <NuxtLink to="/access" class="nav-branding">Account</NuxtLink>
      <ul class="nav-menu">
        <li class="nav-item" @click="toggleMenu(1)">
          <a href="#" class="nav-link" @click="toggleMenu(2)">Profilom</a>
          <ul class="nav-submenu">
            <li class="nav-submenu-link"><a href="#">Profilom</a></li>
            <li class="nav-submenu-link"><a href="#">Beállítások</a></li>
            <li class="nav-submenu-link"><a href="#">Kijelentkezés</a></li>
          </ul>
        </li>
      </ul>
      <div class="nav-hamburger" @click="toggleMenu(0)">
        <span class="nav-bar"></span>
        <span class="nav-bar"></span>
        <span class="nav-bar"></span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import '/assets/scss/navbar.scss';

function toggleMenu(option: number) {
  const body = document.querySelector('body');
  const hamburger = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-menu');
  const submenu = document.querySelector('.nav-submenu') as HTMLUListElement;

  if(option == 0) {
    if(!hamburger?.classList.contains('active') || !menu?.classList.contains('active')) {
      body!.style.overflowX = 'hidden';
      setTimeout(() => {
        body!.style.removeProperty('overflow-x'); // elegánsabbá kell tenni (scss-ben is)
      }, 200)
    }
    hamburger?.classList.toggle('active');
    menu?.classList.toggle('active');
  } else if(option == 1) {
    // hamburger?.classList.remove('active');
    // menu?.classList.remove('active');
  } else if(option == 2) {
    submenu.classList.toggle('active');
  }
}
</script>
  