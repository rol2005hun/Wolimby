<template>
  <main class="index">
    <div class="container">
      <div class="forms">
        <div class="form login">
          <p class="title">Wolimby - Bejelentkezés</p>
          <form @submit.prevent="login">
            <div class="input-field">
              <input type="text" v-model="username" placeholder="Felhasználónév / Email cím" autocomplete="email" required>
              <i class="fa-solid fa-user"></i>
            </div>
              <div class="input-field">
              <input type="password" v-model="password" class="password" placeholder="Jelszó" autocomplete="password" required>
              <i class="uil uil-key-skeleton icon"></i>
              <i class="fa-solid fa-lock"></i>
            </div>
            <div class="checkbox-text">
              <div class="checkbox-content">
                <input type="checkbox" v-model="checkbox" id="logCheck">
                <label for="logCheck" class="text">Jegyezz meg</label>
              </div>
              <a href="#" class="text">Elfelejtetted a jelszavad?</a>
            </div>
            <div class="input-field button">
              <input type="submit" value="Bejelentkezés">  
            </div>
          </form>
          <div class="login-signup">
            <span class="text">Még nem vagy tag?
              <a href="#" class="text signup-link" @click="toggleForm(0)">Regisztrálj!</a>
            </span>
          </div>
        </div>
        <div class="form signup">
          <p class="title">Wolimby - Regisztráció</p>
          <form @submit.prevent="register">
            <div class="input-field">
              <input type="text" v-model="username" placeholder="Felhasználónév" autocomplete="username" required>
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="input-field">
              <input type="text" v-model="email" placeholder="Email cím" autocomplete="email" required>
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div class="input-field">
              <input type="password" v-model="password" class="password" placeholder="Jelszó" autocomplete="password" required>
              <i class="uil uil-key-skeleton icon"></i>
              <i class="fa-solid fa-lock"></i>
            </div>
              <div class="input-field">
              <input type="password" v-model="confirmPassword" class="password" placeholder="Jelszó még egyszer" autocomplete="password" required>
              <i class="uil uil-key-skeleton icon"></i>
              <i class="fa-solid fa-lock"></i>
            </div>
            <div class="checkbox-text">
              <div class="checkbox-content">
                <input type="checkbox" id="regCheck" required>
                <label for="regCheck" class="text">Elfogadom a <a href="#" @click="modalOpen = true" class="text signup-link">felhasználási feltételeket</a></label>
              </div>
            </div>
            <div class="input-field button">
              <input type="submit" value="Regisztráció">  
            </div>
            </form>
          <div class="login-signup">
            <span class="text">Már tag vagy?
              <a href="#" class="text login-link" @click="toggleForm(1)">Jelentkezz be!</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Modal :isVisible="modalOpen" @closeModal="modalOpen = false" :title="title" :description="description"/>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { userStore, notificationStore } from '@/store';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const modalOpen = ref(false);
const title = ref('Felhasználási feltételek');
const description = ref(`<p>A regisztrációval elfogadod az alábbi feltételeket:</p><ul style="margin: 10px 0 10px 30px;"><li>Adatvédelmi irányelveinket
<a href="#">itt</a> találod.</li><li>A felhasználói fiókodat bizalmasan kezeled, és felelős vagy a fiókodban végzett összes tevékenységért.</li><li>A
regisztrációval hozzájárulsz ahhoz, hogy email értesítéseket kapj a fontos frissítésekről és információkról.</li></ul><h2 style="margin-bottom: 10px">Fiók
Biztonsága</h2><p>Kérjük, tartsd be a következő irányelveket a fiókod biztonsága érdekében:</p><ol><li>Használj erős jelszót, amely tartalmaz kis- és 
nagybetűket, számokat és speciális karaktereket.</li><li>Ne oszd meg jelszavad másokkal.</li><li>Használj kétlépcsős azonosítást, ha elérhető.</li></ol>`);
const checkbox = ref(false);

function toggleForm(option: number) {
  const container = document.querySelector('.container')!;

  if(option == 0) {
    container.classList.add('active');
  } else if(option == 1) {
    container.classList.remove('active');
  }
}

function redirectTo() {
  const url = new URL(window.location.href);
  if(url.searchParams.get('redirectTo')) {
    return navigateTo(url.searchParams.get('redirectTo'), { external: true });
  } else {
    return navigateTo('/access');
  }
}

function login() {
  const user = {
    username: username.value,
    password: password.value
  }

  userStore.login(user, checkbox.value).then(res => {
    if(res.data.success) {
      notificationStore.addNotification({
        id: 0,
        type: 'success',
        message: 'Sikeres bejelentkezés.'
      });
      
      redirectTo();
    }
  }).catch(() => {
    notificationStore.addNotification({
      id: 0,
      type: 'error',
      message: userStore.$state.error
    });
  });
}

function register() {
  const user = {
    username: username.value,
    email: email.value,
    password: password.value
  }

  userStore.register(user).then(res => {
    if(res.data.success) {
      notificationStore.addNotification({
        id: 0,
        type: 'success',
        message: 'Sikeres regisztráció. Kérlek jelentkezz be.'
      });

      redirectTo();
    }
  }).catch(() => {
    notificationStore.addNotification({
    id: 0,
    type: 'error',
    message: userStore.$state.error
    });
  });
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/auth.scss';
</style>