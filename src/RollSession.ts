import { RollResult, PlayerAndRollValue, RollRange } from "./types";

export class RollSession {

    /**
     * the roll session content
     */
    private stack: {
        [playerName: string]: RollResult[]
    } = {};

    /**
     * contains all event callbacks
     */
    private eventCallbackStack: {
        newRoll: (() => void)[]
    } = {
            newRoll: []
        };

    /**
     * add a roll result to the session
     * @param result the roll result
     */
    public addRollResult(result: RollResult): void {

        // init the stack for the player if nessesary
        this.stack[result.player] = this.stack[result.player] || [];

        // push the result onto the stack
        this.stack[result.player].push(result);

        // call new roll event callbacks
        this.eventCallbackStack.newRoll.forEach(cb => cb());
    }

    /**
     * get all rolls grouped by player names. only return the first rolled value in this session
     * @param range the range to query vor
     */
    public getFirstRollsGroupByPlayer(range: RollRange["range"] | "DEFAULT"): RollResult[] {

        // get all players of this session and get the first roll
        const rollStack: RollResult[] = [];

        // iterate over the contesting players
        Object.keys(this.stack).forEach(playerName => {

            // get the first valid roll
            const foundRoll = this.stack[playerName].find(roll => {

                // range ok?
                if (range === "DEFAULT" && roll.range.from === 1 && roll.range.to === 100) {
                    return true;
                } else if (range !== "DEFAULT" && roll.range.from === range.from && roll.range.to === range.to) {
                    return true;
                }

                return false;
            });

            // roll valid and range ok??
            if (foundRoll) {
                rollStack.push(foundRoll);
            }
        });

        // return the complete result
        return rollStack;
    }

    /**
     * adds an event callback when a new roll has been added to the session
     * @param callback the callback function
     */
    public onNewRoll(callback: () => void): void {

        // add the callback
        this.eventCallbackStack.newRoll.push(callback);
    }

    /**
     * find the leading roll from all rolls in the given range
     * @param range the contesting range
     */
    public getLeadingRoll(range: RollRange["range"] | "DEFAULT"): RollResult | null {

        // get all rolls
        const rolls = this.getFirstRollsGroupByPlayer(range);

        // find the current leader
        let leader: RollResult | null = null;
        rolls.forEach(roll => {
            if (!leader || roll.value > leader.value) {
                leader = roll;
            }
        });

        return leader;
    }

    /**
     * find all players that does not have rolled within the given range
     * @param range the range to query vor
     */
    public getMissingContestants(range: RollRange["range"] | "DEFAULT"): string[] {

        // raid or group?
        const isParty: boolean = !IsInRaid("player");

        // get all contestants
        const allContestants = this.getContestants(isParty ? "party" : "raid");

        // remove all players that have rolled
        const rolledPlayers = Object.keys(this.stack).map(playerName => {

            // only get rolls of the given range
            const roll = this.stack[playerName].find(r => {
                if (range === "DEFAULT" && r.range.from === 1 && r.range.to === 100) {
                    return true;
                } else if (range !== "DEFAULT" && r.range.from === range.from && r.range.to === range.to) {
                    return true;
                }
            });

            if (roll) {
                return playerName;
            }
            return null;
        }).filter(name => !!name);

        // iterate over every contestent and search this player in the rolledPlayers list
        return allContestants
            .map(player => rolledPlayers.indexOf(player) === -1 ? player : null)
            .filter(player => !!player);
    }

    /**
     * find all members of the current party
     */
    private getContestants(prefix: "party" | "raid"): string[] {

        const contestants: string[] = [];
        const to = prefix === "party" ? 4 : 40;

        // party? => add current player
        if (prefix === "party") {
            contestants.push(GetUnitName("player", false));
        }

        // get members
        for (let i = 1; i <= to; i++) {

            // try to find a name
            const name = GetUnitName((`${prefix}${i}`) as WowUnitId, false);
            if (name) {
                contestants.push(name);
            }
        }

        return contestants;
    }

}
