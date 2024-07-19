import { PetColor } from '../../common/types';
import { BasePetType } from '../basepettype';
import { States } from '../states';

export class Dog extends BasePetType {
    label = 'dog';
    static possibleColors = [
        PetColor.husky,
    ];
    sequence = {
        startingState: States.sitIdleL,
        sequenceStates: [
            {
                state: States.sitIdleL,
                possibleNextStates: [
                    States.walkRightL,
                    States.runRightL,
                    States.lieL,
                ],
            },
            {
                state: States.sitIdleM,
                possibleNextStates: [
                    States.walkRightL,
                    States.runRightL,
                    States.lieL,
                ],
            },
            {
                state: States.sitIdleH,
                possibleNextStates: [
                    States.walkRightL,
                    States.runRightL,
                    States.lieL,
                ],
            },

            {
                state: States.sitIdleLL,
                possibleNextStates: [
                    States.lieLL,
                ],
            },
            {
                state: States.sitIdleLM,
                possibleNextStates: [
                    States.lieLM,
                ],
            },
            {
                state: States.sitIdleLH,
                possibleNextStates: [
                    States.lieLH,
                ],
            },

            {
                state: States.lieL,
                possibleNextStates: [States.walkRightL, States.runRightL],
            },
            {
                state: States.lieM,
                possibleNextStates: [States.walkRightM, States.runRightM],
            },
            {
                state: States.lieH,
                possibleNextStates: [States.walkRightH, States.runRightH],
            },

            {
                state: States.lieLL,
                possibleNextStates: [States.sitIdleLL],
            },
            {
                state: States.lieLM,
                possibleNextStates: [States.sitIdleLM],
            },
            {
                state: States.lieLH,
                possibleNextStates: [States.sitIdleLH],
            },
            

            {
                state: States.walkRightL,
                possibleNextStates: [States.walkLeftL, States.runLeftL],
            },

            {
                state: States.runRightL,
                possibleNextStates: [States.walkLeftL, States.runLeftL],
            },
            {
                state: States.walkLeftL,
                possibleNextStates: [
                    States.sitIdleL,
                    States.lieL,
                    States.walkRightL,
                    States.runRightL,
                ],
            },
            {
                state: States.runLeftL,
                possibleNextStates: [
                    States.sitIdleL,
                    States.lieL,
                    States.walkRightL,
                    States.runRightL,
                ],
            },

            {
                state: States.walkRightM,
                possibleNextStates: [States.walkLeftM, States.runLeftM],
            },
            {
                state: States.runRightM,
                possibleNextStates: [States.walkLeftM, States.runLeftM],
            },
            {
                state: States.walkLeftM,
                possibleNextStates: [
                    States.sitIdleM,
                    States.lieM,
                    States.walkRightM,
                    States.runRightM,
                ],
            },
            {
                state: States.runLeftM,
                possibleNextStates: [
                    States.sitIdleM,
                    States.lieM,
                    States.walkRightM,
                    States.runRightM,
                ],
            },
            {
                state: States.walkRightH,
                possibleNextStates: [States.walkLeftH, States.runLeftH],
            },
            {
                state: States.runRightH,
                possibleNextStates: [States.walkLeftH, States.runLeftH],
            },
            {
                state: States.walkLeftH,
                possibleNextStates: [
                    States.sitIdleH,
                    States.lieH,
                    States.walkRightH,
                    States.runRightH,
                ],
            },
            {
                state: States.runLeftH,
                possibleNextStates: [
                    States.sitIdleH,
                    States.lieH,
                    States.walkRightH,
                    States.runRightH,
                ],
            },
            {
                state: States.swipeL,
                possibleNextStates: [
                    States.walkRightL,
                    States.runRightL,
                    States.lieL,
                ],
            },
            {
                state: States.swipeM,
                possibleNextStates: [
                    States.walkRightM,
                    States.runRightM,
                    States.lieM,
                ],
            },
            {
                state: States.swipeH,
                possibleNextStates: [
                    States.walkRightH,
                    States.runRightH,
                    States.lieH,
                ],
            },
            {
                state: States.eatL,
                possibleNextStates: [
                    States.walkLeftL,
                    States.walkRightL,
                    States.lieL,
                    States.sitIdleL,
                ]
            },
            {
                state: States.eatM,
                possibleNextStates: [
                    States.walkLeftM,
                    States.walkRightM,
                    States.lieM,
                    States.sitIdleM,
                ]
            },
            {
                state: States.eatH,
                possibleNextStates: [
                    States.walkLeftH,
                    States.walkRightH,
                    States.lieH,
                    States.sitIdleH,
                ]
            },
            {
                state: States.idleWithBallL,
                possibleNextStates: [
                    States.walkRightL,
                    States.walkLeftL,
                    States.runLeftL,
                    States.runRightL,
                ],
            },
            {
                state: States.idleWithBallM,
                possibleNextStates: [
                    States.walkRightM,
                    States.walkLeftM,
                    States.runLeftM,
                    States.runRightM,
                ],
            },
            {
                state: States.idleWithBallH,
                possibleNextStates: [
                    States.walkRightH,
                    States.walkLeftH,
                    States.runLeftH,
                    States.runRightH,
                ],
            },
            {
                state: States.chaseL,
                possibleNextStates: [States.idleWithBallL],
            },
            {
                state: States.chaseM,
                possibleNextStates: [States.idleWithBallM],
            },
            {
                state: States.chaseH,
                possibleNextStates: [States.idleWithBallH],
            },
            {
                state: States.chaseFoodL,
                possibleNextStates: [States.eatL],
            },
            {
                state: States.chaseFoodM,
                possibleNextStates: [States.eatM],
            },
            {
                state: States.chaseFoodH,
                possibleNextStates: [States.eatH],
            },
            
        ],
    };
    get emoji(): string {
        return '🐶';
    }
    get hello(): string {
        return ` Every dog has its day - and today is woof day! Today I just want to bark. Take me on a walk`;
    }
}

export const DOG_NAMES: ReadonlyArray<string> = [
    'Bella',
];
