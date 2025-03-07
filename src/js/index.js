// index.js - Entry point to initialize the application
import '../css/styles.css'; 

import { Timer } from './timer.js'; 
import { UI } from './ui.js';
import { Settings } from './settings.js'; 
import { Notifications } from './notifications.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const timer = new Timer();
    const ui = new UI();
    const settings = new Settings();
    const notifications = new Notifications();

    ui.updateTimerDisplay(timer.workDuration);
    ui.updateSessionCount(timer.sessionCount);
    ui.bindEvents(timer, settings, notifications);
});