<template>
    <main class="mastermind">
        <div class="container">
            <h1>Színözön</h1>
            <div class="board">
                <div class="row" v-for="(row, index) in board" :key="index">
                    <div class="circle" v-for="(color, colIndex) in row" :key="colIndex" :style="{ backgroundColor: color }" @click="removeColor(index, colIndex)"></div>
                    <div class="mini-circle" v-for="(color, colIndex) in feedbackCircles[index]" :key="colIndex" :style="{ backgroundColor: color }"></div>
                </div>
            </div>
            <div class="colors">
                <div class="circle" v-for="(color, index) in colors" :key="index" :style="{ backgroundColor: color }" @click="placeColor(color)"></div>
            </div>
            <div class="buttons">
                <button @click="checkGuess"><i class="fa-solid fa-check"></i></button>
                <button @click="restart"><i class="fas fa-redo"></i></button>
                <button @click="showSolution"><i class="fa-solid fa-question"></i></button>
                <button @click="openRules"><i class="fa-solid fa-book"></i></button>
            </div>
        </div>
    </main>
    <Modal :isVisible="modalOpen" @closeModal="modalOpen = false" :title="title" :description="description"/>
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue';
import soundNames from '@/assets/ts/sounds.json';

const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
const board = ref(new Array(10).fill([]).map(() => new Array(4).fill('')));
const feedbackCircles = ref(new Array(10).fill([]).map(() => new Array(4).fill('')));
const secretCode = ref(generateCode());
const modalOpen = ref(false);
const title = ref('');
const description = ref('');
const defaultSound = ref('walker');
const sounds = soundNames.find(soundName => soundName.name === defaultSound.value)!.sounds;
  
const state = reactive({
    currentRow: 0,
    gameWon: false,
    abdicating: false
});
  
function generateCode() {
    const code = [];
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * colors.length);
        code.push(colors[randomIndex]);
    }
    return code;
}

function generateFeedback(exactMatchesCount: number, colorMatchesCount: number) {
    const feedback = [];
    for (let i = 0; i < 4; i++) {
        if (exactMatchesCount > 0) {
            feedback.push('black');
            exactMatchesCount--;
        } else if (colorMatchesCount > 0) {
            feedback.push('white');
            colorMatchesCount--;
        } else {
            feedback.push('transparent');
        }
    }
    return feedback;
}
  
function checkGuess() {
    if(state.currentRow > 9) return;
    const guess = board.value[state.currentRow];
    if (guess.every(color => color !== '')) {
        const exactMatches = guess.filter((color, index) => color === secretCode.value[index]);
        const colorMatches = guess.filter(color => secretCode.value.includes(color) && !exactMatches.includes(color));
        feedbackCircles.value[state.currentRow] = generateFeedback(exactMatches.length, colorMatches.length);

        if (exactMatches.length === 4 && state.abdicating !== true) {
            new Audio(sounds.find(sound => sound.name === 'won')!.sound).play();
            state.gameWon = true;
            title.value = 'Nyertél';
            description.value = `<p style="text-align: center;">Na az igen... Gratulálunk, játssz még egy kört.</p>`;
            modalOpen.value = true;
        } else {
            state.currentRow++;

            if (state.currentRow === 10) {
                new Audio(sounds.find(sound => sound.name === 'loose')!.sound).play();
                title.value = 'Vesztettél';
                description.value = `<p style="text-align: center;">Sajnos nem talált, de próbáld meg újra.</p>`;
                modalOpen.value = true;
                state.gameWon = false;
            } else {
                new Audio(sounds.find(sound => sound.name === 'ok')!.sound).play();
            }
        }
    }
}
  
function placeColor(color: string) {
    if (!state.gameWon && state.currentRow < 10) {
        const currentRow = board.value[state.currentRow];
        const emptyIndex = currentRow.findIndex(cell => cell === '');

        if (emptyIndex !== -1) {
            currentRow[emptyIndex] = color;
            new Audio(sounds.find(sound => sound.name === color)!.sound).play();
        }
    }
}
  
function restart() {
    new Audio(sounds.find(sound => sound.name === 'newgame')!.sound).play();
    board.value = new Array(10).fill([]).map(() => new Array(4).fill(''));
    feedbackCircles.value = new Array(10).fill([]).map(() => new Array(4).fill(''));
    secretCode.value = generateCode();
    state.currentRow = 0;
    state.gameWon = false;
}

function showSolution() {
    new Audio(sounds.find(sound => sound.name === 'free')!.sound).play();
    board.value[state.currentRow] = secretCode.value;
    title.value = 'Szabad a gazda';
    description.value = `<p style="text-align: center;">Ejnye-bejnye... Hamar feladtad... de sebaj, a legjobbakkal is megtörténik, íme a megoldás:
    <div style='display: flex; justify-content: center; margin-top: 15px;'>
    ${secretCode.value.map(color => `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%;"></div>`).join('')}
    </div></p>`;
    modalOpen.value = true;
    state.abdicating = true;
}

function removeColor(rowIndex: number, colIndex: number) {
    if (!state.gameWon && state.currentRow === rowIndex) {
        const currentRow = board.value[rowIndex];
        if (colIndex >= 0 && colIndex < currentRow.length) {
            new Audio(sounds.find(sound => sound.name === 'no')!.sound).play();
            currentRow[colIndex] = '';
        }
    }
}

function openRules() {
    new Audio(sounds.find(sound => sound.name === 'rules')!.sound).play();
    title.value = 'Szabályzat';
    description.value = `
    A játék lényege, hogy a gép által elrejtett 4 golyó színét és ezek sorrendjét kitaláljuk. Minden egyes tippünk után a gép fekete és/vagy fehér "tüskékkel" válaszol. A fehér tüske jelentése: egy golyó színét eltaláltuk (de a helyét nem), a fekete tüske jelentése: egy golyó színét és helyét is eltaláltuk. Azt, hogy melyik golyóra vonatkoznak az egyes tüskék azt nem árulja el a gép, ezt nekünk kell kitalálnunk az egyes tippekre adott válaszokból.
    <ul><li><b>Színek:</b> <span style="color: red;">piros</span>, <span style="color: blue;">kék</span>, <span style="color: green;">zöld</span>, <span style="color: yellow;">sárga</span>, <span style="color: orange;">narancs</span>, <span style="color: purple;">lila</span>.</li>
    <li><b>Tipp értékelése:</b> Ha egy sorban mind a négy színt beütöttük, akkor a <b>Pipa</b> gombbal lehet a tippet értékeltetni a géppel.</li>
    <li><b>Érvénytelenítés:</b> Egy beütött tippet a <b>golyóra</b> rákattintva lehet érvényteleníteni.</li>
    <li><b>Segítség:</b> A <b>Könyv</b> ikonra kattinva egy új ablakban megjelenik a játék leírása, valamint a használati útmutató. A felső <b>X</b> gombra kattintva ez bezáródik.</li>
    <li><b>Megoldás megjelenítése:</b> A <b>Kérdőjel</b> gombra kattintva a helyes megfejtés megjelenik a kérdőjelek helyén.</li>
    <li><b>Új játék kezdése:</b> Az <b>Újra</b> gombbal bármikor elölről kezdhetjük a játékot.</li></ul>
    `;
    modalOpen.value = true;
}
</script>
  
<style lang="scss" scoped>
@import '@/assets/scss/mastermind.scss';
</style>
  