export function getRandomCommentWhenLevelUp(level: number, userID: string, name: string) {
    getMessageFromAI("level-up", userID, level, "", 0, "", name);
}

export function getRandomCommentWhenLowHealth(userID: string, name: string) {
    getMessageFromAI("low-health", userID, 0, "", 0, "", name);
}

export function getRandomCommentWhenCompilationError(code: string, userID: string, err: string, name: string) {
    getMessageFromAI("compilation-error", userID, 0, code, 0, err, name);
}

export function getRandomCommentWhenCompilationSuccess(code: string, userID: string, name: string) {
    getMessageFromAI("compilation-success", userID, 0, code, 0, "", name);
}

export function getRandomCommentWhenHealthDecrease(diff: number, userID: string, name: string) {
    getMessageFromAI("health-decrease", userID, 0, "", 0, "", name);
}

export function getRandomCommentWhenSessionStarted(diff: number, userID: string, name: string) {
    getMessageFromAI("boot-up", userID, 0, "", 0, "", name);
}


function getMessageFromAI(type: string, userID: string, level: number, code: string, diff: number, inputValue: string, name: string) {
    const data = {
        time: "",
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
    var event = new MessageEvent('message', {
        data: { command: 'post-chat',
            request: data
         } // You can pass any data you want here
    });
    window.dispatchEvent(event);
}