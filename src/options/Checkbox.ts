import { OptionItem } from "./OptionItem";

export class Checkbox implements OptionItem<boolean> {

    private frame: WowFrame;
    private value: boolean;
    private callback: ((value: boolean) => any)[] = [];

    constructor(
        private name: string,
        private parent: WowFrame,
        private text: string,
        initialValue: boolean
    ) {

        // set initial value
        this.value = initialValue;

        // create the checkbox
        this.frame = CreateFrame(
            "CheckButton" as any,
            this.name,
            this.parent,
            "ChatConfigCheckButtonTemplate"
        );
        this.frame.SetPoint("TOPLEFT", this.parent, "TOPLEFT", 0, 0);
        (_G[`${this.frame.GetName()}Text`] as WowFontString).SetText(this.text);
        this.frame.SetScript("OnClick", () => this.setValue(!this.value));
        this.frame.SetChecked(this.value);
    }

    /**
     * get the native frame of this option item
     */
    public getFrame(): WowFrame {

        return this.frame;
    }

    /**
     * add a change listener for the option item
     * @param callback the function that should be called when a new value is present
     */
    public onChange(callback: (value: boolean) => any): this {

        this.callback.push(callback);
        return this;
    }

    /**
     * get the current value
     */
    public getValue(): boolean {

        return this.value;
    }

    /**
     * set the current value
     * @param value the new value
     */
    public setValue(value: boolean): void {

        this.value = value;
        this.frame.SetChecked(value);
        this.callback.forEach(cb => cb(this.value));
    }
}
