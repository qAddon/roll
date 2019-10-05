export declare type QRollDatabase = {
    window: {
        x: number,
        y: number,
        point: WowPoint,
        relativePoint: WowPoint
    },
    directOutput: boolean
};

export class Database {

    /**
     * saved variables identifier
     */
    private readonly IDENTIFIER: string = "qRollPerCharacter";

    /**
     * get the current database object
     */
    public get<T extends keyof QRollDatabase>(key: T): QRollDatabase[T] {

        // just this entry
        return (_G[this.IDENTIFIER] as QRollDatabase)[key];
    }

    /**
     * get the current database object
     */
    public getAll(): QRollDatabase {

        // complete database
        return _G[this.IDENTIFIER];
    }

    /**
     * sets an object in the database by key
     * @param key the key for storing the value
     * @param value the value to store
     */
    public set<T extends keyof QRollDatabase>(key: T, value: QRollDatabase[T]): void {

        // set the value
        (_G[this.IDENTIFIER] as QRollDatabase)[key] = value;
    }

    /**
     * initializes the database is nessesary
     * @param defaultDatabaseContent the default content for the database
     */
    public initialize(defaultDatabaseContent: QRollDatabase): void {

        (_G[this.IDENTIFIER] as QRollDatabase) = (_G[this.IDENTIFIER] as QRollDatabase) || defaultDatabaseContent;
    }
}
