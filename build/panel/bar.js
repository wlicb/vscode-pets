"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideBar = exports.showBar = void 0;
function showBar(name, level, experience, target, health) {
    // Do data sanity check
    if (level < 1) {
        console.log("Illegal level value.");
    }
    else if (experience > target || experience < 0) {
        console.log("Illegal experience value.");
    }
    else if (health > 100 || health < 0) {
        console.log("Illegal health value.");
    }
    const sc = document.getElementById("status-container");
    const nameText = document.getElementById("name");
    const levelText = document.getElementById("level");
    const healthText = document.getElementById("health-value");
    const experienceText = document.getElementById("experience-value");
    if (sc === null || nameText === null || levelText === null || healthText === null || experienceText === null) {
        console.log("Incorrect HTML structure.");
    }
    else {
        nameText.innerHTML = name;
        levelText.innerHTML = "Level " + level;
        healthText.innerHTML = health + "/100";
        experienceText.innerHTML = experience + "/" + target;
        adjustExperienceBar(experience, target);
        adjustHealthBar(health);
        sc.style.display = "block";
    }
}
exports.showBar = showBar;
function hideBar() {
    const sc = document.getElementById("status-container");
    if (sc === null) {
        console.log("No status container found");
    }
    else {
        sc.style.display = "none";
    }
}
exports.hideBar = hideBar;
function adjustHealthBar(value) {
    const bar = document.getElementById("health-bar");
    if (bar === null) {
        console.log("Incorrect HTML structure");
    }
    else {
        const barWidth = value;
        bar.style.width = barWidth + "%";
        console.log(barWidth);
    }
}
function adjustExperienceBar(value, target) {
    const bar = document.getElementById("experience-bar");
    if (bar === null) {
        console.log("Incorrect HTML structure");
    }
    else {
        const barWidth = value / target * 100;
        bar.style.width = barWidth + "%";
        console.log(barWidth);
    }
}
//# sourceMappingURL=bar.js.map