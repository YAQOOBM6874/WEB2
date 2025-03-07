// ui.js - Handles DOM manipulation and user interface updates
export class UI {
    constructor() {
        this.timerDisplay = document.getElementById('timer');
        this.minutesSpan = document.getElementById('minutes');
        this.secondsSpan = document.getElementById('seconds');
        this.startBtn = document.getElementById('start');
        this.pauseBtn = document.getElementById('pause');
        this.resetBtn = document.getElementById('reset');
        this.sessionCountDisplay = document.getElementById('sessionCount');
        this.progressBar = document.getElementById('progress-bar');
        this.body = document.body;
    }

    updateTimerDisplay(time, totalDuration) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.minutesSpan.textContent = String(minutes).padStart(2, '0');
        this.secondsSpan.textContent = String(seconds).padStart(2, '0');

        const progressPercentage = (totalDuration - time) / totalDuration * 100;
        this.progressBar.style.width = `${progressPercentage}%`;
    }

    updateSessionCount(count) {
        this.sessionCountDisplay.textContent = `عدد الجلسات: ${count}/4`;
    }

    bindEvents(timer, settings, notifications) {
        [settings.workDurationInput, settings.breakDurationInput, settings.longBreakDurationInput].forEach(input => {
            input.addEventListener('change', () => {
                settings.saveSettings();
                console.log('تم حفظ الإعدادات:', {
                    work: settings.workDurationInput.value,
                    break: settings.breakDurationInput.value,
                    longBreak: settings.longBreakDurationInput.value
                });
            });
        });

        this.startBtn.addEventListener('click', () => {
            if (!timer.isActive) {
                console.log('بدء الجلسة الأولى.');
                timer.updateDurations(settings);
                const duration = settings.getCurrentDuration(timer.isBreak, timer.sessionCount);
                if (!timer.isBreak) {
                    this.body.classList.remove('night');
                    this.body.classList.add('day');
                } else {
                    this.body.classList.remove('day');
                    this.body.classList.add('night');
                }

                const startNextCycle = () => {
                    timer.updateDurations(settings);
                    const nextDuration = timer.nextCycle(
                        time => this.updateTimerDisplay(time, timer.currentDuration),
                        () => {
                            console.log('نهاية جلسة، استدعاء playSound.');
                            notifications.playSound();
                            startNextCycle();
                        },
                        settings
                    );
                    if (nextDuration === null) {
                        console.log('Cycle completed, stopping.');
                        this.timerDisplay.classList.remove('active');
                        this.progressBar.style.width = '0%';
                        return;
                    }
                    this.updateSessionCount(timer.sessionCount);
                    if (timer.isBreak) {
                        this.body.classList.remove('day');
                        this.body.classList.add('night');
                    } else {
                        this.body.classList.remove('night');
                        this.body.classList.add('day');
                    }
                    console.log('Starting next cycle with duration:', nextDuration / 60, 'minutes');
                };

                timer.start(
                    duration,
                    time => {
                        this.updateTimerDisplay(time, duration);
                        this.timerDisplay.classList.add('active');
                    },
                    () => {
                        console.log('نهاية جلسة الأولى، استدعاء playSound.');
                        notifications.playSound();
                        startNextCycle();
                    },
                    settings
                );
            }
        });

        this.pauseBtn.addEventListener('click', () => {
            timer.pause();
            this.timerDisplay.classList.remove('active');
        });

        this.resetBtn.addEventListener('click', () => {
            timer.reset();
            timer.updateDurations(settings);
            this.updateTimerDisplay(timer.workDuration, timer.workDuration);
            this.updateSessionCount(timer.sessionCount);
            this.timerDisplay.classList.remove('active');
            this.progressBar.style.width = '0%';
            this.body.classList.remove('day');
            this.body.classList.add('night');
        });
    }
}