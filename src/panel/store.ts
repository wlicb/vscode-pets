import { updateCoin, allPets, getCoin, getUserID, updateExRate } from "./main";
import { updateBoostTimer, getRemainingBoostTime, showBoostMessage, hideBoostMessage } from "./boost";
import { getRemainingThrowBallTime, hideThrowBallMessage, showThrowBallMessage, updateThrowBallTimer } from "./throwBall";

type Activity = {
    index: number,
    price: number,
    callback: Function,
    level: number,
    purchaseInterval: number,
    lockLowHealth: boolean
};

const activityList: Activity[] = [];
activityList.push({
    index: 0,
    price: 2,
    callback: pet,
    level: 1,
    purchaseInterval: 2,
    lockLowHealth: false
});

activityList.push({
    index: 1,
    price: 5,
    callback: feed,
    level: 2,
    purchaseInterval: 0.5,
    lockLowHealth: true
});

activityList.push({
    index: 2,
    price: 5,
    callback: play,
    level: 3,
    purchaseInterval: 10,
    lockLowHealth: true
});

activityList.push({
    index: 3,
    price: 5,
    callback: boost,
    level: 1,
    purchaseInterval: 30,
    lockLowHealth: false
});

const NUM_OF_ELEMENTS = activityList.length;
// const timers = [];


function pet() {
    allPets.pets.forEach((petEm) => {
        void petEm.pet.setHealth(petEm.pet.getHealth() + 10, false, getUserID());
        petEm.pet.pet();
    });
}

function feed() {
    const cursor = document.getElementById("cursor");
    if (cursor) {
        cursor.style.display = "block";
        function handleMouseMove(e: MouseEvent) {
            if (cursor) {
                cursor.style.left = `${e.clientX}px`;
            }
        }
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', (e) => {
            allPets.pets.forEach((petEm) => {
                document.removeEventListener('mousemove', handleMouseMove);
                petEm.pet.eat(e.clientX, cursor, getUserID());
            });
            // cursor.style.display = "none";
        }, { once: true });
    }
}


function play() {
    const throwBallButton = document.getElementById('throw-ball-button') as HTMLButtonElement;
    if (throwBallButton) {
        updateThrowBallTimer();
        throwBallButton.disabled = false;
        const interval = setInterval(() => {
            const timerText = getRemainingThrowBallTime();
            if (timerText === "") {
                hideThrowBallMessage();
                throwBallButton.disabled = true;
                clearInterval(interval);
            } else {
                showThrowBallMessage(timerText);
            }
        }, 500);
        showThrowBallMessage(getRemainingThrowBallTime());
    }
}

function boost() {
    updateExRate(5);
    updateBoostTimer();
    const interval = setInterval(() => {
        const timerText = getRemainingBoostTime();
        if (timerText === "") {
            hideBoostMessage();
            updateExRate(1);
            clearInterval(interval);
        } else {
            showBoostMessage(timerText);
        }
    }, 500);
    showBoostMessage(getRemainingBoostTime());
}


function lock(targetLevel: number, currentLevel: number, health: number, locKLowHealth: boolean, button: HTMLButtonElement, text: HTMLElement) {
    if (!text.innerHTML.startsWith("⏱️")) {
        if (currentLevel >= targetLevel) {
            if (health < 10 && locKLowHealth) {
                button.disabled = true;
                text.innerHTML = "Health too low!";
            } else {
                button.disabled = false;
                text.innerHTML = "Available!";
            }
        } else {
            button.disabled = true;
            text.innerHTML = "Available at level " + targetLevel;
        }
    }
}

export function lockAll(currentLevel: number, health: number) {
    for (var i = 0; i < NUM_OF_ELEMENTS; i++) {
        const button = document.getElementsByClassName('store-buttons')[i];
        const text = document.getElementsByClassName('store-element-timer')[i];
        if (button && text) {
            lock(activityList[i].level, currentLevel, health, activityList[i].lockLowHealth, button as HTMLButtonElement, text as HTMLElement);
        }
    }
}

export function purchase(index: number): number {
    let found = false;
    let bought = false;
    activityList.forEach(activity => {
        if (index === activity.index) {
            found = true;
            if (getCoin() >= activity.price) {
                bought = true;
                updateCoin(-activity.price);
                showMessage(0);
                setTimeout(() => {
                    hideMessage();
                    hideStore();
                    setTimeout(() => {
                        activity.callback();
                    }, 500);
                }, 1500);
                
                // console.log(showMessage);
                // return 0;
            } else {
                showMessage(1);
                setTimeout(() => {
                    hideMessage();
                }, 1500);
                // return 1;
            }
        }
    });
    if (!found) {
        return -1;
    } else if (!bought) {
        return 1;
    } else {
        return 0;
    }

}

export function showStore(targetTimes: Date[]) {
    const store = document.getElementById("store");
    if (store) {
        const buttons = document.getElementsByClassName('store-buttons');
        for (var i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            // console.log(button);
            const index = (button as HTMLElement).dataset.index;
            // console.log(index);
            const now = new Date();
            if (new Date(targetTimes[Number(index)]).getTime() >= now.getTime()) {
                (button as HTMLButtonElement).disabled = true;
                setInterval(() => {
                    updateTimer(targetTimes[Number(index)], Number(index), button as HTMLButtonElement);
                }, 500);
                updateTimer(targetTimes[Number(index)], Number(index), button as HTMLButtonElement);
            }
            
        }
            
        store.style.display = "block";
    }
}

export function hideStore() {
    const store = document.getElementById("store");
    if (store) {
        store.style.display = "none";
    }
}

function showMessage(status: number) {
    const purchaseMessage = document.getElementById('purchase-message');
    if (purchaseMessage) {
        if (status === 0) {
            purchaseMessage.innerHTML = "Purchased! 🎉";
            purchaseMessage.style.padding = "8%";
        } else {
            purchaseMessage.innerHTML = "❗ Opps, You do not have enough coins. Code to earn coins! 💪";
            purchaseMessage.style.padding = "5%";
        }
        purchaseMessage.style.display = "block";
    }
}

function hideMessage() {
    const purchaseMessage = document.getElementById('purchase-message');
    if (purchaseMessage) {
        purchaseMessage.style.display = "none";
    }
}



export function computeTargetTime(index: number) {
    const now = new Date();
    const targetTime = new Date(now.getTime() + 60 * 1000 * activityList[index].purchaseInterval);
    return targetTime;
}


export function updateTimer(targetTime: Date, index: number, button: HTMLButtonElement): boolean {
    const now = new Date();
    const remainingTime = new Date(targetTime).getTime() - now.getTime();

    const timer = document.getElementsByClassName('store-element-timer')[index] as HTMLElement;
    if (timer) {
        if (remainingTime <= 0) {
            timer.innerText = "Available!";
            // clearInterval(timerInterval);
            button.disabled = false;
            return true;
        }
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');
    
        timer.innerText = `⏱️${hours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return false;

}

