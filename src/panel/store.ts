import { updateCoin, allPets, getCoin, getUserID, updateExRate, getNewTarget } from "./main";
import { updateBoostTimer, getRemainingBoostTime, showBoostMessage, hideBoostMessage } from "./boost";

type Activity = {
    index: number,
    price: number,
    callback: Function
};

const activityList: Activity[] = [];
activityList.push({
    index: 0,
    price: 2,
    callback: pet
});

activityList.push({
    index: 1,
    price: 5,
    callback: feed
});

activityList.push({
    index: 2,
    price: 5,
    callback: play
});

activityList.push({
    index: 3,
    price: 5,
    callback: boost
});

// const timers = [];


function pet() {
    allPets.pets.forEach((petEm) => {
        void petEm.pet.setHealth(petEm.pet.getHealth() + 10, false, getUserID());
    });
}

function feed() {
    allPets.pets.forEach((petEm) => {
        void petEm.pet.setHealth(petEm.pet.getHealth() + 25, false, getUserID());
    });
}

function play() {
    allPets.pets.forEach((petEm) => {
        void petEm.pet.setExperience(petEm.pet.getExperience() + 10, false, getUserID(), getNewTarget(petEm.pet.getLevel() + 1));
    });
}

function boost() {
    updateExRate(5);
    updateBoostTimer();
    const interval = setInterval(() => {
        const timerText = getRemainingBoostTime();
        if (timerText === "") {
            hideBoostMessage();
        } else {
            showBoostMessage(timerText);
        }
    });
    showBoostMessage(getRemainingBoostTime());
    setTimeout(() => {
        clearInterval(interval);
        hideBoostMessage();
        updateExRate(1);
    }, 1800000);
    // }, 10000);
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
                activity.callback();
                showMessage(0);
                // console.log(showMessage);
                // return 0;
            } else {
                showMessage(1);
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
        setTimeout(() => {
            purchaseMessage.style.display = "none";
        }, 2000);
    }

}



export function computeTargetTime() {
    const now = new Date();
    const targetTime = new Date(now.getTime() + 60 * 1000);
    return targetTime;
}


export function updateTimer(targetTime: Date, index: number, button: HTMLButtonElement) {
    const now = new Date();
    const remainingTime = new Date(targetTime).getTime() - now.getTime();

    const timer = document.getElementsByClassName('store-element-timer')[index] as HTMLElement;
    if (timer) {
        if (remainingTime <= 0) {
            timer.innerText = "Available!";
            // clearInterval(timerInterval);
            button.disabled = false;
            return;
        }
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');
    
        timer.innerText = `⏱️${hours}:${paddedMinutes}:${paddedSeconds}`;
    }

}

