export async function getRandomCommentWhenLevelUp(level: number, userID: string, name: string) {
    const levelUpMessages = [
        `I did it! I'm level ${level} now! 🎉`,
        `Look at me! I've leveled up! 🌟`,
        `I'm getting stronger! Level ${level}, here I am! 💪`,
        `Woohoo! Level up achieved! 🚀`,
        `I'm on fire! Just reached level ${level}! 🔥`,
        `Check it out! I'm now a level higher! 👀`,
        `Yes! I just leveled up to level ${level}! 🙌`,
        `I'm growing! Leveled up to ${level}! 🌱`,
        `Feeling powerful at level ${level}! ⚡`,
        `Level up! I'm now level ${level}! 🎯`
    ];
    const randomMessage = levelUpMessages[Math.floor(Math.random() * levelUpMessages.length)];
    const aiMessage = await getMessageFromAI("level-up", userID, level, "", 0, "", name);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}

export async function getRandomCommentWhenLowHealth(userID: string, name: string) {
    const lowHealthMessages = [
        `Oh no! My health is too low to level up. 😢`,
        `I need to recover first. My health is too low. 🛌`,
        `I can't level up right now. My health needs attention. 🚑`,
        `Help! My health is too low to advance. 💔`,
        `I need to rest. My health is too low for a level up. 😴`,
        `I’m feeling weak. Can’t level up with low health. 😞`,
        `My health is too low to level up. I need some care. ❤️‍🩹`,
        `I can't go any further with my health this low. 🚫`,
        `My health is not enough to level up. Need a boost! 💊`,
        `Too weak to level up. Need to regain health. 💉`
    ];
    const randomMessage = lowHealthMessages[Math.floor(Math.random() * lowHealthMessages.length)];
    const aiMessage = await getMessageFromAI("low-health", userID, 0, "", 0, "", name);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}

export async function getRandomCommentWhenCompilationError(code: string, userID: string, name: string) {
    const encouragementMessages = [
        `Don't worry, we can fix this! 🛠️`,
        `Errors are steps to success! 🚀`,
        `You’ve got this! 💪`,
        `Stay positive! 😊`,
        `Every error is a lesson! 🌟`,
        `Keep calm and debug on! 🐞`,
        `Mistakes mean you’re trying! 💻`,
        `You can do this! 🙌`,
        `Every fix is a victory! ⚡`,
        `You’re doing great! 🌱`,
    ];
    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    const aiMessage = await getMessageFromAI("compilation-error", userID, 0, code, 0, "", name);
    console.log(prompt);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}

export async function getRandomCommentWhenCompilationSuccess(code: string, userID: string, name: string) {
    const encouragementMessages = [
        `Great job! 🎉`,
        `You did it! 🚀`,
        `Success! 🌟`,
        `Well done! 💪`,
        `Awesome work! 😊`,
        `Compilation complete! 🛠️`,
        `Fantastic! 🙌`,
        `You nailed it! ⚡`,
        `Excellent job! 🌱`,
        `Way to go! 🎯`
    ];
    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    const aiMessage = await getMessageFromAI("compilation-success", userID, 0, code, 0, "", name);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}

export async function getRandomCommentWhenHealthDecrease(diff: number, userID: string, name: string) {
    const encouragementMessages = [
        `It's been a while! Let's take a short break and then get back to coding together! ⏳`,
        `I need your help! Let's work on some code together! 🐾`,
        `A quick walk can refresh your mind. Are you ready to continue? 🚶‍♂️`,
        `Don't give up now! I believe in you! 💖`,
        `Remember why we started. Let's get back to coding! 🔄`,
        `I'm feeling a bit down. Some coding time will cheer me up! 🐾`,
        `A little progress each day adds up to big results. Keep going! 📈`,
        `Coding break over? Let's get back to it! 💻`,
        `I miss you! How about starting a new project together? 🧩`,
        `Just 5 more minutes of coding can make a big difference! ⏰`
    ];
      
    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    const aiMessage = await getMessageFromAI("health-decrease", userID, 0, "", 0, "", name);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}

export async function getRandomCommentWhenSessionStarted(diff: number, userID: string, name: string) {
    const bootMessages = [
        `I missed you so much! Ready to get back to coding together? 🐾`,
        `Welcome back! I've been waiting eagerly for you! Let's code! 🖥️`,
        `Hello again! I missed you! Time to create some awesome code! 💻`,
        `I'm so happy to see you! Let's make today a great coding day! 🌟`,
        `Welcome back! I've been lonely without you. Let's get coding! 🎉`,
        `Hello! I missed your coding magic! Ready to amaze me again? ✨`,
        `I'm thrilled to see you! I've missed you so much! Let's code! 🐾`,
        `Welcome back! I've been eagerly awaiting your return! 🚀`,
        `I'm excited to see you! I missed your company! Let's dive into code! 💪`,
        `Hello! I've been counting the minutes until your return! Time to code! 💻`
    ];
    
    const randomMessage = bootMessages[Math.floor(Math.random() * bootMessages.length)];
    const aiMessage = await getMessageFromAI("boot-up", userID, 0, "", 0, "", name);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}


async function getMessageFromAI(type: string, userID: string, level: number, code: string, diff: number, inputValue: string, name: string) {
    const data = {
        type: type,
        userID: userID,
        params: {
            level: level,
            code: code,
            diff: diff,
            inputValue: inputValue,
            name: name,
        }
    };
    let aiText = "";
    try {
        const response = await fetch('http://localhost:3000/post-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        const resText = JSON.stringify(responseData);
        if (!response.ok) {
            throw new Error('Failed to fetch AI response: ' + resText);
        }
        aiText = responseData.answer;
    } catch (error) {
        // for debug purpose
        aiText = "";
        console.error('Error fetching response from Gemini: ', error);
    }
    console.log(aiText);
    return aiText;
}