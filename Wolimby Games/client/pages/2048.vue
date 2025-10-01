<template>
  <div class="game-container">
    <div class="score-container">
      <p class="game-title">2048</p>
      <div class="scores">
        <div class="score">
          <p class="score-label">Jelenlegi</p>
          <p class="score-value">{{ gameState.currentPoint }}</p>
        </div>
        <div class="score">
          <p class="score-label">Rekord</p>
          <p class="score-value">{{ gameState.bestPoint }}</p>
        </div>
      </div>
    </div>
    <div class="grid">
      <div class="grid-row" v-for="(row, rowIndex) in gameState.grid" :key="`row-${rowIndex}`">
        <div class="grid-cell" v-for="(cell, cellIndex) in row" :key="`cell-${cellIndex}-${cell}`">
          <div class="tile" v-if="cell !== 0" :style="'background-color: ' + backgroundColor(cell)">{{ cell }}</div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button class="restart-btn" @click="startGame">
        <i class="fas fa-redo"></i>
      </button>
      <button class="rules-btn" @click="openRules">
        <i class="fa-solid fa-book"></i>
      </button>
    </div>
  </div>
  <Modal :isVisible="modalOpen" @closeModal="modalOpen = false" :title="title" :description="description" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const title = ref('');
const description = ref('');
const modalOpen = ref(false);
const gameState = ref({ currentPoint: 0, bestPoint: 0 } as any);
const currentPoint = ref(0);
const bestPoint = ref(0);
const gridSize = 4;
var xDown: number = 0;
var yDown: number = 0;

function startGame() {
  gameState.value.grid = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
  gameState.value.currentPoint = 0;
  localStorage.setItem('2048', JSON.stringify(gameState.value));
  addRandomTile();
  addRandomTile();
}

function addRandomTile() {
  let added = false;
  while (!added) {
    let randRow = Math.floor(Math.random() * gridSize);
    let randCol = Math.floor(Math.random() * gridSize);
    if (gameState.value.grid[randRow][randCol] === 0) {
      gameState.value.grid[randRow][randCol] = Math.random() > 0.9 ? 4 : 2;
      localStorage.setItem('2048', JSON.stringify(gameState.value));
      added = true;
    }
  }
}

function slide(row: number[]) {
  let arr = row.filter(val => val);
  let missing = gridSize - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr);
  return arr;
}

function combine(row: number[]) {
  let points = 0;

  for (let i = gridSize - 1; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a !== undefined && b !== undefined && a === b) {
      row[i] = a + b;
      row[i - 1] = 0;
      if (typeof row[i] !== 'undefined') {
        points += row[i]!;
      }
    }
  }

  setPoints(points);
  return row;
}

function operate(row: number[]) {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

function getTouches(e: any) {
  return e.touches || e.originalEvent.touches;
}

function handleTouchStart(e: any) {
  const firstTouch = getTouches(e)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(e: any) {
  if (detectWin()) {
    title.value = 'Nyertél';
    description.value = `Gratulálok, elérted a 2048-as csempét! Kezdj el egy új játékot!`;
    modalOpen.value = true;
    return;
  }

  if (detectGameOver()) {
    title.value = 'Vesztettél';
    description.value = `Sajnálom, de nem tudsz tovább lépni. Próbáld újra!`;
    modalOpen.value = true;
    return;
  }

  if (!xDown || !yDown) {
    return;
  }

  var xUp = e.touches[0].clientX;
  var yUp = e.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      move('left');
    } else {
      move('right');
    }
  } else {
    if (yDiff > 0) {
      e.preventDefault();
      move('up');
    } else {
      move('down');
    }
  }

  xDown = 0;
  yDown = 0;
}

function move(direction: string) {
  let flipped = false;
  let rotated = false;
  let played = true;
  switch (direction) {
    case 'down':
      gameState.value.grid = transpose(gameState.value.grid);
      rotated = true;
      break;
    case 'up':
      gameState.value.grid = (transpose(gameState.value.grid) as number[][]).map((row: number[]) => row.reverse());
      rotated = true;
      flipped = true;
      break;
    case 'right':
      break;
    case 'left':
      gameState.value.grid = gameState.value.grid.map((row: number[]) => row.reverse());
      flipped = true;
      break;
    default:
      played = false;
  }

  if (played) {
    let past = copyGrid(gameState.value.grid);
    for (let i = 0; i < gridSize; i++) {
      gameState.value.grid[i] = operate(gameState.value.grid[i]);
    }

    let changed = compare(past, gameState.value.grid);
    if (flipped) {
      gameState.value.grid = gameState.value.grid.map((row: number[]) => row.reverse());
    }
    if (rotated) {
      gameState.value.grid = transpose(gameState.value.grid);
    }
    if (changed) {
      addRandomTile();
    }
  }
}

if (process.client) {
  window.addEventListener('touchstart', handleTouchStart, false);
  window.addEventListener('touchmove', handleTouchMove, false);
  window.addEventListener('keydown', (e) => {
    if (detectWin()) {
      title.value = 'Nyertél';
      description.value = `Gratulálok, elérted a 2048-as csempét! Kezdj el egy új játékot!`;
      modalOpen.value = true;
      return;
    }

    if (detectGameOver()) {
      title.value = 'Vesztettél';
      description.value = `Sajnálom, de nem tudsz tovább lépni. Próbáld újra!`;
      modalOpen.value = true;
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        move('up');
        break;
      case 's':
      case 'arrowdown':
        move('down');
        break;
      case 'a':
      case 'arrowleft':
        move('left');
        break;
      case 'd':
      case 'arrowright':
        move('right');
        break;
    }

    if (detectWin()) {
      title.value = 'Nyertél';
      description.value = `Gratulálok, elérted a 2048-as csempét! Kezdj el egy új játékot!`;
      modalOpen.value = true;
      return;
    }

    if (detectGameOver()) {
      title.value = 'Vesztettél';
      description.value = `Sajnálom, de nem tudsz tovább lépni. Próbáld újra!`;
      modalOpen.value = true;
      return;
    }
  });
}

function transpose(matrix: number[][]) {
  if (!matrix.length || !matrix[0]) return [];
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function setPoints(points: number) {
  gameState.value.currentPoint += points;
  if (gameState.value.currentPoint > gameState.value.bestPoint) {
    gameState.value.bestPoint = gameState.value.currentPoint;
  }
}

function detectWin() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (gameState.value.grid[i][j] === 2048) {
        return true;
      }
    }
  }
  return false;
}

function detectGameOver() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (gameState.value.grid[i][j] === 0) {
        return false;
      }
      if (j !== gridSize - 1 && gameState.value.grid[i][j] === gameState.value.grid[i][j + 1]) {
        return false;
      }
      if (i !== gridSize - 1 && gameState.value.grid[i][j] === gameState.value.grid[i + 1][j]) {
        return false;
      }
    }
  }
  return true;
}

function compare(a: number[][], b: number[][]) {
  for (let i = 0; i < gridSize; i++) {
    if (!a[i] || !b[i]) continue;
    for (let j = 0; j < gridSize; j++) {
      if (
        typeof a[i] !== 'undefined' &&
        typeof b[i] !== 'undefined' &&
        typeof a[i]?.[j] !== 'undefined' &&
        typeof b[i]?.[j] !== 'undefined' &&
        a[i]?.[j] !== b[i]?.[j]
      ) {
        return true;
      }
    }
  }
  return false;
}

function copyGrid(grid: number[][]) {
  return grid.map((row: number[]) => [...row]);
}

function openRules() {
  title.value = 'Szabályzat';
  description.value = `Húzással, asztali számítógépen akár a nyilacskákkal is tudsz mozogni. A cél, hogy elérj egy 2048-as csempét. Ha nincs több lépés, vége a játéknak.`;
  modalOpen.value = true;
}

function backgroundColor(cell: number) {
  switch (cell) {
    case 0:
      return '#cdc1b4';
    case 2:
      return '#eee4da';
    case 4:
      return '#ede0c8';
    case 8:
      return '#f2b179';
    case 16:
      return '#f59563';
    case 32:
      return '#f67c5f';
    case 64:
      return '#f65e3b';
    case 128:
      return '#edcf72';
    case 256:
      return '#edcc61';
    case 512:
      return '#edc850';
    case 1024:
      return '#edc53f';
    case 2048:
      return '#edc22e';
    default:
      return '#3c3a32';
  }
}

onMounted(() => {
  localStorage.getItem('2048') ? gameState.value = JSON.parse(localStorage.getItem('2048') as string) : startGame();
});
</script>

<style lang="scss">
@use '@/assets/scss/2048.scss' as game2048;
</style>