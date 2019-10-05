export interface OptionItem<T> {

    /**
     * get the native frame of this option item
     */
    getFrame(): WowFrame;

    /**
     * add a change listener for the option item
     * @param callback the function that should be called when a new value is present
     */
    onChange(callback: (value: T) => any): ThisType<T>;

    /**
     * get the current value
     */
    getValue(): T;

    /**
     * set the current value
     * @param value the new value
     */
    setValue(value: T): void;
}
