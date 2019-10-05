import { Language } from "./i18n/Language";
import { RollResult } from "./types";
import { SimpleRegex } from "./SimpleRegex";
import { RollSession } from "./RollSession";
import { RollWindow } from "./RollWindow";
import { Database } from "./Database";
import { RollOptions } from "./options/RollOptions";

export class QRoll {

    private language: Language;
    private session: RollSession;
    private window: RollWindow;
    private db: Database;
    private options: RollOptions;

    constructor(
        private eventFrame: WowFrame
    ) {

        // init language service
        this.language = new Language();

        // init db service
        this.db = new Database();
        this.db.initialize({
            window: {
                x: 0, y: 0,
                point: "CENTER",
                relativePoint: "CENTER"
            },
            directOutput: true
        });

        // init options
        this.options = new RollOptions(this.db, this.language);

        // init system chat msg event listener
        this.eventFrame.RegisterEvent("CHAT_MSG_SYSTEM");
        this.eventFrame.SetScript("OnEvent", (_, event, ...args) => {
            this.handleChatMessage(...args);
        });
    }

    /**
     * handles chat system messages
     * @param args all chat arguments from the event
     */
    private handleChatMessage(...args: string[]): void {

        // only continue if the player is within a party
        // this check also works for raids
        if (!UnitInParty("player")) {
            // return;
        }

        // args[0] contains the raw chat message. try to extract a
        // roll from a player.
        const possibleRoll = this.extractRollResult(args[0]);

        // roll available?
        if (possibleRoll) {

            this.addToRollSession(possibleRoll);
        }
    }

    /**
     * adds the given roll to the current session. if no session is available, create a new session
     * @param roll the current roll
     */
    private addToRollSession(roll: RollResult): void {

        // init window if nessesary
        if (!this.window) {
            this.window = new RollWindow(this.language, this.db, () => this.resetSession());
        }

        // init new session if nessesary
        if (!this.session) {

            // create a new session
            this.session = new RollSession();

            // add new session to the window
            this.window.initSession(this.session);
        }

        // add to session
        this.session.addRollResult(roll);

        // show the window
        this.window.show();
    }

    /**
     * tries to extract a roll result from the given message
     * @param chatMsg the current chat message
     */
    private extractRollResult(chatMsg: string): RollResult | false {

        // get the system roll message structure
        const rollMsg = this.language.get("systemRollMessage");
        const regex = SimpleRegex.byString(rollMsg);

        const result = regex.execute(chatMsg);
        if (result) {

            return {
                player: result.player,
                value: parseInt(result.value),
                range: {
                    from: parseInt(result.from),
                    to: parseInt(result.to)
                }
            };
        }

        return false;
    }

    /**
     * reset the roll session
     */
    private resetSession(): void {

        delete this.session;
        this.window.reset();
    }
}
