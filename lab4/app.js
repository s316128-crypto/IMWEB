/* ==========================================================================
   State & Initial Configuration
   ========================================================================== */

let tasks = [];
let notes = [];
let habits = {
    read: false,
    exercise: false,
    water: false,
    code: false
};
let settings = {
    theme: 'glass-dark',
    completedPomos: 0,
    totalFocusMinutes: 0,
    weatherCity: 'Taipei'
};

// Weather Mock Data
const weatherData = {
    Taipei: { temp: '26°C', desc: '晴朗舒適', icon: 'sun' },
    Tokyo: { temp: '19°C', desc: '多雲偶陣雨', icon: 'cloud-rain' },
    London: { temp: '14°C', desc: '微風細雨', icon: 'cloud-drizzle' },
    NewYork: { temp: '22°C', desc: '晴時多雲', icon: 'cloud-sun' },
    Paris: { temp: '17°C', desc: '陰天', icon: 'cloud' }
};

/* ==========================================================================
   Audio Synthesis (Web Audio API)
   ========================================================================== */

let audioCtx = null;
const activeAudioNodes = {};
let cafeClinkInterval = null;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Generate White Noise Buffer
function generateWhiteNoise(ctx) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
}

// Generate Brown Noise Buffer (deeper, softer hum)
function generateBrownNoise(ctx) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate for volume loss
    }
    return noiseBuffer;
}

// Sound controllers
function toggleRainSound(play) {
    initAudioContext();
    if (play) {
        if (activeAudioNodes['rain']) return;
        
        const source = audioCtx.createBufferSource();
        source.buffer = generateWhiteNoise(audioCtx);
        source.loop = true;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(550, audioCtx.currentTime);
        
        const gainNode = audioCtx.createGain();
        const volSlider = document.getElementById('volRain');
        gainNode.gain.setValueAtTime(parseFloat(volSlider.value), audioCtx.currentTime);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        source.start(0);
        activeAudioNodes['rain'] = { source, gainNode };
    } else {
        if (activeAudioNodes['rain']) {
            activeAudioNodes['rain'].source.stop();
            delete activeAudioNodes['rain'];
        }
    }
}

function toggleWavesSound(play) {
    initAudioContext();
    if (play) {
        if (activeAudioNodes['waves']) return;
        
        const source = audioCtx.createBufferSource();
        source.buffer = generateBrownNoise(audioCtx);
        source.loop = true;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, audioCtx.currentTime);
        
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // Base gain
        
        // Modulate volume with LFO to simulate rising/falling tides
        const lfo = audioCtx.createOscillator();
        lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime); // 12.5 seconds cycle
        
        const lfoGain = audioCtx.createGain();
        const volSlider = document.getElementById('volWaves');
        lfoGain.gain.setValueAtTime(parseFloat(volSlider.value) * 0.4, audioCtx.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        lfo.start(0);
        source.start(0);
        activeAudioNodes['waves'] = { source, gainNode, lfo };
    } else {
        if (activeAudioNodes['waves']) {
            activeAudioNodes['waves'].source.stop();
            if (activeAudioNodes['waves'].lfo) {
                activeAudioNodes['waves'].lfo.stop();
            }
            delete activeAudioNodes['waves'];
        }
    }
}

function toggleCafeSound(play) {
    initAudioContext();
    if (play) {
        if (activeAudioNodes['cafe']) return;
        
        // Hum of background
        const source = audioCtx.createBufferSource();
        source.buffer = generateBrownNoise(audioCtx);
        source.loop = true;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, audioCtx.currentTime);
        
        const gainNode = audioCtx.createGain();
        const volSlider = document.getElementById('volCafe');
        gainNode.gain.setValueAtTime(parseFloat(volSlider.value) * 0.7, audioCtx.currentTime);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        source.start(0);
        activeAudioNodes['cafe'] = { source, gainNode };
        
        // Add random cup clinks every 3-6s
        cafeClinkInterval = setInterval(() => {
            if (!audioCtx || audioCtx.state === 'suspended') return;
            const osc = audioCtx.createOscillator();
            const clinkGain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400 + Math.random() * 1200, audioCtx.currentTime);
            
            clinkGain.gain.setValueAtTime(0.01 + Math.random() * 0.02, audioCtx.currentTime);
            clinkGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15 + Math.random() * 0.15);
            
            osc.connect(clinkGain);
            clinkGain.connect(audioCtx.destination);
            
            osc.start(0);
            osc.stop(audioCtx.currentTime + 0.35);
        }, 3000 + Math.random() * 3000);
    } else {
        if (activeAudioNodes['cafe']) {
            activeAudioNodes['cafe'].source.stop();
            delete activeAudioNodes['cafe'];
        }
        if (cafeClinkInterval) {
            clearInterval(cafeClinkInterval);
            cafeClinkInterval = null;
        }
    }
}

// Chime Alert upon Timer completion
function playChimeAlert() {
    initAudioContext();
    if (!audioCtx) return;
    
    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.6); // slide to C6
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now); // E5
    osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.6); // slide to E6
    
    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.3);
    osc2.stop(now + 1.3);
}

/* ==========================================================================
   Clock & Weather Logic
   ========================================================================== */

function startClock() {
    const timeEl = document.getElementById('liveTime');
    const dateEl = document.getElementById('liveDate');
    
    function update() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        
        timeEl.textContent = `${hrs}:${mins}:${secs}`;
        
        const yr = now.getFullYear();
        const mth = now.getMonth() + 1;
        const dy = now.getDate();
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dayStr = days[now.getDay()];
        
        dateEl.textContent = `${yr}年${mth}月${dy}日 ${dayStr}`;
    }
    update();
    setInterval(update, 1000);
}

function updateWeather(city) {
    const data = weatherData[city] || weatherData.Taipei;
    document.getElementById('weatherTemp').textContent = data.temp;
    document.getElementById('weatherDesc').textContent = data.desc;
    
    const iconEl = document.getElementById('weatherIcon');
    iconEl.setAttribute('data-lucide', data.icon);
    lucide.createIcons();
    
    settings.weatherCity = city;
    saveSettings();
}

/* ==========================================================================
   Habits Tracker
   ========================================================================== */

function initHabitTracker() {
    const checkboxes = document.querySelectorAll('.habit-checkbox');
    checkboxes.forEach(cb => {
        const key = cb.id.replace('habit', '').toLowerCase();
        cb.checked = habits[key] || false;
        
        cb.addEventListener('change', (e) => {
            habits[key] = e.target.checked;
            updateHabitProgress();
            saveHabits();
        });
    });
    updateHabitProgress();
}

function updateHabitProgress() {
    const checkboxes = document.querySelectorAll('.habit-checkbox');
    const total = checkboxes.length;
    let checked = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) checked++;
    });
    
    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
    document.getElementById('habitPercentText').textContent = `${percent}%`;
    
    // Update SVG ring
    const ring = document.getElementById('habitRing');
    const radius = 26;
    const circumference = 2 * Math.PI * radius; // ~163.36
    const offset = circumference - (percent / 100) * circumference;
    ring.style.strokeDashoffset = offset;
}

/* ==========================================================================
   Theme Color Changer
   ========================================================================== */

function initThemes() {
    const buttons = document.querySelectorAll('.btn-theme');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.getAttribute('data-theme');
            setTheme(theme);
        });
    });
    
    // Set active button on load
    buttons.forEach(b => {
        if (b.getAttribute('data-theme') === settings.theme) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });
    setTheme(settings.theme);
}

function setTheme(theme) {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    settings.theme = theme;
    saveSettings();
}

/* ==========================================================================
   Pomodoro Timer Logic
   ========================================================================== */

let pomoTimeRemaining = 1500; // 25m in seconds
let pomoDuration = 1500;
let pomoInterval = null;
let pomoIsRunning = false;
let pomoMode = 'work'; // 'work', 'short', 'long'

const pomoConfig = {
    work: 1500,  // 25 mins
    short: 300,  // 5 mins
    long: 900    // 15 mins
};

function initPomodoro() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const mode = tab.getAttribute('data-mode');
            setTimerMode(mode);
        });
    });
    
    const startStopBtn = document.getElementById('btnTimerStartStop');
    startStopBtn.addEventListener('click', toggleTimer);
    
    const resetBtn = document.getElementById('btnTimerReset');
    resetBtn.addEventListener('click', resetTimer);
    
    document.getElementById('completedPomos').textContent = settings.completedPomos;
    document.getElementById('statFocusTime').textContent = `${settings.totalFocusMinutes}m`;
    
    updateTimerDisplay();
}

function setTimerMode(mode) {
    stopTimer();
    pomoMode = mode;
    pomoDuration = pomoConfig[mode];
    pomoTimeRemaining = pomoDuration;
    
    const statusLabel = document.getElementById('timerStatusLabel');
    if (mode === 'work') statusLabel.textContent = '保持專注';
    else if (mode === 'short') statusLabel.textContent = '小休片刻';
    else statusLabel.textContent = '深度放鬆';
    
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const mins = Math.floor(pomoTimeRemaining / 60);
    const secs = pomoTimeRemaining % 60;
    const digits = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    document.getElementById('timerTimeText').textContent = digits;
    
    // Update SVG progress ring
    const ring = document.getElementById('timerRing');
    const radius = 96;
    const circumference = 2 * Math.PI * radius; // ~603.18
    const percent = pomoTimeRemaining / pomoDuration;
    const offset = circumference - percent * circumference;
    ring.style.strokeDashoffset = offset;
    
    // Update title tag
    const modeLabel = pomoMode === 'work' ? '專注' : '休息';
    document.title = pomoIsRunning ? `(${digits}) ${modeLabel} - 互動看板` : 'Lab 4 | 互動看板';
}

function toggleTimer() {
    if (pomoIsRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    initAudioContext();
    pomoIsRunning = true;
    
    const startStopBtn = document.getElementById('btnTimerStartStop');
    startStopBtn.classList.remove('play');
    startStopBtn.classList.add('pause');
    
    const icon = document.getElementById('timerStartStopIcon');
    icon.setAttribute('data-lucide', 'pause');
    lucide.createIcons();
    
    pomoInterval = setInterval(() => {
        pomoTimeRemaining--;
        if (pomoTimeRemaining <= 0) {
            timerCompleted();
        } else {
            updateTimerDisplay();
            // Increment total focus seconds in stats
            if (pomoMode === 'work' && pomoTimeRemaining % 60 === 0) {
                settings.totalFocusMinutes++;
                document.getElementById('statFocusTime').textContent = `${settings.totalFocusMinutes}m`;
                saveSettings();
            }
        }
    }, 1000);
}

function stopTimer() {
    pomoIsRunning = false;
    clearInterval(pomoInterval);
    pomoInterval = null;
    
    const startStopBtn = document.getElementById('btnTimerStartStop');
    startStopBtn.classList.remove('pause');
    startStopBtn.classList.add('play');
    
    const icon = document.getElementById('timerStartStopIcon');
    icon.setAttribute('data-lucide', 'play');
    lucide.createIcons();
    
    updateTimerDisplay();
}

function resetTimer() {
    stopTimer();
    pomoTimeRemaining = pomoDuration;
    updateTimerDisplay();
}

function timerCompleted() {
    stopTimer();
    playChimeAlert();
    
    if (pomoMode === 'work') {
        settings.completedPomos++;
        document.getElementById('completedPomos').textContent = settings.completedPomos;
        // Add 25 minutes worth to stat
        settings.totalFocusMinutes += 25;
        document.getElementById('statFocusTime').textContent = `${settings.totalFocusMinutes}m`;
        saveSettings();
        
        alert('🎉 恭喜你！專注時間終了。可以開始休息囉！');
        setTimerMode('short');
    } else {
        alert('☕ 休息時間結束！準備好繼續奮鬥了嗎？');
        setTimerMode('work');
    }
}

/* ==========================================================================
   Kanban Board Logic
   ========================================================================== */

function initKanban() {
    document.getElementById('btnAddTask').addEventListener('click', () => openTaskModal());
    document.getElementById('btnTaskModalClose').addEventListener('click', closeTaskModal);
    document.getElementById('btnCancelTaskModal').addEventListener('click', closeTaskModal);
    document.getElementById('taskForm').addEventListener('submit', onTaskFormSubmit);
    document.getElementById('btnAddSubtaskRow').addEventListener('click', () => addSubtaskRow());
    
    // Drag & Drop event listeners on containers
    const cols = document.querySelectorAll('.cards-container');
    cols.forEach(col => {
        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.classList.add('drag-over');
        });
        
        col.addEventListener('dragleave', () => {
            col.classList.remove('drag-over');
        });
        
        col.addEventListener('drop', (e) => {
            col.classList.remove('drag-over');
            const taskId = e.dataTransfer.getData('text/plain');
            const targetStatus = col.parentElement.getAttribute('data-status');
            moveTask(taskId, targetStatus);
        });
    });
    
    renderTasks();
}

function openTaskModal(task = null) {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const titleInput = document.getElementById('taskTitleInput');
    const prioritySelect = document.getElementById('taskPriorityInput');
    const dateInput = document.getElementById('taskDateInput');
    const idInput = document.getElementById('taskIdInput');
    const subtaskContainer = document.getElementById('subtaskInputsList');
    
    form.reset();
    subtaskContainer.innerHTML = '';
    
    if (task) {
        document.getElementById('modalTitle').textContent = '編輯任務';
        idInput.value = task.id;
        titleInput.value = task.title;
        prioritySelect.value = task.priority;
        dateInput.value = task.dueDate || '';
        
        if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks.forEach(sub => addSubtaskRow(sub.text, sub.id));
        } else {
            addSubtaskRow();
        }
    } else {
        document.getElementById('modalTitle').textContent = '新增看板任務';
        idInput.value = '';
        addSubtaskRow();
    }
    
    modal.classList.add('active');
    titleInput.focus();
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
}

function addSubtaskRow(val = '', existingId = '') {
    const container = document.getElementById('subtaskInputsList');
    const id = existingId || 'sub_' + Math.random().toString(36).substr(2, 9);
    
    const row = document.createElement('div');
    row.className = 'subtask-input-row';
    row.setAttribute('data-id', id);
    
    row.innerHTML = `
        <input type="text" class="subtask-text-input" placeholder="子任務內容..." value="${val}">
        <button type="button" class="btn-remove-subtask" title="刪除子任務">
            <i data-lucide="minus-circle"></i>
        </button>
    `;
    
    row.querySelector('.btn-remove-subtask').addEventListener('click', () => {
        row.remove();
    });
    
    container.appendChild(row);
    lucide.createIcons();
}

function onTaskFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('taskIdInput').value;
    const title = document.getElementById('taskTitleInput').value;
    const priority = document.getElementById('taskPriorityInput').value;
    const dueDate = document.getElementById('taskDateInput').value;
    
    // Extract subtasks
    const subtaskRows = document.querySelectorAll('.subtask-input-row');
    const subtasks = [];
    subtaskRows.forEach(row => {
        const text = row.querySelector('.subtask-text-input').value.trim();
        if (text) {
            const sid = row.getAttribute('data-id');
            // Check if task previously had this subtask
            let wasDone = false;
            if (id) {
                const existingTask = tasks.find(t => t.id === id);
                if (existingTask && existingTask.subtasks) {
                    const match = existingTask.subtasks.find(s => s.id === sid);
                    if (match) wasDone = match.done;
                }
            }
            subtasks.push({ id: sid, text, done: wasDone });
        }
    });
    
    if (id) {
        // Edit existing
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.title = title;
            task.priority = priority;
            task.dueDate = dueDate;
            task.subtasks = subtasks;
        }
    } else {
        // New Task
        const newTask = {
            id: 'task_' + Math.random().toString(36).substr(2, 9),
            title,
            priority,
            dueDate,
            status: 'todo',
            subtasks
        };
        tasks.push(newTask);
    }
    
    saveTasks();
    renderTasks();
    closeTaskModal();
}

function deleteTask(id) {
    if (confirm('確定要刪除此任務嗎？')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

function moveTask(id, newStatus) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.status = newStatus;
        saveTasks();
        renderTasks();
    }
}

function toggleSubtask(taskId, subtaskId, isChecked) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
        const sub = task.subtasks.find(s => s.id === subtaskId);
        if (sub) {
            sub.done = isChecked;
            saveTasks();
            renderTasks();
        }
    }
}

function renderTasks() {
    const todoContainer = document.getElementById('containerTodo');
    const progressContainer = document.getElementById('containerProgress');
    const doneContainer = document.getElementById('containerDone');
    
    todoContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    doneContainer.innerHTML = '';
    
    let countTodo = 0;
    let countProgress = 0;
    let countDone = 0;
    
    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.setAttribute('draggable', 'true');
        card.setAttribute('data-id', task.id);
        
        // Setup priority tag
        const priTag = `<div class="task-priority-tag ${task.priority}">${task.priority}</div>`;
        
        // Setup Subtasks progress
        let subtaskProgressHtml = '';
        if (task.subtasks && task.subtasks.length > 0) {
            const total = task.subtasks.length;
            const completed = task.subtasks.filter(s => s.done).length;
            const percent = Math.round((completed / total) * 100);
            
            subtaskProgressHtml = `
                <div class="task-subtasks-progress">
                    <div class="progress-header">
                        <span>子任務</span>
                        <span>${completed}/${total} (${percent}%)</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-bar-fill" style="width: ${percent}%"></div>
                    </div>
                </div>
                <div class="task-subtasks-checkboxes" style="margin-bottom: 0.8rem; display: flex; flex-direction: column; gap: 4px;">
                    ${task.subtasks.map(s => `
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <input type="checkbox" id="${s.id}" class="sub-check" ${s.done ? 'checked' : ''} style="cursor: pointer;">
                            <label for="${s.id}" style="font-size: 0.75rem; color: ${s.done ? 'var(--text-muted)' : 'var(--text-main)'}; text-decoration: ${s.done ? 'line-through' : 'none'}; cursor: pointer;">${s.text}</label>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Setup Due date
        let dueHtml = '';
        if (task.dueDate) {
            const todayStr = new Date().toISOString().split('T')[0];
            const isOverdue = task.dueDate < todayStr && task.status !== 'done';
            dueHtml = `
                <div class="task-due ${isOverdue ? 'overdue' : ''}">
                    <i data-lucide="calendar"></i>
                    <span>${task.dueDate}</span>
                </div>
            `;
        }
        
        card.innerHTML = `
            ${priTag}
            <h4>${task.title}</h4>
            ${subtaskProgressHtml}
            <div class="task-footer">
                ${dueHtml}
                <div class="task-actions">
                    <button class="btn-card-action edit" title="編輯">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn-card-action delete" title="刪除">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Event Listeners on Card
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            card.classList.add('dragging');
        });
        
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
        
        // Checkboxes listener inside card
        card.querySelectorAll('.sub-check').forEach(cb => {
            cb.addEventListener('change', (e) => {
                toggleSubtask(task.id, cb.id, e.target.checked);
            });
        });
        
        card.querySelector('.btn-card-action.edit').addEventListener('click', (e) => {
            e.stopPropagation();
            openTaskModal(task);
        });
        
        card.querySelector('.btn-card-action.delete').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });
        
        // Append to column
        if (task.status === 'todo') {
            todoContainer.appendChild(card);
            countTodo++;
        } else if (task.status === 'progress') {
            progressContainer.appendChild(card);
            countProgress++;
        } else {
            doneContainer.appendChild(card);
            countDone++;
        }
    });
    
    // Update counters
    document.getElementById('countTodo').textContent = countTodo;
    document.getElementById('countProgress').textContent = countProgress;
    document.getElementById('countDone').textContent = countDone;
    
    // Update completed tasks count in Header
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    document.getElementById('statCompletedTasks').textContent = completedTasks;
    
    lucide.createIcons();
}

/* ==========================================================================
   Sticky Notes Logic
   ========================================================================== */

function initStickyNotes() {
    const board = document.getElementById('stickyNotesBoard');
    
    board.addEventListener('dblclick', (e) => {
        // Double clicking target is board, not note or its elements
        if (e.target === board || e.target.id === 'stickyBoardPlaceholder') {
            const rect = board.getBoundingClientRect();
            const x = e.clientX - rect.left - 90; // center offset
            const y = e.clientY - rect.top - 90;
            createStickyNote(x, y);
        }
    });
    
    document.getElementById('btnAddNote').addEventListener('click', () => {
        // Add note in the center
        const board = document.getElementById('stickyNotesBoard');
        const x = (board.clientWidth / 2) - 90 + (Math.random() * 40 - 20);
        const y = (board.clientHeight / 2) - 90 + (Math.random() * 40 - 20);
        createStickyNote(x, y);
    });
    
    renderStickyNotes();
}

function createStickyNote(x, y, text = '', color = 'yellow', rotate = 0, existingId = null) {
    const board = document.getElementById('stickyNotesBoard');
    const id = existingId || 'note_' + Math.random().toString(36).substr(2, 9);
    
    // Remove placeholder
    const placeholder = document.getElementById('stickyBoardPlaceholder');
    if (placeholder) placeholder.style.opacity = '0';
    
    const noteEl = document.createElement('div');
    noteEl.className = `sticky-note-card note-${color}`;
    noteEl.setAttribute('data-id', id);
    
    const angle = rotate || (Math.random() * 6 - 3); // random rotation (-3 to +3 degrees)
    noteEl.style.transform = `rotate(${angle}deg)`;
    noteEl.style.left = `${x}px`;
    noteEl.style.top = `${y}px`;
    
    noteEl.innerHTML = `
        <div class="sticky-note-header">
            <div class="sticky-note-color-dots">
                <span class="color-dot note-yellow" data-color="yellow"></span>
                <span class="color-dot note-blue" data-color="blue"></span>
                <span class="color-dot note-pink" data-color="pink"></span>
                <span class="color-dot note-green" data-color="green"></span>
                <span class="color-dot note-purple" data-color="purple"></span>
            </div>
            <button class="btn-note-close" title="刪除便利貼">
                <i data-lucide="x"></i>
            </button>
        </div>
        <textarea class="sticky-note-body" placeholder="雙擊寫下想法...">${text}</textarea>
    `;
    
    // Events inside note
    const textarea = noteEl.querySelector('.sticky-note-body');
    textarea.addEventListener('input', () => {
        const note = notes.find(n => n.id === id);
        if (note) {
            note.text = textarea.value;
            saveNotes();
        }
    });
    
    // Color dots listener
    noteEl.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            const clr = e.target.getAttribute('data-color');
            noteEl.className = `sticky-note-card note-${clr}`;
            const note = notes.find(n => n.id === id);
            if (note) {
                note.color = clr;
                saveNotes();
            }
        });
    });
    
    // Close listener
    noteEl.querySelector('.btn-note-close').addEventListener('click', () => {
        noteEl.remove();
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        if (notes.length === 0 && placeholder) {
            placeholder.style.opacity = '1';
        }
    });
    
    // Drag Logic (Absolute Position)
    noteEl.addEventListener('mousedown', (e) => {
        // Do not drag if focusing color dots or close button
        if (e.target.closest('.sticky-note-header') || e.target.classList.contains('color-dot')) return;
        
        let startX = e.clientX;
        let startY = e.clientY;
        let origX = noteEl.offsetLeft;
        let origY = noteEl.offsetTop;
        
        // Put active note on top
        document.querySelectorAll('.sticky-note-card').forEach(c => c.style.zIndex = '10');
        noteEl.style.zIndex = '30';
        
        function onMouseMove(e) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            let newX = origX + dx;
            let newY = origY + dy;
            
            // Boundary constraints inside board
            const maxX = board.clientWidth - noteEl.clientWidth;
            const maxY = board.clientHeight - noteEl.clientHeight;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            noteEl.style.left = `${newX}px`;
            noteEl.style.top = `${newY}px`;
        }
        
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
            // Save updated coordinates
            const note = notes.find(n => n.id === id);
            if (note) {
                note.x = noteEl.offsetLeft;
                note.y = noteEl.offsetTop;
                saveNotes();
            }
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    
    board.appendChild(noteEl);
    lucide.createIcons();
    
    // Save state if new note
    if (!existingId) {
        notes.push({ id, x, y, text, color, rotate: angle });
        saveNotes();
    }
}

function renderStickyNotes() {
    const board = document.getElementById('stickyNotesBoard');
    // Clear old notes
    const cards = board.querySelectorAll('.sticky-note-card');
    cards.forEach(c => c.remove());
    
    const placeholder = document.getElementById('stickyBoardPlaceholder');
    if (notes.length > 0) {
        if (placeholder) placeholder.style.opacity = '0';
        notes.forEach(note => {
            createStickyNote(note.x, note.y, note.text, note.color, note.rotate, note.id);
        });
    } else {
        if (placeholder) placeholder.style.opacity = '1';
    }
}

/* ==========================================================================
   Sound Button Handlers
   ========================================================================== */

function initSoundboard() {
    const rainBtn = document.getElementById('btnRainSound');
    const wavesBtn = document.getElementById('btnWavesSound');
    const cafeBtn = document.getElementById('btnCafeSound');
    
    rainBtn.addEventListener('click', () => {
        const isPlaying = rainBtn.classList.toggle('playing');
        toggleRainSound(isPlaying);
    });
    
    wavesBtn.addEventListener('click', () => {
        const isPlaying = wavesBtn.classList.toggle('playing');
        toggleWavesSound(isPlaying);
    });
    
    cafeBtn.addEventListener('click', () => {
        const isPlaying = cafeBtn.classList.toggle('playing');
        toggleCafeSound(isPlaying);
    });
    
    // Volume slider listeners
    document.getElementById('volRain').addEventListener('input', (e) => {
        if (activeAudioNodes['rain']) {
            activeAudioNodes['rain'].gainNode.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
        }
    });
    
    document.getElementById('volWaves').addEventListener('input', (e) => {
        if (activeAudioNodes['waves']) {
            activeAudioNodes['waves'].gainNode.gain.setValueAtTime(parseFloat(e.target.value) * 0.4, audioCtx.currentTime);
        }
    });
    
    document.getElementById('volCafe').addEventListener('input', (e) => {
        if (activeAudioNodes['cafe']) {
            activeAudioNodes['cafe'].gainNode.gain.setValueAtTime(parseFloat(e.target.value) * 0.7, audioCtx.currentTime);
        }
    });
}

/* ==========================================================================
   Persistence (Local Storage)
   ========================================================================== */

function saveTasks() { localStorage.setItem('imweb_tasks', JSON.stringify(tasks)); }
function saveNotes() { localStorage.setItem('imweb_notes', JSON.stringify(notes)); }
function saveHabits() { localStorage.setItem('imweb_habits', JSON.stringify(habits)); }
function saveSettings() { localStorage.setItem('imweb_settings', JSON.stringify(settings)); }

function loadSavedData() {
    const t = localStorage.getItem('imweb_tasks');
    const n = localStorage.getItem('imweb_notes');
    const h = localStorage.getItem('imweb_habits');
    const s = localStorage.getItem('imweb_settings');
    
    tasks = t ? JSON.parse(t) : getMockTasks();
    notes = n ? JSON.parse(n) : [];
    habits = h ? JSON.parse(h) : { read: false, exercise: false, water: false, code: false };
    settings = s ? JSON.parse(s) : { theme: 'glass-dark', completedPomos: 0, totalFocusMinutes: 0, weatherCity: 'Taipei' };
}

function getMockTasks() {
    return [
        {
            id: 'task_mock_1',
            title: '設計網頁實習作品集 UI 介面 ✨',
            priority: 'high',
            dueDate: new Date().toISOString().split('T')[0], // today
            status: 'progress',
            subtasks: [
                { id: 'sub_mock_11', text: '繪製草圖與流程圖', done: true },
                { id: 'sub_mock_12', text: '設計毛玻璃 (Glassmorphic) 樣式', done: false },
                { id: 'sub_mock_13', text: '完成 CSS 變數主題色彩系統', done: false }
            ]
        },
        {
            id: 'task_mock_2',
            title: '寫出 Lab 4 互動看板功能 💻',
            priority: 'medium',
            dueDate: '',
            status: 'todo',
            subtasks: [
                { id: 'sub_mock_21', text: '實作 HTML5 Drag and Drop 看板拖曳', done: false },
                { id: 'sub_mock_22', text: '建置 Web Audio API 背景音效合成器', done: false },
                { id: 'sub_mock_23', text: '連結 LocalStorage 儲存資料狀態', done: false }
            ]
        },
        {
            id: 'task_mock_3',
            title: '測試 Neon Mario 跳躍遊戲 🎮',
            priority: 'low',
            dueDate: '2026-06-04',
            status: 'done',
            subtasks: []
        }
    ];
}

/* ==========================================================================
   Page Initializer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    
    // Set UI weather selector
    const weatherSelector = document.getElementById('weatherCity');
    weatherSelector.value = settings.weatherCity;
    weatherSelector.addEventListener('change', (e) => updateWeather(e.target.value));
    
    // Init widgets and sections
    startClock();
    updateWeather(settings.weatherCity);
    initThemes();
    initHabitTracker();
    initSoundboard();
    initPomodoro();
    initKanban();
    initStickyNotes();
    
    // Initialize Lucide Icon vectors
    lucide.createIcons();
});
