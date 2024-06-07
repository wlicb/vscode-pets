export async function getRandomCommentWhenLevelUp(level: number) {
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
    let prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words.";
    prompt += `You have just gotten a level up, and your current level is ${level}. Please give the student some encouragement.`;
    const randomMessage = levelUpMessages[Math.floor(Math.random() * levelUpMessages.length)];
    const aiMessage = await getMessageFromAI(prompt);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}

export async function getRandomCommentWhenLowHealth() {
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
    let prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words.";
    prompt += `You are about to level up, but your health level is too low (below 10%) which prevents your level up. Please give the student some encouragement.`;
    const randomMessage = lowHealthMessages[Math.floor(Math.random() * lowHealthMessages.length)];
    const aiMessage = await getMessageFromAI(prompt);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}

export async function getRandomCommentWhenCompilationError(code: string) {
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
    let prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words.";
    prompt += `The student just had a compilation error. Please give the student some positive feedback.`;
    prompt += `Here is the student's code: ${code} The student may ask you about the code, but please do not provide solutions directly. Please give indirect hints, such as where to look for the bugs.`;
    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    const aiMessage = await getMessageFromAI(prompt);
    console.log(prompt);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}

export async function getRandomCommentWhenCompilationSuccess(code: string) {
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
    let prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words.";
    prompt += `The student just succeeded in compiling his code. Please give the student some positive feedback.`;
    prompt += `Here is the student's code: ${code} The student may ask you about the code, but please do not provide solutions directly. Please give indirect hints, such as where to improve.`;
    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    const aiMessage = await getMessageFromAI(prompt);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}

export async function getRandomCommentWhenHealthDecrease(diff: number) {
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
      
    let prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words.";
    prompt += `Your health decreased by ${diff} just now, which means the student has been idle for ${45 * diff} mins. Please give the student a friendly reminder and encourage him to keep up.`;
    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    const aiMessage = await getMessageFromAI(prompt);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}

export async function getRandomCommentWhenSessionStarted(diff: number) {
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
    
    let prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words.";
    prompt += `Your student just opened the pet program, and your health decreased by ${diff}, which means the student has not come back for ${45 * diff} minutes. Please give me a warm welcome, and state that you miss the student.`;
    const randomMessage = bootMessages[Math.floor(Math.random() * bootMessages.length)];
    const aiMessage = await getMessageFromAI(prompt);
    if (aiMessage === "") {
        return randomMessage;
    } else {
        return aiMessage;
    }
}


async function getMessageFromAI(prompt: string) {
    const data = {
        contents: [{
                role: "user",
                parts: [
                    {
                        text: prompt
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150
        }


    };
    let aiText = "";
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=', {
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
        aiText = responseData.candidates[0].content.parts[0].text;
    } catch (error) {
        // for debug purpose
        aiText = "";
        console.error('Error fetching response from Gemini: ', error);
    }
    console.log(aiText);
    return aiText;
}