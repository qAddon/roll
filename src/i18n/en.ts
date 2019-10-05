import { I18N_LANGUAGE, qRollNamePrefix, qRollNamePrefixColored } from "./types";

export const EN: I18N_LANGUAGE = {
    systemRollMessage: "[%S,player] rolls [%d,value] ([%d,from]-[%d,to])",
    rollWindowTitleText: "qRoll - Rolling results",
    rollWindowLeaderText: "Currently leading: |c$classColor$player|r ( |cffffd700$value|r )",
    rollWindowEntry: "- |cffffd700$value|r from |c$classColor$player|r",
    rollWindowMissingPlayer: "The following players have not yet rolled:",
    rollWindowNoMissingPlayer: "|cffaaaaaaAll players have rolled|r",
    rollWindowAnnounceMissingButtonText: "Missing players",
    rollWindowAnnounceWinnerButtonText: "Output winner",
    announceMissingPlayers: `${qRollNamePrefix}The following players have not yet rolled: $missingPlayers.`,
    announceWinner: `${qRollNamePrefix}--> $winner <-- is the winner with the highest value of $value. Range was from $from to $to. Congratulations!`,
    announceWinnerMissingPlayers: `${qRollNamePrefix}Not participated have: $missingPlayers. Too bad!`,
    optionsChangesSaved: `${qRollNamePrefixColored}Changes made in the options have been saved.`,
    optionsChangesCanceled: `${qRollNamePrefixColored}Changes made in the options have been resetted.`,
    optionsDirectOutput: "Automaticly output the winner if all players have rolled."
};
