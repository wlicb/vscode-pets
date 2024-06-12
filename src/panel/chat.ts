// import * as dotenv from '../node_modules/dotenv/lib/main';
// dotenv.config();
import { getCodeFromEditor } from "./main";


// Handle the UI
let currentName: string;
const chatHistory: Array<Array<string>> = [];

export function showChatbox(name: string) {
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
        chatHistory.forEach(sentence => {
            if (sentence[0] === "user") {
                displayMessage("You", sentence[1]);
            } else {
                displayMessage(currentName, sentence[1]);
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
    const userInput = document.getElementById('message-input') as HTMLInputElement;
    const inputValue = userInput.value;
    displayMessage('You', inputValue);
    storeMessage('You', inputValue);
    const inputField = document.getElementById('message-input') as HTMLInputElement;
    inputField.value = '';
    if (inputValue.trim() === '') {
        return;
    }
    getEditorText().then(event => {
        const e = event as CustomEvent;
        console.log(e);
        void fetchResponse("chat", userID, 0, e.detail.code, 0, inputValue, currentName);
    }).catch(err => {
        console.log(err);
        void fetchResponse("chat", userID, 0, "", 0, inputValue, currentName);
    });
    
}


async function fetchResponse(type: string, userID: string, level: number, code: string, diff: number, inputValue: string, name: string) {
    const data = {
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
        const aiText = responseData.answer;
        displayMessage(currentName, aiText);
        storeMessage(currentName, aiText);
    } catch (error) {
        console.error('Error fetching response from Gemini: ', error);
        const errText = 'Sorry, there was an error processing your request.';
        displayMessage(currentName, errText);
        storeMessage(currentName, errText);
    }
}


export function displayMessage(senderOp: string, message: string) {
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
        messageSender.textContent = sender;
        
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

export function storeMessage(sender: string, message: string) {
    if (sender === "You") {
        chatHistory.push(["user", message]);
    } else {
        chatHistory.push(["model", message]);
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