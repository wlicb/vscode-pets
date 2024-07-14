let timer: Date;

export function updateBoostTimer() {
    const now = new Date();
    timer = new Date(now.getTime() + 60 * 15 * 1000);
    // timer = new Date(now.getTime() + 30 * 1000);
}

export function getRemainingBoostTime() {
    let timerText: string = "";
    const now = new Date();
    const remainingTime = timer.getTime() - now.getTime();
    if (remainingTime > 0) {
        // const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');
    
        timerText = `${paddedMinutes}:${paddedSeconds}`;
    }
    return timerText;
}

export function showBoostMessage(remainingTime: string) {
    const boostMessage = document.getElementById('boost-message');
    if (boostMessage) {
        boostMessage.style.display = "block";
        boostMessage.innerHTML = "🚀Boosting your level up... Time remaining: " + remainingTime;
    }
}

export function hideBoostMessage() {
    const boostMessage = document.getElementById('boost-message');
    if (boostMessage) {
        boostMessage.style.display = "none";
    }
}