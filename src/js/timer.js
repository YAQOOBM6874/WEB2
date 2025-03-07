// timer.js - Manages the timer logic and state
export class Timer {
    constructor() {
        this.workDuration = 25 * 60;
        this.breakDuration = 5 * 60;
        this.longBreakDuration = 15 * 60;
        this.sessionCount = 0;
        this.maxSessions = 4;
        this.isActive = false;
        this.timerId = null;
        this.isBreak = false;
        this.currentDuration = 0; 
    }

    start(duration, onUpdate, onComplete, settings) {
        if (!this.isActive) {
            this.isActive = true;
            this.currentDuration = duration; 
            let remainingTime = duration;
            this.timerId = setInterval(() => {
                if (remainingTime > 0) {
                    remainingTime--;
                    onUpdate(remainingTime);
                } else {
                    clearInterval(this.timerId);
                    this.isActive = false;
                    if (!this.isBreak && settings.selectedTaskSpan.textContent !== 'لا شيء') {
                        const selectedTaskLi = Array.from(settings.tasksList.children).find(li =>
                            li.querySelector('span').textContent === settings.selectedTaskSpan.textContent
                        );
                        if (selectedTaskLi) {
                            selectedTaskLi.dataset.sessions = (parseInt(selectedTaskLi.dataset.sessions) || 0) + 1;
                            selectedTaskLi.querySelector('span').textContent = `${settings.selectedTaskSpan.textContent} (${selectedTaskLi.dataset.sessions})`;
                            settings.saveTasks();
                        }
                    }
                    try {
                        onComplete();
                    } catch (error) {
                        console.error('خطأ أثناء إتمام الجلسة:', error);
                    }
                }
            }, 1000);
        }
    }

    pause() {
        if (this.isActive) {
            clearInterval(this.timerId);
            this.isActive = false;
        }
    }

    reset() {
        this.pause();
        this.sessionCount = 0;
        this.isBreak = false;
        this.currentDuration = 0;
    }

    updateDurations(settings) {
        this.workDuration = settings.validateDuration(settings.workDurationInput.value);
        this.breakDuration = settings.validateDuration(settings.breakDurationInput.value);
        this.longBreakDuration = settings.validateDuration(settings.longBreakDurationInput.value);
    }

    nextCycle(onUpdate, onComplete, settings) {
        this.sessionCount++;
        console.log('Session count updated to:', this.sessionCount);
        if (this.sessionCount > this.maxSessions && this.isBreak) {
            console.log('Reached max sessions, stopping cycle.');
            this.sessionCount = 0;
            this.currentDuration = 0;
            return null;
        }

        let nextDuration;
        if (this.sessionCount > 0 && this.sessionCount % 4 === 0) {
            this.isBreak = true;
            console.log('Starting long break:', this.longBreakDuration / 60, 'minutes');
            nextDuration = this.longBreakDuration;
        } else if (this.isBreak) {
            this.isBreak = false;
            console.log('Returning to work:', this.workDuration / 60, 'minutes');
            nextDuration = this.workDuration;
        } else {
            this.isBreak = true;
            console.log('Starting break:', this.breakDuration / 60, 'minutes');
            nextDuration = this.breakDuration;
        }

        this.currentDuration = nextDuration; 
        this.start(nextDuration, onUpdate, onComplete, settings);
        return nextDuration;
    }
}