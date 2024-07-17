const fs = require('fs');
const path = require('path');

const dir = path.join(path.dirname(__dirname), "out", "data");
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(path.join(dir, "level.json"))) {
    console.log("writing level.json");
    fs.writeFileSync(path.join(dir, "level.json"), "1");
} else {
    console.log("level.json exists");
}

if (!fs.existsSync(path.join(dir, "timer.json"))) {
    console.log("writing timer.json");
    fs.writeFileSync(path.join(dir, "timer.json"), "{}");
} else {
    console.log("timer.json exists");
}

if (!fs.existsSync(path.join(dir, "storyLine.json"))) {
    console.log("writing storyLine.json");
    fs.writeFileSync(path.join(dir, "storyLine.json"), `[
        {
            "next_target": "100",
            "ex_per_line": "1",
            "health_drop_time": "45",
            "health_increase_time": "15"
        },{
            "next_target": "200",
            "ex_per_line": "1",
            "health_drop_time": "45",
            "health_increase_time": "15"
        },{
            "next_target":"300",
            "ex_per_line":"1",
            "health_drop_time":"45",
            "health_increase_time":"15"
        }]`);
} else {
    console.log("storyLine.json exists");
}

if (!fs.existsSync(path.join(dir, "compilationCommand.json"))) {
    console.log("writing compilationCommand.json");
    fs.writeFileSync(path.join(dir, "compilationCommand.json"), "");
} else {
    console.log("compilationCommand.json exists");
}

if (!fs.existsSync(path.join(dir, "chatHistory.json"))) {
    console.log("writing chatHistory.json");
    fs.writeFileSync(path.join(dir, "chatHistory.json"), `{
        "chatHistories": {}
    }`);
} else {
    console.log("chatHistory.json exists");
}