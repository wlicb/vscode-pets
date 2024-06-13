// import * as dotenv from '../node_modules/dotenv/lib/main';
// dotenv.config();
import { getCodeFromEditor} from "./main";


// Handle the UI
let currentName: string;

interface ChatMessage {
    role: 'Student' | 'Pet';
    message: string;
    time: string;
}

let chatHistory: ChatMessage[] = [];


export async function showChatbox(name: string, userID: string) {
    currentName = name;
    const chatbox = document.getElementById("chatbox");
    if (chatbox) {
        chatbox.style.display = "block";
        const chatboxTitle = document.getElementById("chatbox-title");
        if (chatboxTitle) {
            chatboxTitle.innerHTML = "Chat with " + name + "!";
        }
        const chatboxMessages = document.getElementById("chatbox-messages");
        if (chatboxMessages) {
            while (chatboxMessages.firstChild) {
                chatboxMessages.removeChild(chatboxMessages.firstChild);
            }
        }
        chatHistory = await getChatHistory(userID);
        chatHistory.forEach(sentence => {
            if (sentence.role === "Student") {
                displayMessage("You", sentence.message, sentence.time);
            } else {
                displayMessage(currentName, sentence.message, sentence.time);
            }
        });
    }

}

export function hideChatbox() {
    const chatbox = document.getElementById("chatbox");
    if (chatbox) {
        chatbox.style.display = "none";
    }
}


export function checkChatboxVisiblityAndName(name: string) {
    const chatbox = document.getElementById("chatbox");
    if (chatbox === null) {
        return -1;
    } else if (chatbox.style.display === "none") {
        return 0;
    } else if (currentName !== name) {
        return -1;
    } else {
        return 1;
    }
}



export function sendMsg(userID: string) {
    console.log(userID);
    const currentTime = getCurrentTime();
    const userInput = document.getElementById('message-input') as HTMLInputElement;
    const inputValue = userInput.value;
    displayMessage('You', inputValue, currentTime);
    storeMessage('You', inputValue, currentTime);
    const inputField = document.getElementById('message-input') as HTMLInputElement;
    inputField.value = '';
    if (inputValue.trim() === '') {
        return;
    }
    getEditorText().then(event => {
        const e = event as CustomEvent;
        console.log(e);
        void fetchResponse(currentTime, userID, 0, e.detail.code, 0, inputValue, currentName);
    }).catch(err => {
        console.log(err);
        void fetchResponse(currentTime, userID, 0, "", 0, inputValue, currentName);
    });
    
}


async function fetchResponse(time: string, userID: string, level: number, code: string, diff: number, inputValue: string, name: string) {
    const data = {
        time: time,
        type: "user-input",
        userID: userID,
        params: {
            level: level,
            code: code,
            diff: diff,
            inputValue: inputValue,
            name: name,
        }
    };
    
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
        const aiText = responseData.message;
        const time = responseData.time;
        displayMessage(currentName, aiText, time);
        storeMessage(currentName, aiText, time);
    } catch (error) {
        console.error('Error fetching response from Gemini: ', error);
        // displayMessage(currentName, errText);
        // storeMessage(currentName, errText);
    }
}


export function displayMessage(senderOp: string, message: string, time: string) {
    let sender: string;
    if (senderOp === "") {
        sender = currentName;
    } else {
        sender = senderOp;
    }
    const chatbox = document.getElementById('chatbox');
    // console.log(chatbox);
    if (chatbox && window.getComputedStyle(chatbox).display !== "none") {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');
        
        const messageSender = document.createElement('div');
        messageSender.classList.add('message-sender');
        messageSender.textContent = sender + "  " + time;
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageContainer.appendChild(messageSender);
        messageContainer.appendChild(messageContent);
        
        document.getElementById('chatbox-messages')?.appendChild(messageContainer);
        messageContainer.scrollIntoView({ behavior: 'smooth' });
    //     setBadge(1);
    // }
    } else {
        setBadge(1);
    }

}

export function storeMessage(sender: string, message: string, currentTime: string) {
    if (sender === "You") {
        chatHistory.push({role: 'Student', message: message, time: currentTime});
    } else {
        chatHistory.push({role: 'Pet', message: message, time: currentTime});
    }
}

export function setBadge(val: number) {
    console.log("Setting badge: ", val);
    const chatbox = document.getElementById("chatbox");
    if (chatbox && window.getComputedStyle(chatbox).display !== "none") {
        const badge = document.getElementById("notification-badge");
        if (badge) {
            badge.innerHTML = "0";
            badge.style.display = "none";
            console.log("Hiding badge");
        }
    } else {
        const badge = document.getElementById("notification-badge");
        if (badge) {
            if (val > 0) {
                const preVal = badge.innerHTML ? parseInt(badge.innerHTML) : 0;
                badge.innerHTML = (preVal + val).toString();
                badge.style.display = "flex";
                console.log("Showing badge");
            } else {
                badge.innerHTML = "0";
                badge.style.display = "none";
                console.log("Hiding badge");
            }
        }
    }
}


async function getEditorText() {
    const event = await getCodeFromEditor();
    return event;
}

async function getChatHistory(userID: string) {
    let chatHistory = [];
    const data = {
        userID: userID,
    };
    try {
        const response = await fetch('http://localhost:3000/get-chat-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        const resText = JSON.stringify(responseData);
        if (!response.ok) {
            throw new Error('Failed to fetch Chat History: ' + resText);
        }
        chatHistory = responseData;
    } catch (error) {
        console.error('Error fetching chat history: ', error);
    }
    return chatHistory;
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