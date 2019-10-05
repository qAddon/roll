import { RollSession } from "./RollSession";
import { Language } from "./i18n/Language";
import { raw } from "@wartoshika/qhun-transpiler";
import { Database, QRollDatabase } from "./Database";

export class RollWindow {

    /**
     * contains the native frame
     */
    private frame: WowFrame;

    /**
     * the parent frame where the roll window will be added to
     */
    private readonly PARENT: WowFrame = UIParent;

    /**
     * contains all window settings
     */
    private readonly SETTINGS: {
        // the number of supported entriies within the content list
        supportedListEntries: number,
        // general padding for text and frame bounds
        padding: number,
        // the window dimension in pixel
        size: [number, number],
        // height of the header
        headerHeight: number,
        // height of the footer and action buttons
        footerHeight: number,
        // color of the window background
        background: [number, number, number, number],
        // color of the header background
        headerBackground: [number, number, number, number],
        // color of the header text
        headerTextColor: [number, number, number],
        // action buttons normal bg color,
        actionButtonBackgroundColor: [number, number, number, number],
        // hover color for action buttons
        actionButtonHoverBackgroundColor: [number, number, number, number],
        // closeButton hover bg color
        closeButtonHoverBackgroundColor: [number, number, number, number],
        // closeButton text color
        closeButtonTextColor: [number, number, number],
        // content text color
        contentTextColor: [number, number, number],
        // list background
        listBackground: [number, number, number, number]
    } = {
            supportedListEntries: 8,
            padding: 10,
            size: [250, 300],
            headerHeight: 25,
            footerHeight: 25,
            background: [20 / 255, 20 / 255, 20 / 255, .8],
            headerBackground: [64 / 255, 64 / 255, 64 / 255, 1],
            headerTextColor: [247 / 255, 247 / 255, 247 / 255],
            actionButtonBackgroundColor: [48 / 255, 48 / 255, 48 / 255, 1],
            actionButtonHoverBackgroundColor: [64 / 255, 64 / 255, 64 / 255, 1],
            closeButtonHoverBackgroundColor: [253 / 255, 76 / 255, 76 / 255, 1],
            closeButtonTextColor: [247 / 255, 247 / 255, 247 / 255],
            contentTextColor: [247 / 255, 247 / 255, 247 / 255],
            listBackground: [0 / 255, 0 / 255, 0 / 255, .3]
        };

    /**
     * contains the current session
     */
    private session: RollSession;

    /**
     * text instance containing the leader name
     */
    private leadingText: WowFontString;

    /**
     * a list containing the supported amount of contesting players
     */
    private listEntries: WowFontString[] = [];

    /**
     * font string for missing players
     */
    private missingPlayerList: WowFontString;

    /**
     * the announce missing players button
     */
    private buttonAnnounceMissing: WowFrame;

    constructor(
        private language: Language,
        private db: Database,
        private closeCallback: () => void
    ) { this.init(); }

    /**
     * initiates a new roll session
     * @param session the new roll session
     */
    public initSession(session: RollSession): void {

        // set roll session
        this.session = session;

        // add roll event callback
        this.session.onNewRoll(() => this.onNewRoll());
    }

    /**
     * shows the window if it is currently hidden
     */
    public show(): void {

        // show the main frame
        if (!this.frame.IsVisible()) {
            this.frame.Show();
        }
    }

    /**
     * reset the complete window to a pristine state
     */
    public reset(): void {

        this.leadingText.SetText("");
        this.listEntries.forEach(entry => {
            entry.SetText("");
            entry.Hide();
        });
        this.missingPlayerList.SetText("");
        this.buttonAnnounceMissing.Show();
    }

    private init(): void {

        // declare vars
        let background: WowTexture;
        let header: WowFrame;
        let headerBackground: WowTexture;
        let titleText: WowFontString;
        let closeButton: WowFrame;
        let closeButtonBackground: WowTexture;
        let closeButtonText: WowFontString;
        let list: WowFrame;
        let listBackground: WowTexture;
        let footer: WowFrame;
        let buttonAnnounceMissingText: WowFontString;
        let buttonAnnounceMissingBackground: WowTexture;
        let buttonAnnounceWinner: WowFrame;
        let buttonAnnounceWinnerText: WowFontString;
        let buttonAnnounceWinnerBackground: WowTexture;
        let missingPlayerText: WowFontString;

        // construct the window
        this.frame = CreateFrame("Frame", "QRoll_MainWindow", this.PARENT);
        const windowPosition = this.db.get("window");
        this.frame.SetPoint(windowPosition.point, this.PARENT, windowPosition.relativePoint, windowPosition.x, windowPosition.y);
        this.frame.SetSize(...this.SETTINGS.size);
        this.frame.SetMovable(true);
        this.frame.Hide();

        // create a background texture
        background = this.frame.CreateTexture(null, "BACKGROUND");
        background.SetColorTexture(...this.SETTINGS.background);
        background.SetAllPoints(this.frame);

        // create the header
        header = CreateFrame("Frame", "QRoll_Header", this.frame);
        header.SetPoint("TOPLEFT", this.frame, "TOPLEFT", 0, 0);
        header.SetSize(this.SETTINGS.size[0], this.SETTINGS.headerHeight);
        header.EnableMouse(true);
        header.SetMovable(true);
        // make window moveable
        header.SetScript("OnMouseDown", () => {
            this.frame.StartMoving();
        });
        header.SetScript("OnMouseUp", () => {
            this.frame.StopMovingOrSizing();
            this.storeWindowPosition();
        });

        // header background
        headerBackground = header.CreateTexture(null, "BACKGROUND");
        headerBackground.SetAllPoints(header);
        headerBackground.SetColorTexture(...this.SETTINGS.headerBackground);

        // header title text
        titleText = header.CreateFontString(null, "ARTWORK");
        titleText.SetFont("Fonts\\\\FRIZQT__.TTF", 10);
        titleText.SetTextColor(...this.SETTINGS.headerTextColor);
        titleText.SetText(this.language.get("rollWindowTitleText"));
        titleText.SetPoint("LEFT", header, "LEFT", this.SETTINGS.padding, 0);

        // close button
        closeButton = CreateFrame("Frame", null, header);
        closeButton.SetPoint("TOPRIGHT", header, "TOPRIGHT");
        closeButton.SetSize(this.SETTINGS.headerHeight, this.SETTINGS.headerHeight);
        // scripts
        closeButton.SetScript("OnEnter", () => {
            closeButtonBackground.SetColorTexture(...this.SETTINGS.closeButtonHoverBackgroundColor);
        });
        closeButton.SetScript("OnLeave", () => {
            closeButtonBackground.SetColorTexture(...this.SETTINGS.actionButtonBackgroundColor);
        });
        closeButton.SetScript("OnMouseDown", () => {
            this.closeWindow();
        });

        // close button BG
        closeButtonBackground = closeButton.CreateTexture(null, "BACKGROUND");
        closeButtonBackground.SetAllPoints(closeButton);
        closeButtonBackground.SetColorTexture(...this.SETTINGS.actionButtonBackgroundColor);

        // close button text
        closeButtonText = closeButton.CreateFontString(null, "ARTWORK");
        closeButtonText.SetPoint("CENTER", closeButton, "CENTER");
        closeButtonText.SetFont("Fonts\\\\FRIZQT__.TTF", 10);
        closeButtonText.SetTextColor(...this.SETTINGS.closeButtonTextColor);
        closeButtonText.SetText("x");

        // lead player text
        this.leadingText = this.frame.CreateFontString(null, "ARTWORK");
        this.leadingText.SetPoint("TOPLEFT", this.frame, "TOPLEFT", this.SETTINGS.padding, -(this.SETTINGS.headerHeight + this.SETTINGS.padding * 2));
        this.leadingText.SetFont("Fonts\\\\FRIZQT__.TTF", 10);
        this.leadingText.SetTextColor(...this.SETTINGS.contentTextColor);

        // list frame
        list = CreateFrame("Frame", "QRoll_List", this.frame);
        list.SetPoint("TOPLEFT", this.frame, "TOPLEFT", 0, -(this.SETTINGS.headerHeight + this.SETTINGS.padding * 4));
        list.SetSize(this.SETTINGS.size[0], this.SETTINGS.size[1] - (this.SETTINGS.headerHeight + this.SETTINGS.padding * 4 + this.SETTINGS.footerHeight));

        // list background
        listBackground = list.CreateTexture(null, "BACKGROUND");
        listBackground.SetAllPoints(list);
        listBackground.SetColorTexture(0, 0, 0, .3);

        // footer
        footer = CreateFrame("Frame", "QRoll_Footer", this.frame);
        footer.SetPoint("BOTTOMLEFT", this.frame, "BOTTOMLEFT", 0, 0);
        footer.SetSize(this.SETTINGS.size[0], this.SETTINGS.footerHeight);

        // action buttons
        // announce missing
        this.buttonAnnounceMissing = CreateFrame("Frame", null, footer);
        this.buttonAnnounceMissing.SetPoint("TOPLEFT", footer, "TOPLEFT", 0, 0);
        this.buttonAnnounceMissing.SetSize(this.SETTINGS.size[0] / 2 - 1, this.SETTINGS.footerHeight);
        // button text
        buttonAnnounceMissingText = this.buttonAnnounceMissing.CreateFontString(null, "ARTWORK");
        buttonAnnounceMissingText.SetPoint("CENTER", this.buttonAnnounceMissing, "CENTER");
        buttonAnnounceMissingText.SetFont("Fonts\\\\FRIZQT__.TTF", 10);
        buttonAnnounceMissingText.SetTextColor(...this.SETTINGS.contentTextColor);
        buttonAnnounceMissingText.SetText(this.language.get("rollWindowAnnounceMissingButtonText"));
        // button bg
        buttonAnnounceMissingBackground = this.buttonAnnounceMissing.CreateTexture(null, "BACKGROUND");
        buttonAnnounceMissingBackground.SetAllPoints(this.buttonAnnounceMissing);
        buttonAnnounceMissingBackground.SetColorTexture(...this.SETTINGS.actionButtonBackgroundColor);
        // button hover
        this.buttonAnnounceMissing.SetScript("OnEnter", () => {
            buttonAnnounceMissingBackground.SetColorTexture(...this.SETTINGS.actionButtonHoverBackgroundColor);
        });
        this.buttonAnnounceMissing.SetScript("OnLeave", () => {
            buttonAnnounceMissingBackground.SetColorTexture(...this.SETTINGS.actionButtonBackgroundColor);
        });
        this.buttonAnnounceMissing.SetScript("OnMouseDown", () => this.announceMissing());

        // announce winner
        buttonAnnounceWinner = CreateFrame("Frame", null, footer);
        buttonAnnounceWinner.SetPoint("TOPRIGHT", footer, "TOPRIGHT", 0, 0);
        buttonAnnounceWinner.SetSize(this.SETTINGS.size[0] / 2 - 1, this.SETTINGS.footerHeight);
        // button text
        buttonAnnounceWinnerText = buttonAnnounceWinner.CreateFontString(null, "ARTWORK");
        buttonAnnounceWinnerText.SetPoint("CENTER", buttonAnnounceWinner, "CENTER");
        buttonAnnounceWinnerText.SetFont("Fonts\\\\FRIZQT__.TTF", 10);
        buttonAnnounceWinnerText.SetTextColor(...this.SETTINGS.contentTextColor);
        buttonAnnounceWinnerText.SetText(this.language.get("rollWindowAnnounceWinnerButtonText"));
        // button bg
        buttonAnnounceWinnerBackground = buttonAnnounceWinner.CreateTexture(null, "BACKGROUND");
        buttonAnnounceWinnerBackground.SetAllPoints(buttonAnnounceWinner);
        buttonAnnounceWinnerBackground.SetColorTexture(...this.SETTINGS.actionButtonBackgroundColor);
        // button hover
        buttonAnnounceWinner.SetScript("OnEnter", () => {
            buttonAnnounceWinnerBackground.SetColorTexture(...this.SETTINGS.actionButtonHoverBackgroundColor);
        });
        buttonAnnounceWinner.SetScript("OnLeave", () => {
            buttonAnnounceWinnerBackground.SetColorTexture(...this.SETTINGS.actionButtonBackgroundColor);
        });
        buttonAnnounceWinner.SetScript("OnMouseDown", () => this.announceWinner());

        // create list entries
        for (let i = 0; i < this.SETTINGS.supportedListEntries; i++) {

            // create one entry
            const entry = list.CreateFontString("QRoll_List_ContestingPlayer" + i, "ARTWORK");
            entry.SetPoint("TOPLEFT", list, "TOPLEFT", this.SETTINGS.padding, -((i + 1) * this.SETTINGS.padding));
            entry.SetFont("Fonts\\\\FRIZQT__.TTF", 9);
            entry.SetTextColor(...this.SETTINGS.contentTextColor);
            entry.Hide();

            // add configured entry
            this.listEntries.push(entry);
        }

        // create missing player text
        const missingPlayerOffset = this.SETTINGS.supportedListEntries * this.SETTINGS.padding * 1.35 + this.SETTINGS.padding * 2;
        missingPlayerText = list.CreateFontString("QRoll_List_MissingPlayerText", "ARTWORK");
        missingPlayerText.SetPoint("TOPLEFT", list, "TOPLEFT", this.SETTINGS.padding, -missingPlayerOffset);
        missingPlayerText.SetFont("Fonts\\\\FRIZQT__.TTF", 9);
        missingPlayerText.SetTextColor(...this.SETTINGS.contentTextColor);
        missingPlayerText.SetText(this.language.get("rollWindowMissingPlayer"));

        // missing player list text
        this.missingPlayerList = list.CreateFontString("QRoll_List_MissingPlayerListText", "ARTWORK");
        this.missingPlayerList.SetPoint("TOPLEFT", list, "TOPLEFT", this.SETTINGS.padding,
            -(missingPlayerOffset + missingPlayerText.GetHeight() + this.SETTINGS.padding)
        );
        this.missingPlayerList.SetFont("Fonts\\\\FRIZQT__.TTF", 9);
        this.missingPlayerList.SetTextColor(...this.SETTINGS.contentTextColor);
    }

    /**
     * closes the window
     */
    private closeWindow(): void {

        this.frame.Hide();
        this.closeCallback();
    }

    /**
     * stores the current window position on resizing
     */
    private storeWindowPosition(): void {

        // get current frame point
        const [point, , relativePoint, x, y] = this.frame.GetPoint();
        const windowPosition: QRollDatabase["window"] = {
            point: point,
            relativePoint: relativePoint,
            x: x,
            y: y
        };

        // save the location
        this.db.set("window", windowPosition);
    }

    /**
     * handle content refresh after a new roll
     */
    private onNewRoll(): void {

        // get all rolls
        const rolls = this.session.getFirstRollsGroupByPlayer("DEFAULT");

        // find the current leader
        const leader = this.session.getLeadingRoll("DEFAULT");

        // no init roll on the default range?
        if (!leader) {
            return;
        }

        // get leaders class and color
        const [, className] = UnitClass(leader.player as any);
        const [, , , hex] = GetClassColor(className as WOW_CLASSES);

        // display the leader
        this.leadingText.SetText(
            this.language.get("rollWindowLeaderText", {
                player: leader.player,
                value: leader.value,
                classColor: hex
            })
        );

        // update list of contesting players
        // start by getting the supported ammount of rolls
        const displayRolls = rolls.slice(0, this.SETTINGS.supportedListEntries);

        // sort the rolls
        raw`table.sort(displayRolls, function (v1, v2) return v1.value > v2.value end )`;

        // display them
        for (let i = 0; i < this.SETTINGS.supportedListEntries; i++) {

            const roll = displayRolls[i];
            const listEntry = this.listEntries[i];
            if (roll) {

                // get entries class and color
                const [, entryClassName] = UnitClass(roll.player as any);
                const [, , , entryHex] = GetClassColor(entryClassName as WOW_CLASSES);

                // translate list entry
                listEntry.SetText(this.language.get("rollWindowEntry", {
                    player: roll.player,
                    value: roll.value,
                    classColor: entryHex
                }));
                listEntry.Show();
            } else {
                listEntry.Hide();
            }
        }

        // display missing players
        const missing = this.session.getMissingContestants("DEFAULT");
        let textToDisplay: string;
        if (missing.length > 0) {
            textToDisplay = missing.map(player => {

                // get missing player class and color
                const [, missingPlayerClassName] = UnitClass(player as any);
                const [, , , missingPlayerHex] = GetClassColor(missingPlayerClassName as WOW_CLASSES);

                // combine player and class color
                return `|c${missingPlayerHex}${player}|r`;
            }).join(", ");
        } else {

            // all contesting players have rolled!
            textToDisplay = this.language.get("rollWindowNoMissingPlayer");

            // remove the announce missing player button
            this.buttonAnnounceMissing.Hide();

            // announce winner automaticly
            if (this.db.get("directOutput")) {
                this.announceWinner();
            }
        }

        // display the text
        this.missingPlayerList.SetText(textToDisplay);
    }

    /**
     * action button announce missing
     */
    private announceMissing(): void {

        // get all missing players
        const missing = this.session.getMissingContestants("DEFAULT");

        // announce to party or raid?
        const channel: WowChannelChatType = !IsInRaid() ? "PARTY" : "RAID";

        // get translated message
        const message = this.language.get("announceMissingPlayers", {
            missingPlayers: missing.join(", ")
        });

        // write message
        SendChatMessage(message, channel);
    }

    /**
     * action button announce winner
     */
    private announceWinner(): void {

        // find the winner
        const winner = this.session.getLeadingRoll("DEFAULT");

        // get all missing players
        const missing = this.session.getMissingContestants("DEFAULT");

        // announce to party or raid?
        const channel: WowChannelChatType = !IsInRaid() ? "PARTY" : "RAID";

        // get translated message
        const message = this.language.get("announceWinner", {
            winner: winner.player,
            value: winner.value,
            from: winner.range.from,
            to: winner.range.to
        });

        // write message
        SendChatMessage(message, channel);

        // missing contestants?
        if (missing.length > 0) {

            // get translated message
            const missingMessage = this.language.get("announceWinnerMissingPlayers", {
                missingPlayers: missing.join(", ")
            });

            // write message
            SendChatMessage(missingMessage, channel);
        }

    }
}
