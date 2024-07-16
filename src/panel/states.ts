import { PetColor, PetType } from '../common/types';

type ReturnMessage = {
    returnMsg: string;
    time: string;
};

type ReturnMessageWithLevelChange = {
    returnMsg: string;
    time: string;
    levelChange: number;
};

export type Level = {
    next_target: string;
    ex_per_line: string;
    health_drop_time: string;
    health_increase_time: string;
};

export interface IPetType {
    allowSwipe: boolean;
    nextFrame(): void;

    // Special methods for actions
    canSwipe: boolean;
    canChase: boolean;
    swipe(): void;
    speed: number;
    isMoving: boolean;
    hello: string;

    // State API
    getState(): PetInstanceState;
    recoverState(state: PetInstanceState): void;
    recoverFriend(friend: IPetType): void;

    // Positioning
    bottom: number;
    left: number;
    positionBottom(bottom: number): void;
    positionLeft(left: number): void;
    width: number;
    floor: number;

    // Friends API
    name: string;
    emoji: string;
    hasFriend: boolean;
    friend: IPetType | undefined;
    makeFriendsWith(friend: IPetType): boolean;
    isPlaying: boolean;

    experience: number;
    health: number;
    nextTarget: number;
    level: number;

    getHealth(): number;
    getExperience(): number;
    getNextTarget(): number;
    getLevel(): number;
    
    setHealth(value: number, initial: boolean, userID: string): Promise<ReturnMessage>;
    setExperience(value: number, showMessage: boolean, userID: string, nextTarget: number): Promise<ReturnMessageWithLevelChange>;
    setLevel(value: number, newNextTarget: number): void;

    onCompilationError(code: string, userID: string, err: string): Promise<ReturnMessage>;
    onCompilationSuccess(code: string, userID: string): Promise<ReturnMessage>;


    showSpeechBubble(message: string, duration: number): void;

    eat(cx: number, canvas: HTMLElement, userID: string): void;

    pet(): void;

    play(): void;

    chase(ballState: BallState, canvas: HTMLCanvasElement): void;
}

export class PetInstanceState {
    currentStateEnum: States | undefined;
}

export class PetElementState {
    petState: PetInstanceState | undefined;
    petType: PetType | undefined;
    petColor: PetColor | undefined;
    elLeft: string | undefined;
    elBottom: string | undefined;
    petName: string | undefined;
    petFriend: string | undefined;
    petExperience: number = 0;
    petNextTarget: number = 100;
    petHealth: number = 100;
    petLevel: number = 1;
}

export class PetPanelState {
    petStates: Array<PetElementState> | undefined;
    petCounter: number | undefined;
    healthTimer: Date | undefined;
    userID: string | undefined;
    accessCode: string | undefined;
    storyLine: Array<Level> | undefined;
    coin: number | undefined;
    targetTimes: Date[] | undefined;
}

export enum HorizontalDirection {
    left,
    right,
    natural, // No change to current direction
}

export const enum States {
    sitIdleLL = 'sit-idle-low-health-low-level',
    sitIdleLM = 'sit-idle-low-health-mid-level',
    sitIdleLH = 'sit-idle-low-health-high-level',
    sitIdleL = 'sit-idle-low-level',
    sitIdleM = 'sit-idle-mid-level',
    sitIdleH = 'sit-idle-high-level',
    
    walkRightL = 'walk-right-low-level',
    walkRightM = 'walk-right-mid-level',
    walkRightH = 'walk-right-high-level',
    
    walkLeftL = 'walk-left-low-level',
    walkLeftM = 'walk-left-mid-level',
    walkLeftH = 'walk-left-high-level',
    
    runRightL = 'run-right-low-level',
    runRightM = 'run-right-mid-level',
    runRightH = 'run-right-high-level',
    
    runLeftL = 'run-left-low-level',
    runLeftM = 'run-left-mid-level',
    runLeftH = 'run-left-high-level',
    
    lieLL = 'lie-low-health-low-level',
    lieLM = 'lie-low-health-mid-level',
    lieLH = 'lie-low-health-high-level',
    lieL = 'lie-low-level',
    lieM = 'lie-mid-level',
    lieH = 'lie-high-level',
    
    swipeL = 'swipe-low-level',
    swipeM = 'swipe-mid-level',
    swipeH = 'swipe-high-level',

    eatL = "eat-low-level",
    eatM = "eat-mid-level",
    eatH = "eat-high-level",

    idleWithBallL = "idle-with-ball-low-level",
    idleWithBallM = "idle-with-ball-mid-level",
    idleWithBallH = "idle-with-ball-high-level",

    chaseL = "chase-low-level",
    chaseM = "chase-mid-level",
    chaseH = "chase-high-level",

    chaseFoodL = "chase-food-low-level",
    chaseFoodM = "chase-food-mid-level",
    chaseFoodH = "chase-food-high-level",
}

export enum FrameResult {
    stateContinue,
    stateComplete,
    // Special states
    stateCancel,
}

export class BallState {
    cx: number;
    cy: number;
    vx: number;
    vy: number;
    paused: boolean;

    constructor(cx: number, cy: number, vx: number, vy: number) {
        this.cx = cx;
        this.cy = cy;
        this.vx = vx;
        this.vy = vy;
        this.paused = false;
    }
}

export class FoodState {
    cx: number;

    constructor(cx: number) {
        this.cx = cx;
    }
}

// dummy
export function isStateAboveGround(state: States): boolean {
    return (
        state === null
    );
}

export function resolveState(state: string, pet: IPetType): IState {
    switch (state) {
        case States.sitIdleLL:
            return new SitIdleStateLL(pet);
        case States.sitIdleLM:
            return new SitIdleStateLM(pet);
        case States.sitIdleLH:
            return new SitIdleStateLH(pet);
        case States.sitIdleL:
            return new SitIdleStateL(pet);
        case States.sitIdleM:
            return new SitIdleStateM(pet);
        case States.sitIdleH:
            return new SitIdleStateH(pet);

        case States.walkRightL:
            return new WalkRightStateL(pet);
        case States.walkRightM:
            return new WalkRightStateM(pet);
        case States.walkRightH:
            return new WalkRightStateH(pet);

        case States.walkLeftL:
            return new WalkLeftStateL(pet);
        case States.walkLeftM:
            return new WalkLeftStateM(pet);
        case States.walkLeftH:
            return new WalkLeftStateH(pet);

        case States.runRightL:
            return new RunRightStateL(pet);
        case States.runRightM:
            return new RunRightStateM(pet);
        case States.runRightH:
            return new RunRightStateH(pet);

        case States.runLeftL:
            return new RunLeftStateL(pet);
        case States.runLeftM:
            return new RunLeftStateM(pet);
        case States.runLeftH:
            return new RunLeftStateH(pet);

        case States.lieLL:
            return new LieStateLL(pet);
        case States.lieLM:
            return new LieStateLM(pet);
        case States.lieLH:
            return new LieStateLH(pet);
        case States.lieL:
            return new LieStateL(pet);
        case States.lieM:
            return new LieStateM(pet);
        case States.lieH:
            return new LieStateH(pet);

        case States.swipeL:
            return new SwipeStateL(pet);
        case States.swipeM:
            return new SwipeStateM(pet);
        case States.swipeH:
            return new SwipeStateH(pet);

        case States.eatL:
            return new EatL(pet);
        case States.eatM:
            return new EatM(pet);
        case States.eatH:
            return new EatH(pet);

        case States.idleWithBallL:
            return new IdleWithBallL(pet);
        case States.idleWithBallM:
            return new IdleWithBallM(pet);
        case States.idleWithBallH:
            return new IdleWithBallH(pet); 

    }
    return new SitIdleStateL(pet);
}

export interface IState {
    label: string;
    spriteLabel: string;
    horizontalDirection: HorizontalDirection;
    pet: IPetType;
    nextFrame(): FrameResult;
}

class AbstractStaticState implements IState {
    label = States.sitIdleL;
    idleCounter: number;
    spriteLabel = 'idle';
    holdTime = 50;
    pet: IPetType;

    horizontalDirection = HorizontalDirection.left;

    constructor(pet: IPetType) {
        this.idleCounter = 0;
        this.pet = pet;
    }

    nextFrame(): FrameResult {
        this.idleCounter++;
        if (this.idleCounter > this.holdTime) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

// sit idle
export class SitIdleStateLL extends AbstractStaticState {
    label = States.sitIdleLL;
    spriteLabel = 'idle_low_level_low_health';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class SitIdleStateLM extends AbstractStaticState {
    label = States.sitIdleLM;
    spriteLabel = 'idle_mid_level_low_health';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class SitIdleStateLH extends AbstractStaticState {
    label = States.sitIdleLH;
    spriteLabel = 'idle_high_level_low_health';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class SitIdleStateL extends AbstractStaticState {
    label = States.sitIdleL;
    spriteLabel = 'idle_low_level';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class SitIdleStateM extends AbstractStaticState {
    label = States.sitIdleM;
    spriteLabel = 'idle_mid_level';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class SitIdleStateH extends AbstractStaticState {
    label = States.sitIdleH;
    spriteLabel = 'idle_high_level';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}


// lie
export class LieStateLL extends AbstractStaticState {
    label = States.lieLL;
    spriteLabel = 'lie_low_level_low_health';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class LieStateLM extends AbstractStaticState {
    label = States.lieLM;
    spriteLabel = 'lie_mid_level_low_health';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class LieStateLH extends AbstractStaticState {
    label = States.lieLH;
    spriteLabel = 'lie_high_level_low_health';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class LieStateL extends AbstractStaticState {
    label = States.lieL;
    spriteLabel = 'lie_low_level';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class LieStateM extends AbstractStaticState {
    label = States.lieM;
    spriteLabel = 'lie_mid_level';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class LieStateH extends AbstractStaticState {
    label = States.lieH;
    spriteLabel = 'lie_high_level';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}

export class EatL extends AbstractStaticState {
    label = States.eatL;
    spriteLabel = 'eat_low_level';
    horizontalDirection = HorizontalDirection.natural;
    holdTime = 60;
}

export class EatM extends AbstractStaticState {
    label = States.eatM;
    spriteLabel = 'eat_mid_level';
    horizontalDirection = HorizontalDirection.natural;
    holdTime = 60;
}

export class EatH extends AbstractStaticState {
    label = States.eatH;
    spriteLabel = 'eat_high_level';
    horizontalDirection = HorizontalDirection.natural;
    holdTime = 60;
}

export class IdleWithBallL extends AbstractStaticState {
    label = States.idleWithBallL;
    spriteLabel = 'with_ball_low_level';
    horizontalDirection = HorizontalDirection.left;
    holdTime = 30;
}

export class IdleWithBallM extends AbstractStaticState {
    label = States.idleWithBallM;
    spriteLabel = 'with_ball_mid_level';
    horizontalDirection = HorizontalDirection.left;
    holdTime = 30;
}

export class IdleWithBallH extends AbstractStaticState {
    label = States.idleWithBallH;
    spriteLabel = 'with_ball_high_level';
    horizontalDirection = HorizontalDirection.left;
    holdTime = 30;
}



export class SwipeStateL extends AbstractStaticState {
    label = States.swipeL;
    spriteLabel = 'swipe_low_level';
    horizontalDirection = HorizontalDirection.natural;
    holdTime = 15;
}

// swipe
export class SwipeStateM extends AbstractStaticState {
    label = States.swipeM;
    spriteLabel = 'swipe_mid_level';
    horizontalDirection = HorizontalDirection.natural;
    holdTime = 15;
}

export class SwipeStateH extends AbstractStaticState {
    label = States.swipeH;
    spriteLabel = 'swipe_high_level';
    horizontalDirection = HorizontalDirection.natural;
    holdTime = 15;
}

// walk right
export class WalkRightStateL implements IState {
    label = States.walkRightL;
    pet: IPetType;
    spriteLabel = 'walk_low_level';
    horizontalDirection = HorizontalDirection.right;
    leftBoundary: number;
    speedMultiplier = 1;
    idleCounter: number;
    holdTime = 60;

    constructor(pet: IPetType) {
        this.leftBoundary = Math.floor(window.innerWidth * 0.95);
        this.pet = pet;
        this.idleCounter = 0;
    }

    nextFrame(): FrameResult {
        this.idleCounter++;
        this.pet.positionLeft(
            this.pet.left + this.pet.speed * this.speedMultiplier,
        );
        if (
            this.pet.isMoving &&
            this.pet.left >= this.leftBoundary - this.pet.width
        ) {
            return FrameResult.stateComplete;
        } else if (!this.pet.isMoving && this.idleCounter > this.holdTime) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

export class WalkRightStateM implements IState {
    label = States.walkRightM;
    pet: IPetType;
    spriteLabel = 'walk_mid_level';
    horizontalDirection = HorizontalDirection.right;
    leftBoundary: number;
    speedMultiplier = 1;
    idleCounter: number;
    holdTime = 60;

    constructor(pet: IPetType) {
        this.leftBoundary = Math.floor(window.innerWidth * 0.95);
        this.pet = pet;
        this.idleCounter = 0;
    }

    nextFrame(): FrameResult {
        this.idleCounter++;
        this.pet.positionLeft(
            this.pet.left + this.pet.speed * this.speedMultiplier,
        );
        if (
            this.pet.isMoving &&
            this.pet.left >= this.leftBoundary - this.pet.width
        ) {
            return FrameResult.stateComplete;
        } else if (!this.pet.isMoving && this.idleCounter > this.holdTime) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

export class WalkRightStateH implements IState {
    label = States.walkRightH;
    pet: IPetType;
    spriteLabel = 'walk_high_level';
    horizontalDirection = HorizontalDirection.right;
    leftBoundary: number;
    speedMultiplier = 1;
    idleCounter: number;
    holdTime = 60;

    constructor(pet: IPetType) {
        this.leftBoundary = Math.floor(window.innerWidth * 0.95);
        this.pet = pet;
        this.idleCounter = 0;
    }

    nextFrame(): FrameResult {
        this.idleCounter++;
        this.pet.positionLeft(
            this.pet.left + this.pet.speed * this.speedMultiplier,
        );
        if (
            this.pet.isMoving &&
            this.pet.left >= this.leftBoundary - this.pet.width
        ) {
            return FrameResult.stateComplete;
        } else if (!this.pet.isMoving && this.idleCounter > this.holdTime) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

// walk left
export class WalkLeftStateL implements IState {
    label = States.walkLeftL;
    spriteLabel = 'walk_low_level';
    horizontalDirection = HorizontalDirection.left;
    pet: IPetType;
    speedMultiplier = 1;
    idleCounter: number;
    holdTime = 60;

    constructor(pet: IPetType) {
        this.pet = pet;
        this.idleCounter = 0;
    }

    nextFrame(): FrameResult {
        this.pet.positionLeft(
            this.pet.left - this.pet.speed * this.speedMultiplier,
        );
        if (this.pet.isMoving && this.pet.left <= 0) {
            return FrameResult.stateComplete;
        } else if (!this.pet.isMoving && this.idleCounter > this.holdTime) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

export class WalkLeftStateM implements IState {
    label = States.walkLeftM;
    spriteLabel = 'walk_mid_level';
    horizontalDirection = HorizontalDirection.left;
    pet: IPetType;
    speedMultiplier = 1;
    idleCounter: number;
    holdTime = 60;

    constructor(pet: IPetType) {
        this.pet = pet;
        this.idleCounter = 0;
    }

    nextFrame(): FrameResult {
        this.pet.positionLeft(
            this.pet.left - this.pet.speed * this.speedMultiplier,
        );
        if (this.pet.isMoving && this.pet.left <= 0) {
            return FrameResult.stateComplete;
        } else if (!this.pet.isMoving && this.idleCounter > this.holdTime) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

export class WalkLeftStateH implements IState {
    label = States.walkLeftH;
    spriteLabel = 'walk_high_level';
    horizontalDirection = HorizontalDirection.left;
    pet: IPetType;
    speedMultiplier = 1;
    idleCounter: number;
    holdTime = 60;

    constructor(pet: IPetType) {
        this.pet = pet;
        this.idleCounter = 0;
    }

    nextFrame(): FrameResult {
        this.pet.positionLeft(
            this.pet.left - this.pet.speed * this.speedMultiplier,
        );
        if (this.pet.isMoving && this.pet.left <= 0) {
            return FrameResult.stateComplete;
        } else if (!this.pet.isMoving && this.idleCounter > this.holdTime) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

// run
export class RunRightStateL extends WalkRightStateL {
    label = States.runRightL;
    spriteLabel = 'run_low_level';
    speedMultiplier = 1.6;
    holdTime = 130;
}

export class RunRightStateM extends WalkRightStateM {
    label = States.runRightM;
    spriteLabel = 'run_mid_level';
    speedMultiplier = 1.6;
    holdTime = 130;
}

export class RunRightStateH extends WalkRightStateH {
    label = States.runRightH;
    spriteLabel = 'run_high_level';
    speedMultiplier = 1.6;
    holdTime = 130;
}

export class RunLeftStateL extends WalkLeftStateL {
    label = States.runLeftL;
    spriteLabel = 'run_low_level';
    speedMultiplier = 1.6;
    holdTime = 130;
}

export class RunLeftStateM extends WalkLeftStateM {
    label = States.runLeftM;
    spriteLabel = 'run_mid_level';
    speedMultiplier = 1.6;
    holdTime = 130;
}

export class RunLeftStateH extends WalkLeftStateH {
    label = States.runLeftH;
    spriteLabel = 'run_high_level';
    speedMultiplier = 1.6;
    holdTime = 130;
}

export class ChaseL implements IState {
    label = States.chaseL;
    spriteLabel = 'run_low_level';
    horizontalDirection = HorizontalDirection.left;
    ballState: BallState;
    canvas: HTMLCanvasElement;
    pet: IPetType;

    constructor(
        pet: IPetType,
        ballState: BallState,
        canvas: HTMLCanvasElement,
    ) {
        this.pet = pet;
        this.ballState = ballState;
        this.canvas = canvas;
    }

    nextFrame(): FrameResult {
        if (this.ballState.paused) {
            return FrameResult.stateCancel; // Ball is already caught
        }
        if (this.pet.left > this.ballState.cx) {
            this.horizontalDirection = HorizontalDirection.left;
            this.pet.positionLeft(this.pet.left - this.pet.speed);
        } else {
            this.horizontalDirection = HorizontalDirection.right;
            this.pet.positionLeft(this.pet.left + this.pet.speed);
        }

        if (
            this.canvas.height - this.ballState.cy <
                this.pet.width + this.pet.floor &&
            this.ballState.cx < this.pet.left &&
            this.pet.left < this.ballState.cx + 15
        ) {
            // hide ball
            this.canvas.style.display = 'none';
            this.ballState.paused = true;
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

export class ChaseM implements IState {
    label = States.chaseM;
    spriteLabel = 'run_mid_level';
    horizontalDirection = HorizontalDirection.left;
    ballState: BallState;
    canvas: HTMLCanvasElement;
    pet: IPetType;

    constructor(
        pet: IPetType,
        ballState: BallState,
        canvas: HTMLCanvasElement,
    ) {
        this.pet = pet;
        this.ballState = ballState;
        this.canvas = canvas;
    }

    nextFrame(): FrameResult {
        if (this.ballState.paused) {
            return FrameResult.stateCancel; // Ball is already caught
        }
        if (this.pet.left > this.ballState.cx) {
            this.horizontalDirection = HorizontalDirection.left;
            this.pet.positionLeft(this.pet.left - this.pet.speed);
        } else {
            this.horizontalDirection = HorizontalDirection.right;
            this.pet.positionLeft(this.pet.left + this.pet.speed);
        }

        if (
            this.canvas.height - this.ballState.cy <
                this.pet.width + this.pet.floor &&
            this.ballState.cx < this.pet.left &&
            this.pet.left < this.ballState.cx + 15
        ) {
            // hide ball
            this.canvas.style.display = 'none';
            this.ballState.paused = true;
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

export class ChaseH implements IState {
    label = States.chaseL;
    spriteLabel = 'run_high_level';
    horizontalDirection = HorizontalDirection.left;
    ballState: BallState;
    canvas: HTMLCanvasElement;
    pet: IPetType;

    constructor(
        pet: IPetType,
        ballState: BallState,
        canvas: HTMLCanvasElement,
    ) {
        this.pet = pet;
        this.ballState = ballState;
        this.canvas = canvas;
    }

    nextFrame(): FrameResult {
        if (this.ballState.paused) {
            return FrameResult.stateCancel; // Ball is already caught
        }
        if (this.pet.left > this.ballState.cx) {
            this.horizontalDirection = HorizontalDirection.left;
            this.pet.positionLeft(this.pet.left - this.pet.speed);
        } else {
            this.horizontalDirection = HorizontalDirection.right;
            this.pet.positionLeft(this.pet.left + this.pet.speed);
        }

        if (
            this.canvas.height - this.ballState.cy <
                this.pet.width + this.pet.floor &&
            this.ballState.cx < this.pet.left &&
            this.pet.left < this.ballState.cx + 15
        ) {
            // hide ball
            this.canvas.style.display = 'none';
            this.ballState.paused = true;
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}


export class ChaseFoodL implements IState {
    label = States.chaseFoodL;
    spriteLabel = 'run_low_level';
    horizontalDirection = HorizontalDirection.left;
    foodState: FoodState;
    canvas: HTMLElement;
    pet: IPetType;

    constructor(
        pet: IPetType,
        foodState: FoodState,
        canvas: HTMLElement,
    ) {
        this.pet = pet;
        this.foodState = foodState;
        this.canvas = canvas;
    }

    nextFrame(): FrameResult {
        if (this.pet.left > this.foodState.cx) {
            this.horizontalDirection = HorizontalDirection.left;
            this.pet.positionLeft(this.pet.left - this.pet.speed);
        } else {
            this.horizontalDirection = HorizontalDirection.right;
            this.pet.positionLeft(this.pet.left + this.pet.speed);
        }

        if (
            this.foodState.cx < this.pet.left &&
            this.pet.left < this.foodState.cx + 15
        ) {
            // hide food
            this.canvas.style.display = 'none';
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

export class ChaseFoodM implements IState {
    label = States.chaseFoodM;
    spriteLabel = 'run_mid_level';
    horizontalDirection = HorizontalDirection.left;
    foodState: FoodState;
    canvas: HTMLElement;
    pet: IPetType;

    constructor(
        pet: IPetType,
        foodState: FoodState,
        canvas: HTMLElement,
    ) {
        this.pet = pet;
        this.foodState = foodState;
        this.canvas = canvas;
    }

    nextFrame(): FrameResult {
        if (this.pet.left > this.foodState.cx) {
            this.horizontalDirection = HorizontalDirection.left;
            this.pet.positionLeft(this.pet.left - this.pet.speed);
        } else {
            this.horizontalDirection = HorizontalDirection.right;
            this.pet.positionLeft(this.pet.left + this.pet.speed);
        }

        if (
            this.foodState.cx < this.pet.left &&
            this.pet.left < this.foodState.cx + 15
        ) {
            // hide food
            this.canvas.style.display = 'none';
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

export class ChaseFoodH implements IState {
    label = States.chaseFoodH;
    spriteLabel = 'run_high_level';
    horizontalDirection = HorizontalDirection.left;
    foodState: FoodState;
    canvas: HTMLElement;
    pet: IPetType;

    constructor(
        pet: IPetType,
        foodState: FoodState,
        canvas: HTMLElement,
    ) {
        this.pet = pet;
        this.foodState = foodState;
        this.canvas = canvas;
    }

    nextFrame(): FrameResult {
        if (this.pet.left > this.foodState.cx) {
            this.horizontalDirection = HorizontalDirection.left;
            this.pet.positionLeft(this.pet.left - this.pet.speed);
        } else {
            this.horizontalDirection = HorizontalDirection.right;
            this.pet.positionLeft(this.pet.left + this.pet.speed);
        }

        if (
            this.foodState.cx < this.pet.left &&
            this.pet.left < this.foodState.cx + 15
        ) {
            // hide food
            this.canvas.style.display = 'none';
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}