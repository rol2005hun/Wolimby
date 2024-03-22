<template>
    <div class="game-container">
        <div class="grid">
            <div class="grid-row" v-for="(row, rowIndex) in grid" :key="`row-${rowIndex}`">
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
    <Modal :isVisible="modalOpen" @closeModal="modalOpen = false" :title="title" :description="description"/>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';

const title = ref('');
const description = ref('');
const modalOpen = ref(false);
const grid = ref();
const gridSize = 4;
var xDown: number = 0;
var yDown: number = 0;

function startGame() {
  grid.value = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
  addRandomTile();
  addRandomTile();
}

function addRandomTile() {
  let added = false;
  while (!added) {
    let randRow = Math.floor(Math.random() * gridSize);
    let randCol = Math.floor(Math.random() * gridSize);
    if (grid.value[randRow][randCol] === 0) {
      grid.value[randRow][randCol] = Math.random() > 0.9 ? 4 : 2;
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
  for (let i = gridSize - 1; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a === b) {
      row[i] = a + b;
      row[i - 1] = 0;
    }
  }
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
      grid.value = transpose(grid.value);
      rotated = true;
      break;
    case 'up':
      grid.value = transpose(grid.value).map((row: number[]) => row.reverse());
      rotated = true;
      flipped = true;
      break;
    case 'right':
      break;
    case 'left':
      grid.value = grid.value.map((row: number[]) => row.reverse());
      flipped = true;
      break;
    default:
      played = false;
  }

  if (played) {
    let past = copyGrid(grid.value);
    for (let i = 0; i < gridSize; i++) {
      grid.value[i] = operate(grid.value[i]);
    }

    let changed = compare(past, grid.value);
    if (flipped) {
      grid.value = grid.value.map((row: number[]) => row.reverse());
    }
    if (rotated) {
      grid.value = transpose(grid.value);
    }
    if (changed) {
      addRandomTile();
    }
  }
}

if(process.client) {
  window.addEventListener('touchstart', handleTouchStart, false);  
  window.addEventListener('touchmove', handleTouchMove, false);
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        move('up');
        break;
      case 'ArrowDown':
        move('down');
        break;
      case 'ArrowLeft':
        move('left');
        break;
      case 'ArrowRight':
        move('right');
        break;
    }
  });
}

function transpose(matrix: number[][]) {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function compare(a: number[][], b: number[][]) {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (a[i][j] !== b[i][j]) {
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
  startGame();
});
</script>
  
<style lang="scss">
@import '@/assets/scss/2048.scss';
</style>
  