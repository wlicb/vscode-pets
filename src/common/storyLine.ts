import * as fs from 'fs';
import * as path from 'path';


const filePath = path.resolve(__dirname, 'storyLine.json');

const levelFilePath = path.resolve(__dirname, 'level.json');

export function storeStoryLine(jsonFile: string) {
    fs.writeFileSync(filePath, jsonFile);
    console.log(jsonFile);

}

export function getNextTarget(level: number) {
    if (!fs.existsSync(filePath)) {
        return -1;
    } else {
        const storyLine = fs.readFileSync(filePath, 'utf8');
        const storyLineObject = JSON.parse(storyLine);
        return parseInt(storyLineObject[level-1].next_target);
    }
}

export function getExPerLine(level: number) {
    if (!fs.existsSync(filePath)) {
        return -1;
    } else {
        const storyLine = fs.readFileSync(filePath, 'utf8');
        const storyLineObject = JSON.parse(storyLine);
        return parseInt(storyLineObject[level-1].ex_per_line);
    }
}

export function getHealthDropTime(level: number) {
    if (!fs.existsSync(filePath)) {
        return -1;
    } else {
        const storyLine = fs.readFileSync(filePath, 'utf8');
        const storyLineObject = JSON.parse(storyLine);
        return parseInt(storyLineObject[level-1].health_drop_time);
    }
}

export function getHealthIncreaseTime(level: number) {
    if (!fs.existsSync(filePath)) {
        return -1;
    } else {
        const storyLine = fs.readFileSync(filePath, 'utf8');
        const storyLineObject = JSON.parse(storyLine);
        return parseInt(storyLineObject[level-1].health_increase_time);
    }
}

export function storeLevel(level: number) {
    fs.writeFileSync(levelFilePath, level.toString());
    console.log(level);
}

export function getLevel() {
    if (!fs.existsSync(levelFilePath)) {
        return 1;
    } else {
        const level = fs.readFileSync(levelFilePath, 'utf8');
        return parseInt(level);
    }
}