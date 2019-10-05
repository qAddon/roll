import { I18N, I18N_LANGUAGE, NO_VARIABLES } from "./types";
import { DE } from "./de";
import { EN } from "./en";

export class Language {

    /**
     * the current game client language
     */
    private clientLanguage: keyof Language["languageStack"];

    /**
     * register all known languages
     */
    private languageStack: {
        [clientLanguage: string]: I18N_LANGUAGE
    } = {
            de: DE,
            en: EN
        };

    constructor() {

        // save game locale
        this.clientLanguage = (GetLocale() as string).substr(0, 2);

        // language available?
        const containsClientLanguage = Object.keys(this.languageStack).indexOf(this.clientLanguage) >= 0;
        if (!containsClientLanguage) {

            // declare fallback
            this.clientLanguage = "en";
        }
    }

    /**
     * get a translated string
     * @param key the key to search for
     */
    public get<T extends keyof I18N>(key: T, variables?: I18N[T] extends NO_VARIABLES ? never : I18N[T]): string {

        let raw = this.languageStack[this.clientLanguage][key];

        // just return the text if no variables needs to be parsed
        if (!variables) {
            return raw;
        }

        // parse given variables
        Object.keys(variables).forEach(varName => {

            raw = (raw as string).replace(`%$${varName}`, (variables as any)[varName]);
        });

        return raw;
    }
}
