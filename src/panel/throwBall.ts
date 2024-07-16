let timer: Date;

export function updateThrowBallTimer() {
    const now = new Date();
    timer = new Date(now.getTime() + 60 * 3 * 1000);
    // timer = new Date(now.getTime() + 30 * 1000);
}

export function getRemainingThrowBallTime() {
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

export function showThrowBallMessage(remainingTime: string) {
    const throwBallMessage = document.getElementById('throw-ball-message');
    if (throwBallMessage) {
        throwBallMessage.style.display = "block";
        throwBallMessage.innerHTML = "✨Let's have a rest and play with the ball🎾! Time remaining: " + remainingTime;
    }
}

export function hideThrowBallMessage() {
    const throwBallMessage = document.getElementById('throw-ball-message');
    if (throwBallMessage) {
        throwBallMessage.innerHTML = "It's time to continue your learning!👨‍💻";
        setTimeout(() => {
            throwBallMessage.style.display = "none";
        }, 1500);
    }
}