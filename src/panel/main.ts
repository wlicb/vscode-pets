// This script will be run within the webview itself
import { randomName } from '../common/names';
import {
    PetSize,
    PetColor,
    PetType,
    Theme,
    ColorThemeKind,
    WebviewMessage,
} from '../common/types';
import { IPetType } from './states';
import {
    createPet,
    PetCollection,
    PetElement,
    IPetCollection,
    availableColors,
    InvalidPetException,
} from './pets';
import { BallState, PetElementState, PetPanelState } from './states';
import { showBar, hideBar, updateBar } from './bar';
import { hideChatbox, showChatbox, displayMessage, storeMessage, setBadge } from './chat';
// import { computeTimeDifference } from '../common/healthTimer';

/* This is how the VS Code API can be invoked from the panel */
declare global {
    interface VscodeStateApi {
        getState(): PetPanelState | undefined; // API is actually Any, but we want it to be typed.
        setState(state: PetPanelState): void;
        postMessage(message: WebviewMessage): void;
    }
    function acquireVsCodeApi(): VscodeStateApi;
}

const UPDATE_HEALTH_THRES = 45;

export var allPets: IPetCollection = new PetCollection();
var petCounter: number;
var currentTimer: Date;

function calculateBallRadius(size: PetSize): number {
    if (size === PetSize.nano) {
        return 2;
    } else if (size === PetSize.small) {
        return 3;
    } else if (size === PetSize.medium) {
        return 4;
    } else if (size === PetSize.large) {
        return 8;
    } else {
        return 1; // Shrug
    }
}

function calculateFloor(size: PetSize, theme: Theme): number {
    switch (theme) {
        case Theme.forest:
            switch (size) {
                case PetSize.small:
                    return 30;
                case PetSize.medium:
                    return 40;
                case PetSize.large:
                    return 65;
                case PetSize.nano:
                default:
                    return 23;
            }
        case Theme.castle:
            switch (size) {
                case PetSize.small:
                    return 60;
                case PetSize.medium:
                    return 80;
                case PetSize.large:
                    return 120;
                case PetSize.nano:
                default:
                    return 45;
            }
        case Theme.beach:
            switch (size) {
                case PetSize.small:
                    return 60;
                case PetSize.medium:
                    return 80;
                case PetSize.large:
                    return 120;
                case PetSize.nano:
                default:
                    return 45;
            }
    }
    return 0;
}

function handleMouseOver(e: MouseEvent) {
    var el = e.currentTarget as HTMLDivElement;
    allPets.pets.forEach((element) => {
        if (element.collision === el) {
            if (!element.pet.canSwipe) {
                return;
            }
            element.pet.swipe();
            //showBar(element.pet.name, element.getLevel(), element.getExperience(), element.getNextTarget(), element.getHealth());
        }
    });
}

function handleMouseLeave() {
    //hideBar();
}



function startAnimations(
    collision: HTMLDivElement,
    pet: IPetType,
    stateApi?: VscodeStateApi,
) {
    if (!stateApi) {
        stateApi = acquireVsCodeApi();
    }

    collision.addEventListener('mouseover', handleMouseOver);
    collision.addEventListener('mouseleave', handleMouseLeave);


    document.addEventListener('click', function(e) {
        // Check if the click is outside the pets' elements
        let clickedOutside = true;
    
        allPets.pets.forEach((element) => {
            if (element.collision === e.target) {
                clickedOutside = false;
            }
        });
    
        if (clickedOutside) {
            const compileButton = document.getElementById("compile-button");
            const chatButton = document.getElementById("chat-button");
            const chatbox = document.getElementById("chatbox");
            if (compileButton && chatButton) {
                // console.log(e.target);
                if (e.target === compileButton) {
                    stateApi?.postMessage({
                        text: "",
                        command: 'run-compile',
                    });
                } else if (e.target === chatButton) {
                    const nameEm = document.getElementById("name");
                    if (nameEm) {
                        showChatbox(nameEm.innerHTML, findPetType(nameEm.innerHTML));
                        setBadge(-1);
                    }
                } else {
                    const target = e.target as Node;
                    if (chatbox === null || !chatbox.contains(target)) {
                        hideChatbox();
                    }
                }
            } else {
                console.log("cannot find button");
            }
        }
    });

    setInterval(() => {
        var updates = allPets.seekNewFriends();
        updates.forEach((message) => {
            stateApi?.postMessage({
                text: message,
                command: 'info',
            });
        });
        pet.nextFrame();
        saveState(stateApi);
    }, 100);
}

// Find the pet type based on its name
function findPetType(name: string) {
    for (let i = 0; i < allPets.pets.length; i++) {
        if (allPets.pets[i].pet.name === name) {
            return allPets.pets[i].type;
        }
    }
    return "";
}

function addPetToPanel(
    petType: PetType,
    basePetUri: string,
    petColor: PetColor,
    petSize: PetSize,
    left: number,
    bottom: number,
    floor: number,
    name: string,
    experience: number,
    nextTarget: number,
    level: number,
    health: number,
    stateApi?: VscodeStateApi,
): PetElement {
    var petSpriteElement: HTMLImageElement = document.createElement('img');
    petSpriteElement.className = 'pet';
    (document.getElementById('petsContainer') as HTMLDivElement).appendChild(
        petSpriteElement,
    );

    var collisionElement: HTMLDivElement = document.createElement('div');
    collisionElement.className = 'collision';
    (document.getElementById('petsContainer') as HTMLDivElement).appendChild(
        collisionElement,
    );

    var speechBubbleElement: HTMLDivElement = document.createElement('div');
    speechBubbleElement.className = `bubble bubble-${petSize}`;
    speechBubbleElement.innerText = 'Hello!';
    (document.getElementById('petsContainer') as HTMLDivElement).appendChild(
        speechBubbleElement,
    );

    const root = basePetUri + '/' + petType + '/' + petColor;
    console.log('Creating new pet : ', petType, root, petColor, petSize, name);
    try {
        if (!availableColors(petType).includes(petColor)) {
            throw new InvalidPetException('Invalid color for pet type');
        }
        var newPet = createPet(
            petType,
            petSpriteElement,
            collisionElement,
            speechBubbleElement,
            petSize,
            left,
            bottom,
            root,
            floor,
            name,
            experience,
            nextTarget,
            level,
            health
        );
        petCounter++;
        startAnimations(collisionElement, newPet, stateApi);
    } catch (e: any) {
        // Remove elements
        petSpriteElement.remove();
        collisionElement.remove();
        speechBubbleElement.remove();
        throw e;
    }

    const petEm =  new PetElement(
        petSpriteElement,
        collisionElement,
        speechBubbleElement,
        newPet,
        petColor,
        petType
    );

    return petEm;
}

export function saveState(stateApi?: VscodeStateApi) {
    if (!stateApi) {
        stateApi = acquireVsCodeApi();
    }
    var state = new PetPanelState();
    state.petStates = new Array();


    allPets.pets.forEach((petItem) => {
        state.petStates?.push({
            petName: petItem.pet.name,
            petColor: petItem.color,
            petType: petItem.type,
            petState: petItem.pet.getState(),
            petFriend: petItem.pet.friend?.name ?? undefined,
            elLeft: petItem.el.style.left,
            elBottom: petItem.el.style.bottom,
            petExperience: petItem.pet.getExperience(),
            petNextTarget: petItem.pet.getNextTarget(),
            petLevel: petItem.pet.getLevel(),
            petHealth: petItem.pet.getHealth(),
        });
    });
    state.petCounter = petCounter;
    state.healthTimer = currentTimer;
    stateApi?.setState(state);
}

function recoverState(
    basePetUri: string,
    petSize: PetSize,
    floor: number,
    stateApi?: VscodeStateApi,
) {
    if (!stateApi) {
        stateApi = acquireVsCodeApi();
    }
    var state = stateApi?.getState();
    if (!state) {
        petCounter = 1;
    } else {
        if (state.petCounter === undefined || isNaN(state.petCounter)) {
            petCounter = 1;
        } else {
            petCounter = state.petCounter ?? 1;
        }
        if (state.healthTimer !== undefined) {
            currentTimer = new Date(state.healthTimer);
        } else {
            currentTimer = new Date();
        }
    }
    var recoveryMap: Map<IPetType, PetElementState> = new Map();
    state?.petStates?.forEach((p) => {
        // Fixes a bug related to duck animations
        if ((p.petType as string) === 'rubber duck') {
            (p.petType as string) = 'rubber-duck';
        }
        const now = new Date();
        console.log(typeof(currentTimer));
        const differenceInMilliseconds = now.getTime() - currentTimer.getTime();
        const diff = Math.floor(differenceInMilliseconds / (1000 * 60));
        const healthUpdateValue = -Math.floor(diff / UPDATE_HEALTH_THRES);
        console.log(healthUpdateValue);
        try {
            var newPet = addPetToPanel(
                p.petType ?? PetType.dog,
                basePetUri,
                p.petColor ?? PetColor.akita,
                petSize,
                parseInt(p.elLeft ?? '0'),
                parseInt(p.elBottom ?? '0'),
                floor,
                p.petName ?? randomName(p.petType ?? PetType.dog),
                p.petExperience, p.petNextTarget, p.petLevel, p.petHealth,
                stateApi,
            );
            newPet.pet.setHealth(newPet.pet.getHealth() + healthUpdateValue, true).then(msg => {
                if (msg !== "") {
                    displayMessage("", msg);
                    storeMessage("", msg);
                }
            }).catch(err => {
                console.log(err);
            });;
            allPets.push(newPet);
            recoveryMap.set(newPet.pet, p);
        } catch (InvalidPetException) {
            console.log(
                'State had invalid pet (' + p.petType + '), discarding.',
            );
        }
    });
    recoveryMap.forEach((state, pet) => {
        // Recover previous state.
        if (state.petState !== undefined) {
            pet.recoverState(state.petState);
        }

        // Resolve friend relationships
        var friend = undefined;
        if (state.petFriend) {
            friend = allPets.locate(state.petFriend);
            if (friend) {
                pet.recoverFriend(friend.pet);
            }
        }
    });
}

function randomStartPosition(): number {
    return Math.floor(Math.random() * (window.innerWidth * 0.7));
}

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

function initCanvas() {
    canvas = document.getElementById('petCanvas') as HTMLCanvasElement;
    if (!canvas) {
        console.log('Canvas not ready');
        return;
    }
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) {
        console.log('Canvas context not ready');
        return;
    }
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

// It cannot access the main VS Code APIs directly.
export function petPanelApp(
    basePetUri: string,
    theme: Theme,
    themeKind: ColorThemeKind,
    petColor: PetColor,
    petSize: PetSize,
    petType: PetType,
    throwBallWithMouse: boolean,
    stateApi?: VscodeStateApi,
) {
    const ballRadius: number = calculateBallRadius(petSize);
    var floor = 0;
    if (!stateApi) {
        stateApi = acquireVsCodeApi();
    }
    // Apply Theme backgrounds
    const foregroundEl = document.getElementById('foreground');
    if (theme !== Theme.none) {
        var _themeKind = '';
        switch (themeKind) {
            case ColorThemeKind.dark:
                _themeKind = 'dark';
                break;
            case ColorThemeKind.light:
                _themeKind = 'light';
                break;
            case ColorThemeKind.highContrast:
            default:
                _themeKind = 'light';
                break;
        }

        document.body.style.backgroundImage = `url('${basePetUri}/backgrounds/${theme}/background-${_themeKind}-${petSize}.png')`;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        foregroundEl!.style.backgroundImage = `url('${basePetUri}/backgrounds/${theme}/foreground-${_themeKind}-${petSize}.png')`;

        floor = calculateFloor(petSize, theme); // Themes have pets at a specified height from the ground
    } else {
        document.body.style.backgroundImage = '';
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        foregroundEl!.style.backgroundImage = '';
    }

    /// Bouncing ball components, credit https://stackoverflow.com/a/29982343
    const gravity: number = 0.6,
        damping: number = 0.9,
        traction: number = 0.8,
        interval: number = 1000 / 24; // msec for single frame
    let then: number = 0; // last draw
    var ballState: BallState;

    function resetBall() {
        if (ballState) {
            ballState.paused = true;
        }
        if (canvas) {
            canvas.style.display = 'block';
        }
        ballState = new BallState(100, 100, 4, 5);
    }

    function dynamicThrowOn() {
        let startMouseX: number;
        let startMouseY: number;
        let endMouseX: number;
        let endMouseY: number;
        console.log('Enabling dynamic throw');
        window.onmousedown = (e) => {
            if (ballState) {
                ballState.paused = true;
            }
            if (canvas) {
                canvas.style.display = 'block';
            }
            endMouseX = e.clientX;
            endMouseY = e.clientY;
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            ballState = new BallState(e.clientX, e.clientY, 0, 0);

            ballState.paused = true;

            drawBall();

            window.onmousemove = (ev) => {
                ev.preventDefault();
                if (ballState) {
                    ballState.paused = true;
                }
                startMouseX = endMouseX;
                startMouseY = endMouseY;
                endMouseX = ev.clientX;
                endMouseY = ev.clientY;
                ballState = new BallState(ev.clientX, ev.clientY, 0, 0);
                drawBall();
            };
            window.onmouseup = (ev) => {
                ev.preventDefault();
                window.onmouseup = null;
                window.onmousemove = null;

                ballState = new BallState(
                    endMouseX,
                    endMouseY,
                    endMouseX - startMouseX,
                    endMouseY - startMouseY,
                );
                throwBall();
            };
        };
    }
    function dynamicThrowOff() {
        console.log('Disabling dynamic throw');
        window.onmousedown = null;
        if (ballState) {
            ballState.paused = true;
        }
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
    function throwBall() {
        if (!ballState.paused) {
            requestAnimationFrame(throwBall);
        }

        // throttling the frame rate
        const now = Date.now();
        const elapsed = now - then;
        if (elapsed <= interval) {
            return;
        }
        then = now - (elapsed % interval);

        if (ballState.cx + ballRadius >= canvas.width) {
            ballState.vx = -ballState.vx * damping;
            ballState.cx = canvas.width - ballRadius;
        } else if (ballState.cx - ballRadius <= 0) {
            ballState.vx = -ballState.vx * damping;
            ballState.cx = ballRadius;
        }
        if (ballState.cy + ballRadius + floor >= canvas.height) {
            ballState.vy = -ballState.vy * damping;
            ballState.cy = canvas.height - ballRadius - floor;
            // traction here
            ballState.vx *= traction;
        } else if (ballState.cy - ballRadius <= 0) {
            ballState.vy = -ballState.vy * damping;
            ballState.cy = ballRadius;
        }

        ballState.vy += gravity;

        ballState.cx += ballState.vx;
        ballState.cy += ballState.vy;
        drawBall();
    }

    function drawBall() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(ballState.cx, ballState.cy, ballRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#2ed851';
        ctx.fill();
    }

    console.log(
        'Starting pet session',
        petColor,
        basePetUri,
        petType,
        throwBallWithMouse,
    );

    // New session
    var state = stateApi?.getState();

    

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', (event): void => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'throw-with-mouse':
                if (message.enabled) {
                    dynamicThrowOn();
                } else {
                    dynamicThrowOff();
                }
                break;
            case 'throw-ball':
                resetBall();
                throwBall();
                break;
            case 'spawn-pet':
                const newPet = addPetToPanel(
                    message.type,
                    basePetUri,
                    message.color,
                    petSize,
                    randomStartPosition(),
                    floor,
                    floor,
                    message.name ?? randomName(message.type),
                    message.experience,
                    message.nextTarget,
                    message.level,
                    message.health,
                    stateApi,
                );
                console.log(JSON.stringify(message));
                showBar(newPet.pet.name, newPet.pet.getLevel(), newPet.pet.getExperience(), newPet.pet.getNextTarget(), newPet.pet.getHealth());
                allPets.push(
                    newPet
                );
                saveState(stateApi);
                break;

            case 'list-pets':
                var pets = allPets.pets;
                stateApi?.postMessage({
                    command: 'list-pets',
                    text: pets
                        .map(
                            (pet) => `${pet.type},${pet.pet.name},${pet.color},${pet.pet.getExperience()},${pet.pet.getHealth()},${pet.pet.getNextTarget()},${pet.pet.getLevel()}`,
                        )
                        .join('\n'),
                });
                break;

            case 'roll-call':
                var pets = allPets.pets;
                // go through every single
                // pet and then print out their name
                pets.forEach((pet) => {
                    stateApi?.postMessage({
                        command: 'info',
                        text: `${pet.pet.emoji} ${pet.pet.name} (${pet.color} ${pet.type}): ${pet.pet.hello}`,
                    });
                });
            case 'delete-pet':
                var pet = allPets.locate(message.name);
                if (pet) {
                    allPets.remove(message.name);
                    saveState(stateApi);
                    stateApi?.postMessage({
                        command: 'info',
                        text: '👋 Removed pet ' + message.name,
                    });

                    // Hide the chat box if it is being shown for the removed pet
                    hideChatbox();
                } else {
                    stateApi?.postMessage({
                        command: 'error',
                        text: `Could not find pet ${message.name}`,
                    });
                }
                hideBar();
                break;
            case 'reset-pet':
                allPets.reset();
                petCounter = 0;
                saveState(stateApi);
                break;
            case 'pause-pet':
                petCounter = 1;
                saveState(stateApi);
                break;
            case 'update-experience':
                var pets = allPets.pets;
                var diff = message.diff;
                pets.forEach((pet) => {
                    pet.pet.setExperience(pet.pet.getExperience() + diff, true).then(msg => {
                        if (msg !== "") {
                            displayMessage("", msg);
                            storeMessage("", msg);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                    updateBar(pet.pet.name, pet.pet.getLevel(), pet.pet.getExperience(), pet.pet.getNextTarget(), pet.pet.getHealth());
                });
                saveState(stateApi);
                break;
            case 'update-health':
                var pets = allPets.pets;
                var diff = message.diff;
                pets.forEach((pet) => {
                    pet.pet.setHealth(pet.pet.getHealth() + diff, false).then(msg => {
                        if (msg !== "") {
                            displayMessage("", msg);
                            storeMessage("", msg);
                        }
                    }).catch(err => {
                        console.log(err);
                    });;
                    updateBar(pet.pet.name, pet.pet.getLevel(), pet.pet.getExperience(), pet.pet.getNextTarget(), pet.pet.getHealth());
                });
                saveState(stateApi);
                //console.log("Updating health");
                break;
            case 'handle-compile-result':
                var pets = allPets.pets;
                const result = message.result;
                const code = message.code;
                const randomPet = pets[Math.floor(Math.random() * pets.length)];
                
                if (result === 0) {
                    randomPet.pet.onCompilationSuccess(code).then(msg => {
                        if (msg !== "") {
                            displayMessage("", msg);
                            storeMessage("", msg);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                    allPets.pets.forEach(pet => {
                        pet.pet.setExperience(pet.pet.getExperience() + 5, false).then(msg => {
                            if (msg !== "") {
                                displayMessage("", msg);
                                storeMessage("", msg);
                            }
                        }).catch(err => {
                            console.log(err);
                        });;
                    });
                } else {
                    randomPet.pet.onCompilationError(code).then(msg => {
                        if (msg !== "") {
                            displayMessage("", msg);
                            storeMessage("", msg);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
                break;
            case 'handle-code-text-result':
                break;
            case 'update-health-timer':
                const timer = message.timer;
                currentTimer = timer;
                saveState(stateApi);

        }
    });

    if (!state) {
        console.log('No state, starting a new session.');
        petCounter = 1;
        allPets.push(
            addPetToPanel(
                petType,
                basePetUri,
                petColor,
                petSize,
                randomStartPosition(),
                floor,
                floor,
                randomName(petType),
                0, 100, 1, 100,
                stateApi,
            ),
        );
        saveState(stateApi);
    } else {
        console.log('Recovering state - ', state);
        recoverState(basePetUri, petSize, floor, stateApi);
        const currentPet = allPets.pets[0];
        console.log(allPets);
        showBar(currentPet.pet.name, currentPet.pet.getLevel(), currentPet.pet.getExperience(), currentPet.pet.getNextTarget(), currentPet.pet.getHealth());

    }

    initCanvas();

    if (throwBallWithMouse) {
        dynamicThrowOn();
    } else {
        dynamicThrowOff();
    }

}
window.addEventListener('resize', function () {
    initCanvas();
});