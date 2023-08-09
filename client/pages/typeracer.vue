<template>
  <main class="typeracer">
    <div class="container">
      <div class="container-code">
        <client-only>
          <span v-for="(char, index) in formattedSnippet"
          :key="index" :class="{ correct: char === typedText[index], incorrect: char !== typedText[index], br: char === ' ', neutral: typedText.length <= index }">
          <span class="cursor" v-if="index === cursorPosition">|</span>{{ char === ' ' ? '\u00A0' : char }}</span>
        </client-only>
      </div>
      <div class="container-stats">
        <button class="pause-btn" @click="toggleTimer">
          <i :class="timerRunning ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <div class="stat">
          <span class="label">CPM:</span>
          <span class="value">{{ (cpm !== Infinity ? cpm : 0) || 0 }}</span>
        </div>
        <div class="stat">
          <span class="label">Idő:</span>
          <span class="value">{{ formatTime(time) }}</span>
        </div>
        <button class="restart-btn" @click="restart">
          <i class="fas fa-redo"></i>
        </button>
        <button class="rules-btn" @click="openRules">
          <i class="fa-solid fa-book"></i>
        </button>
      </div>
    </div>
    <Modal :isVisible="modalOpen" @closeModal="modalOpen = false" :title="title" :description="description"/>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue';
import codesnippets from '@/assets/ts/codesnippets.json';

const typedText = ref('');
const time = ref(0);
const timer = ref();
const currentSnippet = ref('');
const counter = ref(0);
const initialCharacterCount = ref(0);
const correctCharacterCount = ref(0);
const title = ref('');
const description = ref('');
const modalOpen = ref(false);
const timerRunning = ref(false);
const formattedSnippet = computed(() => currentSnippet.value.split(''));
const cursorPosition = computed(() => (typedText.value.length === formattedSnippet.value.length ? typedText.value.length : typedText.value.length));

const cpm = computed(() => {
  const minutes = time.value / 60;
  return Math.round(correctCharacterCount.value / minutes);
});

function startTimer() {
  timer.value = setInterval(() => {
    time.value++;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer.value);
  timer.value = null;
}


function toggleTimer() {
  if (timerRunning.value) {
    stopTimer();
  } else {
    startTimer();
  }
  timerRunning.value = !timerRunning.value;
}

function restart() {
  generateNewSnippet();
  time.value = 0;
  counter.value = 0;
  correctCharacterCount.value = 0;
  initialCharacterCount.value = 0;
  typedText.value = '';
  stopTimer();
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function generateNewSnippet() {
  let newSnippet = currentSnippet.value;
  while (newSnippet == currentSnippet.value) {
    newSnippet = codesnippets[Math.floor(Math.random() * codesnippets.length)].code;
  }

  currentSnippet.value = newSnippet.replace(/\n/g, '');
  typedText.value = '';
}

function openRules() {
  title.value = 'Szabályzat';
  description.value = `Fejlesztő vagy? Nézzük meg, milyen gyorsan tudsz rövid kódrészleteket írni! A játék akkor kezdődik, amikor megnyomod az első billentyűt!
  Ha le szeretnéd állítani a játékot, kattints a szünet gombra! Ahol szóközt látsz, ott nyomj szóköz gombot, semmi mást ne használj!
  <ul><li><b>Pár tipp:</b> <li style="margin-left: 10px;">5 kódrészlet után a játéknak vége.</li><li style="margin-left: 10px;">Ha rosszul nyomod a szóközt, egy piros téglalap jelzi.</li></li>
  <ul><li><b>Kezdés:</b> A játék akkor kezdődik amikor a játékos lenyomja az első billentyűt.</li>
  <li><b>Szünet:</b> Ha netán elfáradtál volna fél perc után, és megszeretnél állni, akkor a <b>Stop</b> gombra kattintva meg tudod állítani a játékot. (nem fejeződik be)</li>
  <li><b>Érvénytelenítés:</b> Egy beütött tippet a <b>golyóra</b> rákattintva lehet érvényteleníteni.</li>
  <li><b>Segítség:</b> A <b>Könyv</b> ikonra kattinva egy új ablakban megjelenik a játék leírása, valamint a használati útmutató. A felső <b>X</b> gombra kattintva ez bezáródik.</li>
  <li><b>Új játék kezdése:</b> Az <b>Újra</b> gombbal bármikor elölről kezdhetjük a játékot.</li></ul>`;
  modalOpen.value = true;
}

watch(typedText, (newTypedText: string) => {
  if (counter.value == 5) {
    title.value = 'Lássuk csak...';
    description.value = `<p style="text-align: center;">Gratulálok az eredménytől függetlenül, ez kemény menet lehetett. Te ${cpm.value} karaktert ütsz le percenként. Igazi vadállat 🦁</p>`;
    modalOpen.value = true;
    restart();
  }
  
  if(typedText.value == currentSnippet.value) {
    initialCharacterCount.value = correctCharacterCount.value;
    generateNewSnippet();
    counter.value++;
  }

  if(typedText.value.length > currentSnippet.value.length) typedText.value = typedText.value.slice(0, -1);
  correctCharacterCount.value = initialCharacterCount.value + typedText.value.split('').filter((char, index) => char === currentSnippet.value[index]).length;
});

onMounted(() => {
  generateNewSnippet();
});

if(process.client) {
  window.addEventListener('keydown', (event) => {
    if(!timer.value) {
      startTimer();
      timerRunning.value = true;
    }

    if(event.key === ' ') {
      typedText.value += ' ';
      return;
    }

    if(event.key === 'Backspace') {
      typedText.value = typedText.value.slice(0, -1);
      return;
    }

    if(event.key.length === 1) {
      typedText.value += event.key;
    }
  });
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/typeracer.scss';
</style>
