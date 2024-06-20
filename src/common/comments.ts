export async function getRandomCommentWhenLevelUp(level: number, userID: string, name: string) {
    const { aiText, currentTime } = await getMessageFromAI("level-up", userID, level, "", 0, "", name);
    return { aiText, currentTime };
}

export async function getRandomCommentWhenLowHealth(userID: string, name: string) {
    const { aiText, currentTime } = await getMessageFromAI("low-health", userID, 0, "", 0, "", name);
    return { aiText, currentTime };
}

export async function getRandomCommentWhenCompilationError(code: string, userID: string, err: string, name: string) {
    const { aiText, currentTime } = await getMessageFromAI("compilation-error", userID, 0, code, 0, err, name);
    return { aiText, currentTime };
}

export async function getRandomCommentWhenCompilationSuccess(code: string, userID: string, name: string) {
    const { aiText, currentTime } = await getMessageFromAI("compilation-success", userID, 0, code, 0, "", name);
    return { aiText, currentTime };
}

export async function getRandomCommentWhenHealthDecrease(diff: number, userID: string, name: string) {
    const { aiText, currentTime } = await getMessageFromAI("health-decrease", userID, 0, "", 0, "", name);
    return { aiText, currentTime };
}

export async function getRandomCommentWhenSessionStarted(diff: number, userID: string, name: string) {
    const { aiText, currentTime } = await getMessageFromAI("boot-up", userID, 0, "", 0, "", name);
    return { aiText, currentTime };
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
    let currentTime = "";
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
        aiText = responseData.message;
        currentTime = responseData.time;
    } catch (error) {
        // for debug purpose
        aiText = "";
        console.error('Error fetching response from Gemini: ', error);
    }
    console.log(aiText, currentTime);
    return { aiText, currentTime };
}