const random = require("../lib/random.js");
const Translation = require("../models/translationModel.js");

/**
 * Creates a new mongoose Translation document with the given results, generates
 * a random unused translationId, saves the document, and returns the saved
 * document.
 * @param {!Entry[]} results   the translation results to save
 * @returns {Promise<!Object>}   the saved mongoose Translation document
 */
async function createTranslation(results) {
    let translationId;
    do {
        translationId = await random.generateTranslationId();
    } while (!(await isAvailable(translationId)));

    let newTranslation = new Translation({
        translationId: translationId,
        results: results
    });
    return await newTranslation.save();
}

/**
 * Returns the mongoose Translation document with the given translationId.
 * @param {!string} translationId   the translationId of the Translation
 * document to find
 * @returns {Promise<!Object>}   the mongoose Translation document with the
 * given translationId
 */
async function getTranslation(translationId) {
    return await Translation.findOne({
        translationId: translationId
    }).exec();
}

/**
 * Returns true iff the given translationId is not already used in the database.
 * @param {!string} translationId   the translationId to verify availability of
 * @returns {Promise<!boolean>}   true iff the given translationId is not
 * already used in the database
 */
async function isAvailable(translationId) {
    let count = await Translation.countDocuments({
        translationId: translationId
    }).exec();
    return count === 0;
}

module.exports.createTranslation = createTranslation;
module.exports.getTranslation = getTranslation;
module.exports.isAvailable = isAvailable;
