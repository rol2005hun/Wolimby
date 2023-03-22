<template>
  <main class="index">
    <div class="container">
      <div class="forms">
        <div class="form login">
          <p class="title">Wolimby - Bejelentkezés</p>
          <form action="#">
            <div class="input-field">
              <input type="text" placeholder="Felhasználónév / Email cím" required>
              <i class="fa-solid fa-user"></i>
            </div>
              <div class="input-field">
              <input type="password" class="password"  placeholder="Jelszó" required>
              <i class="uil uil-key-skeleton icon"></i>
              <i class="fa-solid fa-lock"></i>
            </div>
            <div class="checkbox-text">
              <div class="checkbox-content">
                <input type="checkbox" id="logCheck">
                <label for="logCheck" class="text">Jegyezz meg</label>
              </div>
              <a href="#" class="text">Elfelejtetted a jelszavad?</a>
            </div>
            <div class="input-field button">
              <input type="button" value="Bejelentkezés">  
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
          <form action="#">
            <div class="input-field">
              <input type="text" placeholder="Felhasználónév" required>
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="input-field">
              <input type="text" placeholder="Email cím" required>
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div class="input-field">
              <input type="password" class="password"  placeholder="Jelszó" required>
              <i class="uil uil-key-skeleton icon"></i>
              <i class="fa-solid fa-lock"></i>
            </div>
              <div class="input-field">
              <input type="password" class="password"  placeholder="Jelszó még egyszer" required>
              <i class="uil uil-key-skeleton icon"></i>
              <i class="fa-solid fa-lock"></i>
            </div>
            <div class="checkbox-text">
              <div class="checkbox-content">
                <input type="checkbox" id="regCheck">
                <label for="regCheck" class="text">Elfogadom a <a href="#" class="text signup-link">felhasználási feltételeket</a></label>
              </div>
            </div>
            <div class="input-field button">
              <input type="button" value="Regisztráció">  
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
</template>

<script setup lang="ts">
import '@/assets/scss/index.scss';

function toggleForm(option: number) {
  const container = document.querySelector('.container')!;

  if(option == 0) {
    container.classList.add('active');
  } else if(option == 1) {
    container.classList.remove('active');
  }
}
</script>