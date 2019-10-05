import { raw } from "@wartoshika/qhun-transpiler";

declare type RegexNamedResult = {
    [indexOrName: string]: string
};

declare type RegexIndexedResult = {
    [indexOrName: number]: string
};

/**
 * easy regex with the following pattern rules:
 * - **[%a]** matches a string containing no white space
 * - **[%d]** matches digits including unary prefixes
 * - **[%s]** matches whitespace
 * - every catching group can optionally be named like **[%a,playerName]**
 * - Uppercase characters will select the opposite type. Eg. `%s` selects whitespace, `%S` will select non whitespace.
 */
export class SimpleRegex {

    /**
     * creates an instance by simple pattern string
     * @param pattern the pattern to look for
     */
    public static byString(pattern: string): SimpleRegex {
        return new SimpleRegex(pattern);
    }

    /**
     * stored pattern for execution
     */
    private pattern: string;

    /**
     * storage for named variables
     */
    private variables: string[] = [];

    constructor(
        pattern: string
    ) {

        // a regex to extract the feature and optionally the name
        const nameAndFeatureExtract = /%[(%%[SsdDaA]),?([a-z]*)%]/;

        // declare the match result stack
        const matchResult: {
            feature: string,
            variable: string
        }[] = [];

        // execute raw lua code with ts variables
        raw`for k,v in string.gmatch(${pattern}, ${nameAndFeatureExtract}) do
            table.insert(matchResult, { feature = k, variable = v })
        end`;

        // escape normal regex chars
        pattern = pattern
            .replace("%%", "%%%%")
            .replace("%(", "%%(")
            .replace("%)", "%%)");

        // build pattern
        matchResult.forEach((pair, index) => {

            // add variable
            let variable = pair.variable;
            if (variable.length === 0) {
                variable = "" + index;
            }
            this.variables.push(variable);

            // replace the groups
            const search = `%[%%%${pair.feature}${pair.variable.length > 0 ? "," + pair.variable : ""}%]`;
            const replace = `%(%${pair.feature}+%)`;
            pattern = pattern.replace(search, replace);
        });

        // store the final pattern
        this.pattern = pattern;
    }

    /**
     * executes the configured pattern against a test string
     * @param test the string to test against
     * @param strict if strict mode is on, every declared variable must be at least one char long! if
     * one char is missing, the result will be false
     */
    public execute(test: string, strict: boolean = true): (RegexNamedResult & RegexIndexedResult) | false {

        const result: string[] | null = null;

        // execute a raw match
        raw`result = {string.match(${test}, ${this.pattern})}`;

        // result available?
        if (result) {

            // prepare output
            const returnValue: RegexNamedResult & RegexIndexedResult = {};

            // iterate over the result and build the return
            let i = 0;
            result.forEach((val, index) => {

                // save the result
                returnValue[this.variables[index - 1]] = val;

                // increment counter of vars if val contains a valid value
                if (val.length > 0) {
                    i = i + 1;
                }
            });

            // strict mode?
            if (strict && i !== Object.keys(this.variables).length) {

                // amount of vars does not match
                return false;
            }

            // return the build object
            return returnValue;
        } else {

            // nothing found!
            return false;
        }
    }
}
