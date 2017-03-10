// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/80060c94ef549c077a011977c2b5461bd0fd8947/utf8/index.d.ts
declare module "utf8" {
    /**
     * A string representing the semantic version number.
     */
    let version: string;
    /**
     * Encodes any given JavaScript string (string) as UTF-8, and returns the UTF-8-encoded version of the string.
     * It throws an error if the input string contains a non-scalar value, i.e. a lone surrogate.
     * @param {string} inputString
     */
    function encode(inputString: string): string;

    /**
     * Decodes any given UTF-8-encoded string (byteString) as UTF-8, and returns the UTF-8-decoded version of the string.
     * It throws an error when malformed UTF-8 is detected.
     * @param {string} byteString
     */
    function decode(byteString: string): string;
}