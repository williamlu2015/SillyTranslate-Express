const fs = require("fs");
const axios = require("axios");
const nodemailer = require("nodemailer");

const Queue = require("./queue.js");

/**
 * Initializes app settings for the given app.
 * - Initializes "recentTranslations" to an empty Queue
 * - Initializes "yandexApiKey" to the Yandex API key stored in
 *   "/yandex/api_key.txt"
 * - Initializes "supportedLangNames" to the list of language names Yandex
 *   Translate supports
 *   - e.g.: ["Afrikaans", "Albanian", ...]
 * - Initializes "supportedLangCodes" to an object mapping the supported
 *   language names to their corresponding language codes
 *   - e.g.: {"Afrikaans": "af", "Amharic": "am", ...}
 * - Initializes "transporter" to a new Test Ethereal Nodemailer transporter
 * @param app   the Express app to initialize
 * @returns {Promise<void>}
 */
async function initialize(app) {
    initRecentTranslations(app);
    initYandexApiKey(app);

    let initLangsPromise = initLangs(app);
    let initTransporterPromise = initTransporter(app);

    await initLangsPromise;
    await initTransporterPromise;
}

/**
 * Initializes the "recentTranslations" setting of the given app to an empty
 * Queue.
 * @param app   the Express app to initialize
 */
function initRecentTranslations(app) {
    app.set("recentTranslations", Queue(32));
}

/**
 * Initializes the "yandexApiKey" setting of the given app to the Yandex API key
 * stored in "/yandex/api_key.txt".
 * @param app   the Express app to initialize
 */
function initYandexApiKey(app) {
    let yandexApiKey = fs.readFileSync("./yandex/api_key.txt", "utf-8");

    app.set("yandexApiKey", yandexApiKey);
    console.log("Yandex API key: " + app.get("yandexApiKey"));
}

/**
 * Initializes the "supportedLangNames" and "supportedLangCodes" settings of the
 * given app.
 * @param app   the Express app to initialize
 * @returns {Promise<void>}
 */
async function initLangs(app) {
    let url = "https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key="
        + app.get("yandexApiKey");

    let response = await axios.get(url);
    let data = response["data"];
    let langsData = data["langs"];

    app.set("supportedLangNames", langNames(langsData));
    console.log("Supported language names: "
        + JSON.stringify(app.get("supportedLangNames")));

    app.set("supportedLangCodes", langCodes(langsData));
    console.log("Supported language codes: "
        + JSON.stringify(app.get("supportedLangCodes")));
}

/**
 * Converts the raw supported-languages data from the Yandex API to an array of
 * supported language names.
 * - e.g. Input: {"ru": "Russian", "en": "English", "pl": "Polish", "zh": "Chinese"}
 * - e.g. Output: ["Chinese", "English", "Polish", "Russian"] (sorted order)
 * @param {!Object.<string, string>} langsData   the raw supported-languages
 * data from the Yandex API
 * @returns {!string[]}   an array of supported language names
 */
function langNames(langsData) {
    let result = [];
    for (let key in langsData) {
        if (langsData.hasOwnProperty(key)) {
            result.push(langsData[key]);
        }
    }

    result.sort();
    return result;
}

/**
 * Converts the raw supported-languages data from the Yandex API to a mapping
 * from supported language names to supported language codes.
 * - e.g. Input: {"ru": "Russian", "en": "English", "pl": "Polish", "zh": "Chinese"}
 * - e.g. Output: {"Russian": "ru", "English": "en", "Polish": "pl", "Chinese": "zh"}
 * @param {!Object.<string, string>} langsData   the raw supported-languages
 * data from the Yandex API
 * @returns {!Object.<string, string>}   a mapping from supported language names
 * to supported language codes
 */
function langCodes(langsData) {
    let result = {};
    for (let key in langsData) {
        if (langsData.hasOwnProperty(key)) {
            result[langsData[key]] = key;
        }
    }
    return result;
}

/**
 * Initializes the "transporter" setting of the given app to a new Test Ethereal
 * Nodemailer transporter.
 * @param app   the Express app to initialize
 * @returns {Promise<void>}
 */
async function initTransporter(app) {
    let account = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
    app.set("transporter", transporter);
    console.log("Nodemailer transporter initialized");
}

module.exports = initialize;
