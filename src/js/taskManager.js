export class TaskManager {
    constructor() {
        this.taskInput = document.getElementById('task-input');
        this.addTaskBtn = document.getElementById('add-task');
        this.taskList = document.getElementById('task-list');
        this.activeTaskDisplay = document.getElementById('active-task');
        this.tasks = []; 
        this.activeTask = null; 

        this.loadTasks();
    }

    
    loadTasks() {
        const savedTasks = localStorage.getItem('pomodoroTasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
        this.renderTasks();
    }

    
    saveTasks() {
        localStorage.setItem('pomodoroTasks', JSON.stringify(this.tasks));
    }

   
    renderTasks() {
        this.taskList.innerHTML = '';
        this.tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (this.activeTask && this.activeTask.name === task.name) {
                li.classList.add('active');
            }
            li.innerHTML = `
                ${task.name} (${task.sessions} جلسة)
                <button class="delete-task" data-index="${index}">حذف</button>
            `;
            li.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-task')) {
                    this.setActiveTask(task);
                }
            });
            this.taskList.appendChild(li);
        });

     
        this.activeTaskDisplay.textContent = this.activeTask ? this.activeTask.name : 'لا توجد مهمة مختارة';
    }

    /**
     * Set the active task
     * @param {Object} task 
     */
    setActiveTask(task) {
        this.activeTask = task;
        this.renderTasks();
    }

    addTask() {
        const taskName = this.taskInput.value.trim();
        if (taskName) {
            this.tasks.push({ name: taskName, sessions: 0 });
            this.taskInput.value = ''; 
            this.saveTasks();
            this.renderTasks();
        }
    }

    /**
     * Delete a task
     * @param {number} index 
     */
    deleteTask(index) {
        if (this.activeTask && this.tasks[index].name === this.activeTask.name) {
            this.activeTask = null; 
        }
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.renderTasks();
    }

    
    incrementActiveTaskSession() {
        if (this.activeTask) {
            const taskIndex = this.tasks.findIndex(task => task.name === this.activeTask.name);
            if (taskIndex !== -1) {
                this.tasks[taskIndex].sessions += 1;
                this.activeTask.sessions = this.tasks[taskIndex].sessions; 
                this.saveTasks();
                this.renderTasks();
            }
        }
    }

    
    bindEvents() {
       
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        
        this.taskList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-task')) {
                const index = parseInt(e.target.dataset.index);
                this.deleteTask(index);
            }
        });
    }
}