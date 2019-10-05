export interface PlayerAndRollValue {

    player: string;
    value: number;
}

export interface RollRange {

    range: {
        from: number,
        to: number
    };
}

export interface RollResult extends PlayerAndRollValue, RollRange { }
