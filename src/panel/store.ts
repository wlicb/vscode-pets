import { updateCoin, allPets, getCoin, getUserID, updateExRate } from "./main";

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

}

function boost() {
    updateExRate(5);
    setTimeout(() => {
        updateExRate(1);
    }, 1800000);
    // }, 10000);
}

function purchase(index: number): number {
    activityList.forEach(activity => {
        if (index === activity.index) {
            if (getCoin() >= activity.price) {
                updateCoin(-activity.price);
                activity.callback();
                showMessage(0);
                return 0;
            } else {
                showMessage(1);
                return 1;
            }
        }
    });
    return -1;
}

export function showStore() {
    const store = document.getElementById("store");
    if (store) {
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
        } else {
            purchaseMessage.innerHTML = "❗ Opps, You do not have enough coins. Code to earn coins! 💪";
        }
        purchaseMessage.style.display = "block";
        setTimeout(() => {
            purchaseMessage.style.display = "none";
        }, 2000);
    }

}

// Add event listeners to the buttons
document.querySelectorAll('.store-buttons').forEach(button => {
    button.addEventListener('click', () => {
        const index = (button as HTMLElement).dataset.index;
        if (index !== undefined) {
            purchase(Number(index));
            (button as HTMLButtonElement).disabled = true;
            setTimeout(() => {
                (button as HTMLButtonElement).disabled = false;
            // }, 3600000);
            }, 5000);
        }
    });
});