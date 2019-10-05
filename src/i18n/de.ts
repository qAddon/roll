import { I18N_LANGUAGE, qRollNamePrefix, qRollNamePrefixColored } from "./types";

export const DE: I18N_LANGUAGE = {
    systemRollMessage: "[%S,player] würfelt. Ergebnis: [%d,value] ([%d,from]-[%d,to])",
    rollWindowTitleText: "qRoll - Ergebnisse des Würfelns",
    rollWindowLeaderText: "Aktuell führt: |c$classColor$player|r ( |cffffd700$value|r )",
    rollWindowEntry: "- |cffffd700$value|r von |c$classColor$player|r",
    rollWindowMissingPlayer: "Noch nicht gewürfelt haben:",
    rollWindowNoMissingPlayer: "|cffaaaaaaAlle Spieler haben gewürfelt|r",
    rollWindowAnnounceMissingButtonText: "Fehlende Spieler",
    rollWindowAnnounceWinnerButtonText: "Gewinner ausgeben",
    announceMissingPlayers: `${qRollNamePrefix}Noch würfeln müssen: $missingPlayers.`,
    announceWinner: `${qRollNamePrefix}--> $winner <-- ist der Gewinner mit der höchsten Zahl von $value. Gewürfelt wurde von $from bis $to. Glückwunsch!`,
    announceWinnerMissingPlayers: `${qRollNamePrefix}Nicht teilgenommen haben: $missingPlayers. Schade!`,
    optionsChangesSaved: `${qRollNamePrefixColored}Änderungen in den Optionen wurden gespeichert.`,
    optionsChangesCanceled: `${qRollNamePrefixColored}Änderungen in den Optionen wurden zurückgesetzt.`,
    optionsDirectOutput: "Gewinner automatisch bekanntgeben, nachdem alle Spieler gewürfelt haben."
};
