const axios = require("axios");

const asyncForEach = require("../lib/asyncForEach.js");
const random = require("../lib/random.js");

let Translator = function(app) {
    let translator = {};

    /**
     * Translates the given source text (in English) to the given number of
     * random foreign (non-English) languages, then back to English.
     * @param {!string} srcText   the source text (in English) to translate
     * @param {!number} n   the number of foreign languages to translate to
     * @returns {Promise<!Entry[]>}   the steps from the source text to the
     * final translated text
     */
    translator.customNumber = async function(srcText, n) {
        let langNames = [];
        for (let i = 0; i < n; i++) {
            let langName;
            if (i === 0) {
                langName = getRandomForeignLangName(null);
            } else {
                langName = getRandomForeignLangName(langNames[i - 1]);
            }

            langNames.push(langName);
        }

        return await translate(srcText, langNames);
    };

    /**
     * Translates the given source text (in English) through a random
     * permutation of all supported foreign (non-English) languages, then back
     * to English.
     * @param {!string} srcText   the source text (in English) to translate
     * @returns {Promise<!Entry[]>}   the steps from the source text to the
     * final translated text
     */
    translator.randomPermutation = async function(srcText) {
        const supportedLangNames = app.get("supportedLangNames");

        let langNames = [];
        supportedLangNames.forEach(function(langName) {
            if (langName !== "English") {
                langNames.push(langName);
            }
        });
        random.shuffle(langNames);

        return await translate(srcText, langNames);
    };

    /**
     * Translates the given source text (in English) through the given array of
     * languages, then back to English.
     * @param {!string} srcText   the source text (in English) to translate
     * @param {!string[]} langNames   the names of the languages to translate to
     * @returns {Promise<!Entry[]>}   the steps from the source text to the
     * final translated text
     */
    translator.customSequence = async function(srcText, langNames) {
        return await translate(srcText, langNames);
    };

    /**
     * Translates the given source text (in English) through the given
     * languages, then back to English.
     * @param {!string} srcText   the source text (in English) to translate
     * @param {!string[]} langNames   the names of the languages to translate to
     * @returns {Promise<!Entry[]>}   the steps from the source text to the
     * final translated text
     */
    async function translate(srcText, langNames) {
        const supportedLangCodes = app.get("supportedLangCodes");

        let results = [{
            "langName": "English",
            "text": srcText
        }];

        let currText = srcText;
        let currLangCode = "en";
        await asyncForEach(langNames, async function(nextLangName) {
            let nextLangCode = supportedLangCodes[nextLangName];
            let nextText = await translateHelper(currText, currLangCode, nextLangCode);

            results.push({
                "langName": nextLangName,
                "text": nextText
            });

            currText = nextText;
            currLangCode = nextLangCode;
        });

        let nextText = await translateHelper(currText, currLangCode, "en");
        results.push({
            "langName": "English",
            "text": nextText
        });

        return results;
    }

    /**
     * Translates the given source text between the given languages.
     * @param {!string} srcText   the source text to translate
     * @param {!string} fromCode   the code of the language the source text is
     * in
     * @param {!string} toCode   the code of the language to translate the
     * source text to
     * @returns {Promise<!string>}   a promise that returns the translated text
     * if resolved, or an Error if rejected
     */
    async function translateHelper(srcText, fromCode, toCode) {
        const yandexApiKey = app.get("yandexApiKey");

        let srcTextEscaped = encodeURIComponent(srcText);
        let url = "https://translate.yandex.net/api/v1.5/tr.json/translate?text="
            + srcTextEscaped + "&lang=" + fromCode + "-" + toCode + "&key="
            + yandexApiKey;

        let response = await axios.get(url);
        let data = response["data"];
        return data["text"][0];
    }

    /**
     * Generates a random foreign (non-English) language name not equalling the
     * given language name.
     * @param {?string} langName   the language name that the generated result
     * will be non-equal to
     * @returns {!string}   the generated language name
     */
    function getRandomForeignLangName(langName) {
        const supportedLangNames = app.get("supportedLangNames");

        let result;
        do {
            let rand = random.nextInt(0, supportedLangNames.length - 1);
            result = supportedLangNames[rand];
        } while (result === langName || result === "English");
        return result;
    }

    return translator;
};

module.exports = Translator;
