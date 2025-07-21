window.history.scrollRestoration = 'manual';

window.addEventListener('load', () => {
  document.getElementById('section-clock').scrollIntoView({ behavior: 'smooth' });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        document.body.style.overflow = 'hidden'; // Kunci scroll ke atas
      }
    });
  });

  observer.observe(document.getElementById('section-clock'));
});

window.addEventListener('load', () => {
  document.getElementById('section-clock').scrollIntoView({ behavior: 'smooth' });
});

// ===== CLOCK =====
const hourEl = document.querySelector('.hour');
const minuteEl = document.querySelector('.minute');
const secondEl = document.querySelector('.second');
const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');
const toggle = document.querySelector('.toggle');

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

toggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  toggle.innerText = document.documentElement.classList.contains('dark') ? 'Light mode' : 'Dark mode';
});

function setTime() {
  const time = new Date();
  const month = time.getMonth();
  const day = time.getDay();
  const date = time.getDate();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hoursForClock = hours % 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(hoursForClock, 0, 12, 0, 360)}deg)`;
  minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(minutes, 0, 60, 0, 360)}deg)`;
  secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(seconds, 0, 60, 0, 360)}deg)`;

  timeEl.innerText = `${hoursForClock === 0 ? 12 : hoursForClock}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  dateEl.innerHTML = `${days[day]}, ${months[month]} <span>${date}</span>`;
}

function scale(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

setInterval(setTime, 1000);
setTime();

// ===== MUSIC EXCLUSIVE PLAY =====
const audios = document.querySelectorAll('audio');

const playButtons = document.querySelectorAll('.play-btn');
playButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const audioId = btn.getAttribute('data-audio');
    const selected = document.getElementById(audioId);

    audios.forEach(audio => {
      if (audio !== selected) audio.pause();
    });

    if (selected.paused) {
      selected.play();
    } else {
      selected.pause();
    }
  });
});

// ===== VERIFICATION CODE =====
const codes = document.querySelectorAll('.code');
const correctCode = '340071';
codes[0].focus();
codes.forEach((code, idx) => {
  code.addEventListener('input', () => {
    if (code.value.length === 1 && idx < codes.length - 1) {
      codes[idx + 1].focus();
    }
    const enteredCode = [...codes].map(c => c.value).join('');
    if (enteredCode.length === 6) {
      if (enteredCode === correctCode) {
        document.body.classList.add('lock-scroll');
        document.getElementById('section-game').scrollIntoView({ behavior: 'smooth' });
      } else {
        document.querySelector('.error-message').innerText = "❌ Kode salah!";
      }
    }
  });
});

// ===== TYPING GAME =====
const wordEl = document.getElementById('word');
const textEl = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeElGame = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');

const words = [
  'sigh', 'tense', 'airplane', 'ball', 'pies', 'juice', 'warlike',
  'bad', 'north', 'dependent', 'steer', 'silver', 'highfalutin',
  'superficial', 'quince', 'eight', 'feeble', 'admit', 'drag', 'loving'
];

let randomWord;
let score = 0;
let time = 10;

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function addWordToDOM() {
  randomWord = getRandomWord();
  wordEl.innerText = randomWord;
}

function updateScore() {
  score++;
  scoreEl.innerText = score;
}

function updateTime() {
  time--;
  timeElGame.innerText = time + 's';
  if (time === 0) {
    clearInterval(timeInterval);
    gameOver();
  }
}

function gameOver() {
  endgameEl.innerHTML = `
    <h1>Waktu Habis</h1>
    <p>Skor Akhir: ${score}</p>
    <button onclick="location.reload()">Main Lagi</button>
  `;
  endgameEl.style.display = 'flex';
}

addWordToDOM();
textEl.focus();
const timeInterval = setInterval(updateTime, 1000);

textEl.addEventListener('input', e => {
  const insertedText = e.target.value;
  if (insertedText === randomWord) {
    addWordToDOM();
    updateScore();
    e.target.value = '';
    time += 3;
    updateTime();
  }
});
