import { QRollDatabase, Database } from "../Database";
import { Language } from "../i18n/Language";
import { OptionItem } from "./OptionItem";
import { Checkbox } from "./Checkbox";

declare type AVAILABLE_OPTIONS = Pick<QRollDatabase, "directOutput">;

export class RollOptions {

    private optionsFrame: WowFrameInterfaceCategory;
    private temporaryOptions: AVAILABLE_OPTIONS;
    private changesAvailable: boolean;
    private items: {
        [P in keyof AVAILABLE_OPTIONS]?: OptionItem<AVAILABLE_OPTIONS[P]>
    } = {};
    private changeListeners: {
        [P in keyof AVAILABLE_OPTIONS]?: ((value: AVAILABLE_OPTIONS[P]) => any)[]
    } = {};

    constructor(
        private db: Database,
        private language: Language
    ) {

        // create the options panel
        this.optionsFrame = CreateFrame("Frame", "QRoll_Options") as WowFrameInterfaceCategory;
        this.optionsFrame.name = "qRoll";
        this.optionsFrame.okay = () => this.handleOkay();
        this.optionsFrame.cancel = () => this.handleCancel();
        this.optionsFrame.refresh = () => this.handleRefresh();

        // add option items
        this.items.directOutput = new Checkbox("QRoll_Options_DirectOutput", this.optionsFrame, this.language.get("optionsDirectOutput"), this.db.get("directOutput"))
            .onChange(value => this.setOption("directOutput", value));

        // adjust item offsets
        let yOffset: number = 20;
        Object.keys(this.items).forEach((key: keyof AVAILABLE_OPTIONS) => {

            this.items[key].getFrame().SetPoint("TOPLEFT", this.optionsFrame, "TOPLEFT", 10, -yOffset);
            yOffset = yOffset + this.items[key].getFrame().GetHeight() + 10;
        });

        // add to the interface options
        InterfaceOptions_AddCategory(this.optionsFrame);
    }

    /**
     * registers a change listener for the given option key
     * @param key the option key
     * @param callback the function to execute when the value changes
     */
    public onChange<T extends keyof AVAILABLE_OPTIONS>(key: T, callback: (value: AVAILABLE_OPTIONS[T]) => any): void {

        // entry exists?
        if (!this.changeListeners[key]) {
            this.changeListeners[key] = [];
        }

        // add listener
        this.changeListeners[key].push(callback);
    }

    /**
     * toggles an option by key
     * @param key the key of the option to toggle
     */
    private setOption<T extends keyof AVAILABLE_OPTIONS>(key: T, value: AVAILABLE_OPTIONS[T]): void {

        this.temporaryOptions[key] = value;
        this.changesAvailable = true;
    }

    private handleOkay(): void {

        // commit changes made to the database
        Object.keys(this.temporaryOptions).forEach((key: keyof RollOptions["temporaryOptions"]) => {
            this.db.set(key, this.temporaryOptions[key]);
        });

        // emit save ok message
        if (this.changesAvailable) {
            print(this.language.get("optionsChangesSaved"));
        }
    }

    private handleCancel(): void {

        // emit cancel message
        if (this.changesAvailable) {
            print(this.language.get("optionsChangesCanceled"));
        }
    }

    private handleRefresh(): void {

        // get current options
        this.temporaryOptions = {
            directOutput: this.db.get("directOutput")
        };
    }
}
