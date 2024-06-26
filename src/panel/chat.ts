// import * as dotenv from '../node_modules/dotenv/lib/main';
// dotenv.config();

// Handle the UI
let currentName: string;
let currentPetType: string;
const chatHistory: Array<Array<string>> = [];

export function showChatbox(name: string, petType: string) {
    currentName = name;
    currentPetType = petType;
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


// Send the chat msg

document.getElementById('send-button')?.addEventListener('click', async () => {
    const userInput = document.getElementById('message-input') as HTMLInputElement;
    const inputValue = userInput.value;
    if (inputValue.trim() === '') {
        return;
    }
    const memory = getMemory();
    // console.log(memory);
    let context = `You are a virtual pet ${currentPetType} named ${currentName} for students to learn programming. You should talk in a cute way and give the student emotional support and encouragement. Please keep your response short. `;
    if (memory.length !== 0) {
        context +=  `You have been talking about these: ${memory}`;
    }
    displayMessage('You', inputValue);
    storeMessage('You', inputValue);
    const inputField = document.getElementById('message-input') as HTMLInputElement;
    inputField.value = '';
    context += "Now please reply to this message: " + inputValue;
    const data = {
        contents: [{
                role: "user",
                parts: [
                    {
                        text: context
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150
        }


    };
    console.log("Prompt: " + context);


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
            throw new Error('Failed to fetch AI response' + resText);
        }
        const aiText = responseData.candidates[0].content.parts[0].text;
        displayMessage(currentName, aiText);
        storeMessage(currentName, aiText);
    } catch (error) {
        console.error('Error fetching response from Gemini: ', error);
        const errText = 'Sorry, there was an error processing your request.';
        displayMessage(currentName, errText);
        storeMessage(currentName, errText);
    }

    
});


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


function getMemory() {
    return chatHistory.map(item => `${item[0]}: ${item[1]}`).join("    ");
}