export class Settings {
    constructor() {
        this.workDurationInput = document.getElementById('work-duration');
        this.breakDurationInput = document.getElementById('break-duration');
        this.longBreakDurationInput = document.getElementById('long-break-duration');
        this.taskInput = document.getElementById('task-input');
        this.addTaskBtn = document.getElementById('add-task');
        this.tasksList = document.getElementById('tasks');
        this.selectedTaskSpan = document.getElementById('selected-task');
        this.customSoundInput = document.getElementById('custom-sound');
        this.customSoundLabel = document.querySelector('.custom-sound-label');

        this.loadSettings();
        this.loadTasks();
        this.bindTaskEvents();
        this.bindSoundEvents();
        this.bindCheckEvents();
    }

    loadSettings() {
        const savedWork = localStorage.getItem('workDuration');
        const savedBreak = localStorage.getItem('breakDuration');
        const savedLongBreak = localStorage.getItem('longBreakDuration');

        if (savedWork) this.workDurationInput.value = savedWork;
        if (savedBreak) this.breakDurationInput.value = savedBreak;
        if (savedLongBreak) this.longBreakDurationInput.value = savedLongBreak;

        const audio = document.getElementById('end-sound');
        audio.src = './S.wav'; 
    }

    saveSettings() {
        localStorage.setItem('workDuration', this.workDurationInput.value);
        localStorage.setItem('breakDuration', this.breakDurationInput.value);
        localStorage.setItem('longBreakDuration', this.longBreakDurationInput.value);
    }

    loadTasks() {
        while (this.tasksList.firstChild) {
            this.tasksList.removeChild(this.tasksList.firstChild);
        }
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(task => this.addTaskToList(task.name, task.sessions, task.checked || false, false));
        }
        const selectedTask = localStorage.getItem('selectedTask');
        if (this.selectedTaskSpan && selectedTask) {
            this.selectedTaskSpan.textContent = selectedTask;
        } else if (this.selectedTaskSpan) {
            this.selectedTaskSpan.textContent = 'لا شيء';
        }
    }

    saveTasks() {
        const tasks = Array.from(this.tasksList.children).map(li => ({
            name: li.querySelector('.task-name').textContent,
            sessions: parseInt(li.dataset.sessions || 0),
            checked: li.querySelector('.task-check').classList.contains('checked')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        if (this.selectedTaskSpan) {
            localStorage.setItem('selectedTask', this.selectedTaskSpan.textContent);
        }
    }

    bindTaskEvents() {
        this.addTaskBtn.addEventListener('click', () => {
            const taskName = this.taskInput.value.trim();
            if (taskName) {
                this.addTaskToList(taskName);
                this.taskInput.value = '';
                this.saveTasks();
            }
        });

        this.tasksList.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                e.target.parentElement.remove();
                this.saveTasks();
            } else if (e.target.classList.contains('task-name') && this.selectedTaskSpan) {
                this.selectedTaskSpan.textContent = e.target.textContent;
                Array.from(this.tasksList.children).forEach(li => li.classList.remove('selected'));
                e.target.parentElement.classList.add('selected');
                this.saveTasks();
            }
        });
    }

    bindSoundEvents() {
        this.customSoundInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                const audio = document.getElementById('end-sound');
                audio.src = url; 
                console.log('تم تحميل صوت مخصص:', url);
            }
        });
    }

    bindCheckEvents() {
        this.tasksList.addEventListener('click', (e) => {
            if (e.target.classList.contains('task-check') && !e.target.classList.contains('checked')) {
                const li = e.target.parentElement;
                e.target.classList.add('checked');
                this.saveTasks();
            }
        });
    }

    addTaskToList(taskName, sessions = 0, checked = false, save = true) {
        const li = document.createElement('li');
        li.dataset.sessions = sessions;
        li.innerHTML = `<span class="task-check">${checked ? '✓' : '✓'}</span> <span class="task-name">${taskName}</span> <button>حذف</button>`;
        if (checked) {
            li.querySelector('.task-check').classList.add('checked');
        }
        if (this.selectedTaskSpan && this.selectedTaskSpan.textContent === taskName) {
            li.classList.add('selected');
        }
        this.tasksList.appendChild(li);
        if (save) this.saveTasks();
    }

    validateDuration(value) {
        const minutes = parseFloat(value);
        if (isNaN(minutes) || minutes <= 0) return 25 * 60;
        return Math.max(0.1, minutes) * 60;
    }

    getCurrentDuration(isBreak, sessionCount) {
        if (isBreak) {
            return sessionCount > 0 && sessionCount % 4 === 0
                ? this.validateDuration(this.longBreakDurationInput.value)
                : this.validateDuration(this.breakDurationInput.value);
        }
        return this.validateDuration(this.workDurationInput.value);
    }
}