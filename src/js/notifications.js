// notifications.js - Handles audio notifications
export class Notifications {
    constructor() {
        this.sound = document.getElementById('end-sound');
        if (!this.sound) {
            console.warn('لم يتم العثور على عنصر الصوت (end-sound).');
        }
        this.isMuted = false;
        this.isAudioAllowed = true;
    }

    playSound() {
        console.log('بدء محاولة تشغيل الصوت...', { isMuted: this.isMuted, isAudioAllowed: this.isAudioAllowed });
        if (!this.sound) {
            console.warn('الصوت غير متاح.');
            return;
        }

        if (this.isAudioAllowed && !this.isMuted) {
            console.log('الصوت مسموح به، محاولة التشغيل...');
            this.sound.currentTime = 0;
            const playPromise = this.sound.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('تم تشغيل الصوت بنجاح.');
                    })
                    .catch(error => {
                        console.error('فشل تشغيل الصوت:', error);
                        if (error.name === 'NotAllowedError') {
                            console.log('الصوت ممنوع بسبب قيود المتصفح.');
                            this.isMuted = true;
                        } else if (error.name === 'NotSupportedError') {
                            console.log('صيغة الصوت غير مدعومة.');
                        }
                    });
            } else {
                console.warn('playPromise غير معرف، قد تكون هناك مشكلة في المتصفح.');
            }
        } else {
            console.warn('الصوت معطل أو غير مسموح به.', { isMuted: this.isMuted, isAudioAllowed: this.isAudioAllowed });
            this.isMuted = false;
            this.isAudioAllowed = true;
            this.playSound();
        }
    }
}