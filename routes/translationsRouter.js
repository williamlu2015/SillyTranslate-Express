const query = require("../query/translationsQuery.js");

const express = require("express");
let router = express.Router();

/**
 * @api {get} /api/recentTranslations/:translationId   A translation result.
 * @apiName GetTranslation
 * @apiGroup Translation
 *
 * @apiSuccess {!Translation} translation   the translation result corresponding
 * to the translationId route param. The translation result contains a list of
 * Entries and the translationId.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 OK
 *     {
 *         "translation": {
 *             "results": [{
 *                 "langName": "English",
 *                 "text": "hello"
 *             }, {
 *                 "langName": "Chinese",
 *                 "text": "你好"
 *             }, {
 *                 "langName": "English",
 *                 "text": "hi"
 *             }],
 *             "translationId": "976ae585225e84ed3086d058f575ddfd"
 *         }
 *     }
 */
router.get("/:translationId", async function(req, res, next) {
    try {
        let translation = await query.getTranslation(req.params.translationId);

        res.json({
            "translation": translation
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
