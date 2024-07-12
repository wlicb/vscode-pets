import { updateCoin, allPets, getCoin, getUserID } from "./main";

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
        void petEm.pet.setHealth(petEm.pet.getHealth() + 1, false, getUserID());
    });
}

function feed() {
    allPets.pets.forEach((petEm) => {
        void petEm.pet.setHealth(petEm.pet.getHealth() + 5, false, getUserID());
    });
}

function play() {

}

function boost() {

}

export function purchase(index: number): number {
    activityList.forEach(activity => {
        if (index === activity.index) {
            if (getCoin() >= activity.price) {
                updateCoin(getCoin() - activity.price);
                activity.callback();
                return 0;
            } else {
                return 1;
            }
        }
    });
    return -1;
}
