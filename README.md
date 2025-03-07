# Pomodoro Timer
![image](https://github.com/user-attachments/assets/30720ae8-301b-40e5-b707-9d6b6e44ef88)

![image](https://github.com/user-attachments/assets/6ac0d4b3-2e3e-4122-9847-2671e7d743c2)


## Overview
Pomodoro Timer is a web app that helps you manage time using the Pomodoro technique. Set work, break, and long break durations, add tasks, and track sessions. The app features a dynamic UI with Night Mode (stars and planets) during breaks and Day Mode (glowing sun) during work.

## Implementation Choices
- Built with **HTML/CSS/JavaScript** for browser compatibility.
- **Modular JS**: Split into `timer.js`, `ui.js`, `settings.js`, and `notifications.js` for clean code.
- **Dynamic UI**: Switches between Night/Day Mode with CSS animations (twinkling stars, orbiting planets, progress bar).
- **Task Management**: Add, delete, and track tasks with session counts, saved in `localStorage`.
- **Custom Audio**: Default sound (`S.wav`) with an option to upload a custom notification sound.
- **Local Storage**: Saves settings (work/break durations) for persistence.

## How to Run the Application

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Safari).
- (Optional) For development: Node.js and npm installed.

### Steps to Run

#### Option 1: Run Directly
1. Open `index.html` in your browser (double-click the file or use `File > Open`).

#### Option 2: Build with Webpack (For Development)
1. Navigate to the project folder in your terminal.
2. Install dependencies: `npm install`.
3. Build the project: `npm run build`.
4. Open `dist/index.html` in your browser (copy `index.html` to `dist` if needed).

### Notes
- If you face CORS issues, use a local server: `npx http-server`, then visit `http://localhost:8080`.
- Ensure `S.wav` is in the same folder as `index.html` or update the path.

## License
This project is open-source and free to use.
