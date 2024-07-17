import * as fs from 'fs';
import * as path from 'path';

type ChatRequest =  {
    time: string,
    type: string,
    userID: string,
    params: {
        level: number,
        code: string,
        diff: number,
        inputValue: string,
        name: string,
    }
};

const chatHistoryPath = path.resolve(path.dirname(__dirname), "data", 'chatHistory.json');

export async function postChat(req: ChatRequest) {
    const sentTime = req.time;
    const type = req.type;
    const userID = req.userID;
    const level = req.params.level;
    const code = req.params.code;
    const diff = req.params.diff;
    const inputValue = req.params.inputValue;
    const name = req.params.name;
    const errorMessage = req.params.inputValue;
    const memory = formulateChatHistory(userID);
    let prompt = "";
    let aiText = "";
    console.log(`Receiving request from ${userID} with type ${type}.`);

    // handle different types of prompt:
    if (type === "user-input") {
        storeChatMessage(userID, "Student", inputValue + '\n', sentTime);
        prompt = `You are a virtual pet dog named ${name} for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response short. `;
        if (code) {
            prompt += `Here is the student's code: ${code} The student may ask you about the code, but please do not provide solutions directly. Please give indirect hints, such as where to look for the bugs. `;
        }
        prompt += `You have been talking about this: ${memory}`;
        prompt += "Please directly response to the message without including any other words. ";
        prompt += "Now please reply to this message: " + inputValue;
    } else if (type === "level-up") {
        prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words. ";
        prompt += `You have been talking about this: ${memory}`;
        prompt += "Please directly response to the message without including any other words. ";
        prompt += `You have just gotten a level up, and your current level is ${level}. Please give the student some encouragement.`;

    } else if (type === "compilation-error") {
        prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words. ";
        prompt += `The student just had a compilation error. Please give the student some positive feedback.`;
        prompt += `You have been talking about this: ${memory}`;
        prompt += "Please directly response to the message without including any other words. ";
        prompt += `Here is the student's code: ${code} This is the error message that the student gets: ${errorMessage} Please translate the error message into a novice-readable plain English.`;    
    
    } else if (type === "compilation-success") {
        prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words. ";
        prompt += `The student just succeeded in compiling his code. Please give the student some positive feedback.`;
        prompt += `You have been talking about this: ${memory}`;
        prompt += "Please directly response to the message without including any other words. ";
        prompt += `Here is the student's code: ${code} The student may ask you about the code, but please do not provide solutions directly. Please give indirect hints, such as where to improve. `;
    
    } else if (type === "health-decrease") {
        prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words. ";
        prompt += `You have been talking about this: ${memory}`;
        prompt += "Please directly response to the message without including any other words. ";
        prompt += `Your health decreased by ${diff} just now, which means the student has been idle for ${45 * diff} mins. Please give the student a friendly reminder and encourage him to keep up. `;    
    
    } else if (type === "boot-up") {
        prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words.";
        prompt += `You have been talking about this: ${memory}`;
        prompt += "Please directly response to the message without including any other words. ";
        prompt += `Your student just opened the pet program, and your health decreased by ${diff}, which means the student has not come back for ${45 * diff} minutes. Please give me a warm welcome, and state that you miss the student.`;
    
    } else if (type === "low-health") {
        prompt = "You are a virtual pet for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response within 20 words. ";
        prompt += `You have been talking about this: ${memory}`;
        prompt += "Please directly response to the message without including any other words. ";
        prompt += `You are about to level up, but your health level is too low (below 10%) which prevents your level up. Please give the student some encouragement.`;
    
    } else {
        console.log("Not able to find the type: ",  type);
    }

    console.log("Formulated prompt: ", prompt);
    
    
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

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAITOZJop5iC4bUtBb6Ed1oa87Bjf16ObM', {
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
    
    // const response = await query({"question": prompt});
    // console.log(response);
    // aiText = response.text;
    let returnText = "";

    // Store the chat message
    if (type === "level-up") {
        returnText = "(Level Up) " + aiText;
    } else if (type === "compilation-error") {
        returnText = "(Compilation Failed) " + aiText;
    } else if (type === "compilation-success") {
        returnText = "(Compilation Succeeded) " + aiText;
    } else if (type === "health-decrease") {
        returnText = "(Health Decreased) " + aiText;
    } else if (type === "boot-up") {
        returnText = "(Booted Up) " + aiText;
    } else if (type === "low-health") {
        returnText = "(Low Health Value) " + aiText;
    } else {
        returnText = aiText;
    }
    const time = getCurrentTime();
    storeChatMessage(userID, "Pet", returnText, time);

    console.log("Got response from Gemini: ", returnText);

    const res = { role: "Pet", message: returnText, time: time };
    return JSON.stringify(res);
}


// async function query(data) {
//     const response = await fetch(
//         "http://localhost:3000/api/v1/prediction/5c7f14b7-a333-4a9c-b174-c6b0153ac601",
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(data)
//         }
//     );
//     const result = await response.json();
//     return result;
// }


// Handling chat memories

// Load the chat history from the file
function loadChatHistories() {
    if (fs.existsSync(chatHistoryPath)) {
        const data = fs.readFileSync(chatHistoryPath, 'utf8');
        return JSON.parse(data);
    }
    return { chatHistories: {} };
}

// Save chat histories to file
function saveChatHistories(chatHistories: Object) {
    fs.writeFileSync(chatHistoryPath, JSON.stringify(chatHistories, null, 2), 'utf8');
}

// Get chat history for a given user ID
export function fetchChatHistory(userID: string) {
    const data = loadChatHistories();
    console.log(data.chatHistories[userID]);
    return data.chatHistories[userID] || [];
}

// Store a chat message
function storeChatMessage(userID: string, role: string, message: string, time: string) {
    const data = loadChatHistories();
    if (!data.chatHistories[userID]) {
        data.chatHistories[userID] = [];
    }
    data.chatHistories[userID].push({ role, message, time });
    saveChatHistories(data);
}

export function createChatHistoryEntry(userID: string) {
    const data = loadChatHistories();
    if (!data.chatHistories[userID]) {
        data.chatHistories[userID] = [];
    }
    saveChatHistories(data);
}

function formulateChatHistory(userID: string) {
    let historyString = "";
    const chatHistories = fetchChatHistory(userID);
    for (let i = 0; i < chatHistories.length; i++) {
        historyString += chatHistories[i].role;
        historyString += ": ";
        historyString += chatHistories[i].message;
    }
    return historyString;
}

function getCurrentTime() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedTime = `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;

    return formattedTime;
}