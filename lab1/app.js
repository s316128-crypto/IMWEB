// Chinese pop songs database fetched from iTunes Search API
const songsDatabase = [
  {
    "title": "晴天",
    "artist": "周杰倫",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/c2/0f/17/c20f1776-d243-3a88-92f0-75dc2875afad/mzaf_12161707105778039594.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8c/47/86/8c47862d-e254-8b49-30cf-d1f05ebba05b/23UM1IM56855.rgb.jpg/100x100bb.jpg"
  },
  {
    "title": "告白氣球",
    "artist": "周杰倫",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/99/7c/60/997c608e-b440-ce89-9fa0-d13645b89f0f/mzaf_15715303819469213651.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/6e/b6/b9/6eb6b905-cd05-401a-42aa-8f52af4adc45/23UM1IM58108.rgb.jpg/100x100bb.jpg"
  },
  {
    "title": "愛人錯過",
    "artist": "告五人",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/35/aa/ae/35aaae55-b317-740d-0145-597ec205a806/mzaf_6471693933579497032.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/10/ba/77/10ba77f4-47ae-8cb6-2913-cf49b78452b5/1..jpg/100x100bb.jpg"
  },
  {
    "title": "披星戴月的想你",
    "artist": "告五人",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/2b/9a/81/2b9a81ed-90a5-7a1e-02df-1154ac42369a/mzaf_12420355989271695946.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6d/48/12/6d48129b-0071-2ecf-f188-5833cc23b4c7/1._1500_-.jpg/100x100bb.jpg"
  },
  {
    "title": "你好不好",
    "artist": "周興哲",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/d9/7c/65/d97c65e1-c990-7cb4-8467-624e40c3fd2b/mzaf_14618613122545680803.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music20/v4/4c/35/5f/4c355f1e-ac70-9eea-879e-f50ec28692ea/886445896756.jpg/100x100bb.jpg"
  },
  {
    "title": "以後別做朋友",
    "artist": "周興哲",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/07/a0/7e/07a07edb-01a2-12c2-0c9f-6fecae9904d1/mzaf_415164382686535593.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/60/da/63/60da63df-f2f0-6788-500d-86b5cd4def54/886444748353.jpg/100x100bb.jpg"
  },
  {
    "title": "如果可以",
    "artist": "韋禮安",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/d1/1f/16/d11f1694-672e-18ac-3d28-89e4955a0e2b/mzaf_3795940770887816434.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5b/63/0c/5b630c9d-3b66-d1fa-9c2e-c7ceeac165fb/886449697779.jpg/100x100bb.jpg"
  },
  {
    "title": "光年之外",
    "artist": "鄧紫棋",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/8c/85/72/8c857291-67d1-1250-3db5-e575313eb57a/mzaf_14040710248869910783.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/23/65/4a/23654a78-6769-a2ec-bfd7-e032ea71c65a/191018640989.jpg/100x100bb.jpg"
  },
  {
    "title": "泡沫",
    "artist": "鄧紫棋",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2e/a2/6f/2ea26f2e-b3ab-dfda-d594-b288bcc66ea4/mzaf_13800734421504250775.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/08/81/e6/0881e6e7-a51c-1a5b-bdae-c379f67dce79/887158129650.jpg/100x100bb.jpg"
  },
  {
    "title": "想見你想見你想見你",
    "artist": "八三夭",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/33/6d/6a/336d6aa9-e7f6-8b58-b4a6-9f17bedfac75/mzaf_9727761699704915210.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c9/95/65/c9956583-a1f8-f743-e890-259f78eef2c6/4710149675538.jpg/100x100bb.jpg"
  },
  {
    "title": "突然好想你",
    "artist": "五月天",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/f7/7b/c0/f77bc0ad-2cf2-755f-b8e2-40ff982844a4/mzaf_6341650422287672828.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/fd/ba/9e/fdba9e89-6336-d3e4-ee00-94184f9a5c2c/BD0016-_-.jpg/100x100bb.jpg"
  },
  {
    "title": "傷心的人別聽慢歌",
    "artist": "五月天",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/1a/0e/78/1a0e78e5-1905-5f3e-7f4b-2dbd63a0d29b/mzaf_6912852650634513942.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/0b/4d/f0/0b4df092-7531-2d96-0c3f-1f330fd9388e/the_best_of_1999-2013.jpg/100x100bb.jpg"
  },
  {
    "title": "孤勇者",
    "artist": "陳奕迅",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/f7/f6/13/f7f6132c-51e6-6858-a9e1-f4c72054a4b3/mzaf_4119948267591107416.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2f/fd/80/2ffd80da-797f-2a9f-f7c1-9c7f34c802f0/21UM1IM38495.rgb.jpg/100x100bb.jpg"
  },
  {
    "title": "十年",
    "artist": "陳奕迅",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/e7/77/04/e7770492-18d1-e5dc-0765-ddacbbe068c5/mzaf_1628518296724984899.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/56/e6/66/56e6661d-e570-782f-fbc8-e7b12e38f1a7/EEG3035V1-_-.jpg/100x100bb.jpg"
  },
  {
    "title": "烏梅子醬",
    "artist": "李榮浩",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/66/da/98/66da983f-ba68-395f-6a7f-38b84400b27a/mzaf_6626324585790888918.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/90/70/60/90706095-095d-fa3f-ecd8-b227a21b2832/5054197462337.jpg/100x100bb.jpg"
  },
  {
    "title": "浪子回頭",
    "artist": "茄子蛋",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/25/ec/1c/25ec1c47-5769-a8fb-d340-31cd99448585/mzaf_370154456961044533.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/98/fc/97/98fc9712-1d85-708c-fe22-35734176f445/5054197969614.jpg/100x100bb.jpg"
  },
  {
    "title": "玫瑰少年",
    "artist": "蔡依林",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/14/3d/43/143d4327-2bb3-fb5e-29d8-551e41e97ecd/mzaf_15701627632819295936.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/b6/60/9c/b6609c02-1c81-4a8d-05c0-a86deed086c4/886447475621.jpg/100x100bb.jpg"
  },
  {
    "title": "說愛你",
    "artist": "蔡依林",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/76/d7/b1/76d7b103-a466-31a3-d3f7-43e5c3bb5f4f/mzaf_8499867377798423984.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a2/f6/d2/a2f6d2ce-7a44-3c87-8774-556d6f30c565/dj.uxjggljv.jpg/100x100bb.jpg"
  },
  {
    "title": "修煉愛情",
    "artist": "林俊傑",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/eb/c1/b1/ebc1b18f-a93f-9b30-7be0-162d4616260d/mzaf_12848033625478567269.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/86/80/48/86804834-eb90-62a1-2170-cd96f9963cac/4711099729722.jpg/100x100bb.jpg"
  },
  {
    "title": "江南",
    "artist": "林俊傑",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0d/0a/1f/0d0a1f64-1faa-01a3-6b82-3f71c7f1ad53/mzaf_6171234305789252058.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music49/v4/9b/98/eb/9b98ebae-69b1-8009-678c-65e94124e0a8/dj.cqtiyqmo.jpg/100x100bb.jpg"
  },
  {
    "title": "雨愛",
    "artist": "楊丞琳",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e8/2a/8a/e82a8a24-8bc5-4d23-232f-419785aa9777/mzaf_3240385700705023975.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/bc/e0/e5/mzi.mzfgcpgj.jpg/100x100bb.jpg"
  },
  {
    "title": "小幸運",
    "artist": "田馥甄",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/47/b5/ae/47b5ae4a-d101-c741-0df7-188538d2aa10/mzaf_16353863173518081566.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/f2/2a/6c/f22a6c48-f12a-cba8-1034-c20235f179b5/4716220196404.jpg/100x100bb.jpg"
  },
  {
    "title": "有一種悲傷",
    "artist": "A-Lin",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/78/f6/f6/78f6f602-2f45-db40-1705-285ea96fb2a5/mzaf_7889620881856030066.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4d/5f/73/4d5f7322-e657-0eda-7107-cefec377a985/886447347416.jpg/100x100bb.jpg"
  }
];

// Audio element setup
const audio = new Audio();
audio.crossOrigin = "anonymous"; // Enable CORS for audio visualizer if CDN supports it

// Game State
let totalRounds = 5;
let currentRound = 0;
let score = 0;
let timeLimit = 20; // 20 seconds
let timeLeft = 20;
let timerInterval = null;
let currentSong = null;
let selectedSongPool = [];
let resultsList = [];
let reviewAudio = new Audio(); // Separate audio for review playlist
reviewAudio.crossOrigin = "anonymous";
let reviewPlayingItem = null; // Currently playing review element

// Web Audio API Context and Analyzer
let audioCtx = null;
let audioSource = null;
let analyser = null;
let visualizerId = null;

// Initialize Web Audio Context
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Play Synthesized Micro-Sound Effects
function playBeep(isCorrect) {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    if (isCorrect) {
      // Correct sound: A quick ascending major chord (C5 -> G5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.08); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Incorrect sound: Low descending buzz (A3 -> A2)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(110, now + 0.3); // A2
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.error("Synthesizer audio error:", e);
  }
}

// Setup Canvas Frequency Visualizer
function setupVisualizer() {
  try {
    initAudio();
    if (!audioSource) {
      audioSource = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 64; // Low fft size for chunky retro visualizer bars
    }
    startVisualizerDrawing();
  } catch (e) {
    console.warn("Visualizer connection issue:", e);
    // Standard playback fallback if analyzer connection fails
    try {
      audio.connect(audioCtx.destination);
    } catch (err) {}
  }
}

function startVisualizerDrawing() {
  const canvas = document.getElementById('canvasVisualizer');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Set resolution
  const width = canvas.width = canvas.clientWidth * window.devicePixelRatio;
  const height = canvas.height = canvas.clientHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  function draw() {
    visualizerId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    
    const barWidth = (displayWidth / bufferLength) * 1.6;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      // Normalize bar height
      barHeight = (dataArray[i] / 255) * displayHeight * 0.85;
      
      if (barHeight > 0) {
        // Futuristic gradient
        const grad = ctx.createLinearGradient(0, displayHeight, 0, displayHeight - barHeight);
        grad.addColorStop(0, '#9d4edd'); // deep purple
        grad.addColorStop(0.5, '#ff2e93'); // pink
        grad.addColorStop(1, '#00f0ff'); // cyan
        
        ctx.fillStyle = grad;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ff2e93';
        
        // Draw round-capped bars
        ctx.beginPath();
        ctx.roundRect(x, displayHeight - barHeight, barWidth - 4, barHeight, [4, 4, 0, 0]);
        ctx.fill();
      }
      x += barWidth;
    }
    ctx.shadowBlur = 0; // Reset shadow
  }
  
  if (visualizerId) cancelAnimationFrame(visualizerId);
  draw();
}

// UI Navigation / View Switcher
function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(viewId);
  if (targetView) targetView.classList.add('active');
  
  // Clean review audio if switching away from results
  if (viewId !== 'viewResults') {
    reviewAudio.pause();
    reviewAudio.src = '';
    reviewPlayingItem = null;
  }
}

// Difficulty/Round select listener
document.querySelectorAll('.btn-select').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const parent = e.target.parentElement;
    parent.querySelectorAll('.btn-select').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    if (parent.dataset.config === 'rounds') {
      totalRounds = parseInt(e.target.dataset.value);
    }
  });
});

// Start Game Handler
document.getElementById('btnStart').addEventListener('click', () => {
  initAudio();
  setupVisualizer();
  startGame();
});

function startGame() {
  score = 0;
  currentRound = 0;
  resultsList = [];
  
  // Clone and shuffle song database
  selectedSongPool = [...songsDatabase].sort(() => 0.5 - Math.random());
  // Truncate to total rounds requested
  if (selectedSongPool.length > totalRounds) {
    selectedSongPool = selectedSongPool.slice(0, totalRounds);
  } else {
    totalRounds = selectedSongPool.length;
  }
  
  showView('viewPlay');
  nextRound();
}

function nextRound() {
  currentRound++;
  if (currentRound > totalRounds) {
    endGame();
    return;
  }
  
  // Update Info panel
  document.getElementById('lblRound').textContent = `${currentRound}/${totalRounds}`;
  document.getElementById('lblScore').textContent = score;
  
  // Get target song
  currentSong = selectedSongPool[currentRound - 1];
  
  // Reset Vinyl Disc look
  const disc = document.getElementById('vinylDisc');
  disc.classList.remove('playing');
  const albumArt = document.getElementById('albumArt');
  albumArt.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ff2e93" stroke-width="1.5"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3"></circle><path d="M12 9v6"></path></svg>';
  albumArt.style.filter = 'blur(10px)'; // Blur cover art initially
  
  // Generate multiple choice options (1 correct, 3 incorrect distractors)
  const choices = generateChoices(currentSong);
  
  // Render options
  const choicesGrid = document.getElementById('choicesGrid');
  choicesGrid.innerHTML = '';
  choices.forEach(title => {
    const btn = document.createElement('button');
    btn.className = 'btn-choice';
    btn.textContent = title;
    btn.addEventListener('click', () => makeChoice(btn, title));
    choicesGrid.appendChild(btn);
  });
  
  // Reset feedback and Next button
  document.getElementById('feedbackText').className = 'answer-feedback';
  document.getElementById('feedbackText').textContent = '';
  document.getElementById('btnNext').style.display = 'none';
  
  // Load and play song preview
  audio.src = currentSong.previewUrl;
  audio.load();
  
  // Play audio (handling autoplay block gracefully)
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      disc.classList.add('playing');
      updatePlayBtnIcon(true);
    }).catch(err => {
      console.log("Autoplay blocked, waiting for user click.", err);
      updatePlayBtnIcon(false);
    });
  }
  
  // Reset and start countdown timer
  timeLeft = timeLimit;
  updateTimerUI();
  
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      clearInterval(timerInterval);
      timeoutRound();
    }
    updateTimerUI();
  }, 100);
}

function updatePlayBtnIcon(isPlaying) {
  const playIcon = document.getElementById('playIcon');
  if (isPlaying) {
    // Pause SVG Icon
    playIcon.innerHTML = '<rect x="4" y="4" width="4" height="16"></rect><rect x="16" y="4" width="4" height="16"></rect>';
  } else {
    // Play SVG Icon
    playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
  }
}

// Toggle Play/Pause button in vinyl center
document.getElementById('playBtnOverlay').addEventListener('click', () => {
  initAudio();
  const disc = document.getElementById('vinylDisc');
  if (audio.paused) {
    audio.play().then(() => {
      disc.classList.add('playing');
      updatePlayBtnIcon(true);
    });
  } else {
    audio.pause();
    disc.classList.remove('playing');
    updatePlayBtnIcon(false);
  }
});

function updateTimerUI() {
  const percentage = (timeLeft / timeLimit) * 100;
  const bar = document.getElementById('timerBar');
  bar.style.width = `${percentage}%`;
  
  // Dynamic color transition as timer runs low
  if (percentage > 50) {
    bar.style.background = 'linear-gradient(to right, var(--neon-blue), var(--neon-purple))';
  } else if (percentage > 25) {
    bar.style.background = 'linear-gradient(to right, var(--neon-purple), var(--neon-pink))';
  } else {
    bar.style.background = 'linear-gradient(to right, var(--neon-pink), var(--neon-red))';
  }
  document.getElementById('lblTime').textContent = `${Math.ceil(timeLeft)}s`;
}

function generateChoices(correctSong) {
  const pool = [correctSong.title];
  
  // Get incorrect choices. Prioritize matching artists if possible, otherwise pull random popular songs
  const sameArtistSongs = songsDatabase.filter(s => s.artist === correctSong.artist && s.title !== correctSong.title);
  const otherSongs = songsDatabase.filter(s => s.title !== correctSong.title);
  
  // Shuffle arrays
  const shuffledSameArtist = sameArtistSongs.sort(() => 0.5 - Math.random());
  const shuffledOther = otherSongs.sort(() => 0.5 - Math.random());
  
  // Fill distractors
  let indexSame = 0;
  let indexOther = 0;
  
  while (pool.length < 4) {
    if (indexSame < shuffledSameArtist.length) {
      const option = shuffledSameArtist[indexSame].title;
      if (!pool.includes(option)) pool.push(option);
      indexSame++;
    } else if (indexOther < shuffledOther.length) {
      const option = shuffledOther[indexOther].title;
      if (!pool.includes(option)) pool.push(option);
      indexOther++;
    } else {
      break;
    }
  }
  
  // Shuffle final list of 4 choices
  return pool.sort(() => 0.5 - Math.random());
}

function makeChoice(clickedBtn, chosenTitle) {
  clearInterval(timerInterval);
  audio.pause();
  document.getElementById('vinylDisc').classList.remove('playing');
  updatePlayBtnIcon(false);
  
  // Disable all options
  document.querySelectorAll('.btn-choice').forEach(btn => {
    btn.disabled = true;
    // Reveal correct answer immediately
    if (btn.textContent === currentSong.title) {
      btn.classList.add('correct');
    }
  });
  
  const isCorrect = (chosenTitle === currentSong.title);
  playBeep(isCorrect);
  
  // Reveal album art
  const albumArt = document.getElementById('albumArt');
  albumArt.src = currentSong.artworkUrl;
  albumArt.style.filter = 'none'; // Remove blur
  
  const feedback = document.getElementById('feedbackText');
  
  if (isCorrect) {
    // Score Formula: Base 10 + Time left * 4.5 -> Max 100 points
    const pointsAwarded = Math.max(10, Math.round(timeLeft * 4.5 + 10));
    score += pointsAwarded;
    document.getElementById('lblScore').textContent = score;
    
    // Popup score points animation
    triggerScorePopup(clickedBtn, `+${pointsAwarded}`);
    
    feedback.textContent = `答對了！這是 ${currentSong.artist} 的《${currentSong.title}》✨`;
    feedback.className = 'answer-feedback show correct-text';
    
    resultsList.push({ song: currentSong, correct: true, chosen: chosenTitle });
  } else {
    clickedBtn.classList.add('incorrect');
    feedback.textContent = `答錯囉！正確答案是 ${currentSong.artist} 的《${currentSong.title}》`;
    feedback.className = 'answer-feedback show incorrect-text';
    
    resultsList.push({ song: currentSong, correct: false, chosen: chosenTitle });
  }
  
  document.getElementById('btnNext').style.display = 'inline-flex';
}

function timeoutRound() {
  audio.pause();
  document.getElementById('vinylDisc').classList.remove('playing');
  updatePlayBtnIcon(false);
  
  playBeep(false);
  
  // Reveal correct answer and album art
  document.querySelectorAll('.btn-choice').forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === currentSong.title) {
      btn.classList.add('correct');
    }
  });
  
  const albumArt = document.getElementById('albumArt');
  albumArt.src = currentSong.artworkUrl;
  albumArt.style.filter = 'none';
  
  const feedback = document.getElementById('feedbackText');
  feedback.textContent = `時間到！正確答案是 ${currentSong.artist} 的《${currentSong.title}》⏳`;
  feedback.className = 'answer-feedback show incorrect-text';
  
  resultsList.push({ song: currentSong, correct: false, chosen: '逾時未答' });
  
  document.getElementById('btnNext').style.display = 'inline-flex';
}

function triggerScorePopup(element, text) {
  const rect = element.getBoundingClientRect();
  const pop = document.createElement('div');
  pop.className = 'score-pop';
  pop.textContent = text;
  
  // Position above the clicked button
  pop.style.left = `${rect.left + rect.width / 2 - 25}px`;
  pop.style.top = `${rect.top - 30 + window.scrollY}px`;
  
  document.body.appendChild(pop);
  
  // Clean up
  setTimeout(() => {
    pop.remove();
  }, 1000);
}

// Next Round Listener
document.getElementById('btnNext').addEventListener('click', () => {
  nextRound();
});

// End Game & Render Stats Screen
function endGame() {
  clearInterval(timerInterval);
  audio.pause();
  
  if (visualizerId) {
    cancelAnimationFrame(visualizerId);
    visualizerId = null;
  }
  
  showView('viewResults');
  
  // Render final score and rating rank
  document.getElementById('resultScoreVal').textContent = score;
  
  const maxPossibleScore = totalRounds * 100;
  const correctCount = resultsList.filter(r => r.correct).length;
  const accuracy = Math.round((correctCount / totalRounds) * 100);
  
  document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
  document.getElementById('resultCorrect').textContent = `${correctCount}/${totalRounds}`;
  
  // Set rank evaluation text
  const rankLbl = document.getElementById('resultRankVal');
  if (score >= maxPossibleScore * 0.9) {
    rankLbl.textContent = '🏆 行走的中華小曲庫 (音樂神童)';
    rankLbl.style.color = 'var(--neon-blue)';
  } else if (score >= maxPossibleScore * 0.7) {
    rankLbl.textContent = '👑 K歌之王 (實力不凡)';
    rankLbl.style.color = 'var(--neon-green)';
  } else if (score >= maxPossibleScore * 0.4) {
    rankLbl.textContent = '🎶 KTV 狂熱份子 (中規中矩)';
    rankLbl.style.color = 'var(--neon-purple)';
  } else {
    rankLbl.textContent = '🎤 浴室歌手 (音準加油！)';
    rankLbl.style.color = 'var(--neon-pink)';
  }
  
  // Render review playlist
  renderReviewPlaylist();
}

function renderReviewPlaylist() {
  const playlistContainer = document.getElementById('playlistContainer');
  playlistContainer.innerHTML = '';
  
  resultsList.forEach((result, idx) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    
    const tagClass = result.correct ? 'correct-tag' : 'incorrect-tag';
    const tagText = result.correct ? '答對' : '答錯';
    
    item.innerHTML = `
      <div class="playlist-art-container">
        <img class="playlist-art" src="${result.song.artworkUrl}" alt="${result.song.title}">
        <div class="playlist-play-overlay" onclick="toggleReviewPlay(${idx}, this)">
          <svg viewBox="0 0 24 24" id="playIcon-${idx}">
            <polygon points="6 4 20 12 6 20 6 4"></polygon>
          </svg>
        </div>
      </div>
      <div class="playlist-info">
        <div class="playlist-song">${result.song.title}</div>
        <div class="playlist-artist">${result.song.artist}</div>
      </div>
      <div class="playlist-status ${tagClass}">${tagText}</div>
    `;
    
    playlistContainer.appendChild(item);
  });
}

// Review playlist play controller
window.toggleReviewPlay = function(index, overlayElement) {
  const result = resultsList[index];
  const itemElement = overlayElement.closest('.playlist-item');
  const svgIcon = document.getElementById(`playIcon-${index}`);
  
  // If clicking currently playing song, pause it
  if (reviewPlayingItem === itemElement) {
    if (!reviewAudio.paused) {
      reviewAudio.pause();
      itemElement.classList.remove('playing');
      svgIcon.innerHTML = '<polygon points="6 4 20 12 6 20 6 4"></polygon>';
    } else {
      reviewAudio.play();
      itemElement.classList.add('playing');
      svgIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
    }
    return;
  }
  
  // If playing another song, reset previous one
  if (reviewPlayingItem) {
    reviewPlayingItem.classList.remove('playing');
    const prevIdx = resultsList.findIndex(r => r.song.previewUrl === reviewAudio.src);
    if (prevIdx !== -1) {
      const prevIcon = document.getElementById(`playIcon-${prevIdx}`);
      if (prevIcon) prevIcon.innerHTML = '<polygon points="6 4 20 12 6 20 6 4"></polygon>';
    }
  }
  
  // Play new selection
  reviewAudio.src = result.song.previewUrl;
  reviewAudio.load();
  reviewAudio.play();
  
  reviewPlayingItem = itemElement;
  itemElement.classList.add('playing');
  svgIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
  
  // Stop playing icon when song finishes
  reviewAudio.onended = () => {
    itemElement.classList.remove('playing');
    svgIcon.innerHTML = '<polygon points="6 4 20 12 6 20 6 4"></polygon>';
    reviewPlayingItem = null;
  };
};

// Play Again Listener
document.getElementById('btnRestart').addEventListener('click', () => {
  showView('viewIntro');
});
