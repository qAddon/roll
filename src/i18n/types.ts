export declare type NO_VARIABLES = never;

export const qRollNamePrefix: string = "[qRoll] ";
export const qRollNamePrefixColored: string = "[|cff255475q|rRoll] ";

export declare type I18N = {

    /**
     * system message when a player has rolled the dice
     * @regex
     */
    systemRollMessage: NO_VARIABLES,

    /**
     * title text of the roll popup
     */
    rollWindowTitleText: NO_VARIABLES,

    /**
     * text indicating who is currently leading.
     * variables are:
     * - **$player** the name of the leading player
     * - **$value** the roll value of the leader
     * - **$classColor** players class color as hex string
     */
    rollWindowLeaderText: {
        player: string,
        value: number,
        classColor: string
    },

    /**
     * one list entry of a contesting player
     * variables are:
     * - **$player** name of the player contesting
     * - **$value** rolled value of the player
     * - **$classColor** class color of the player who as rolled as hex string
     */
    rollWindowEntry: {
        player: string,
        value: number,
        classColor: string
    },

    /**
     * text above the missing player list
     */
    rollWindowMissingPlayer: NO_VARIABLES,

    /**
     * text above the missing player list indicating that all contesting players have rolled
     */
    rollWindowNoMissingPlayer: NO_VARIABLES,

    /**
     * text on the button: Announce missing rolls from group
     */
    rollWindowAnnounceMissingButtonText: NO_VARIABLES,

    /**
     * text on the button: Announce the winner from all rolls
     */
    rollWindowAnnounceWinnerButtonText: NO_VARIABLES,

    /**
     * the text that will be send to the party or raid channel for missing contestants.
     * variables are:
     * - **$missingPlayers** a comma seperated list of players that are missing
     */
    announceMissingPlayers: {
        missingPlayers: string
    },

    /**
     * the text that will be send to the party or raid channel indicating the winner of the contestant.
     * variables are:
     * - **$winner** player name of the winner
     * - **$value** the value that has won
     * - **from** range from value
     * - **to** range to value
     */
    announceWinner: {
        winner: string,
        value: number,
        from: number,
        to: number
    },

    /**
     * a text that will be added (new chat msg) if there are still players that hav not jet contested
     * variables are:
     * **$missingPlayers** a comma seperated list of players that are missing
     */
    announceWinnerMissingPlayers: {
        missingPlayers: string
    },

    /**
     * a message to the user that the changes made have been commited
     */
    optionsChangesSaved: NO_VARIABLES,

    /**
     * a message to the user that the changes made have been reset
     */
    optionsChangesCanceled: NO_VARIABLES,

    /**
     * checkbox visible name for the option that the winner should outputed when all players have rolled
     */
    optionsDirectOutput: NO_VARIABLES
};

export declare type I18N_LANGUAGE = {
    [P in keyof I18N]: string
};
