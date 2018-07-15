const createError = require("http-errors");
const express = require("express");

const Emailer = require("../lib/emailer.js");
const Translator = require("../lib/translator.js");

const query = require("../query/translationsQuery.js");

let TranslateRouter = function(app) {
    const SUBJECT = "Your SillyTranslate results.";
    const ERROR_SUBJECT = "An error occurred while processing your "
        + "SillyTranslate request.";

    let router = express.Router();
    let translator = Translator(app);

    /**
     * @apiDefine PostTranslate   Params for Translate APIs.
     *
     * @apiParam {!string} srcText   the source text to translate
     *
     * @apiParam {!number} type   the type of translation to perform. Interp:
     * - 0: Custom number of foreign languages
     * - 1: Random permutation of all foreign languages
     * - 2: Custom sequence of foreign languages
     *
     * @apiParam {?(string|string[])} options   additional translation options.
     * The type and interpretation depends on the "type" param:
     * - type === 0: {!string}   the number of foreign languages to translate
     *                           to, formatted as a numeric string
     * - type === 1: {null}
     * - type === 2: {!string[]}   the sequence of foreign language names to
     *                             translate to
     *
     * @apiParam {!boolean} isPublic   whether to add the translation results to
     * Recent Translations and generate a shareable URL
     */

    /**
     * @api {post} /api/translate/ajax   Translate the given source text,
     * returning the results in browser (via AJAX.)
     * @apiName PostTranslateAjax
     * @apiGroup Translate
     *
     * @apiSuccess {!Entry[]} results   the steps from the source text to the
     * final translated text
     *
     * @apiSuccess {?string} translationId   the generated translation ID
     * corresponding to the results
     * - null if isPublic === false
     * - a string if isPublic === true
     *
     * @apiSuccessExample
     *     HTTP/1.1 200 OK
     *     {
     *         "results": [{
     *             "langName": "English",
     *             "text": "hello"
     *         }, {
     *             "langName": "Chinese",
     *             "text": "你好"
     *         }, {
     *             "langName": "English",
     *             "text": "hi"
     *         }],
     *         "translationId": "a346fcf2bba4db7e734d8b5c13b82f58"
     *     }
     *
     * @apiUse PostTranslate
     */
    router.post("/ajax", async function(req, res, next) {
        try {
            let results = await computeResults(req);
            let translationId = await saveResults(req, results);

            res.json({
                "results": results,
                "translationId": translationId
            });
        } catch (err) {
            next(err);
        }
    });

    /**
     * @api {post} /api/translate/email   Translate the given source text,
     * returning the results via email.
     * @apiName PostTranslateEmail
     * @apiGroup Translate
     *
     * @apiParam {!string} to   the email address to send the results to
     *
     * @apiSuccessExample
     *     HTTP/1.1 200 OK
     *
     * @apiUse PostTranslate
     */
    router.post("/email", async function(req, res) {
        res.sendStatus(200);

        let emailer = Emailer(app);
        try {
            let results = await computeResults(req);
            let translationId = await saveResults(req, results);

            let text = "";
            results.forEach(function(obj) {
                text += "<p><b>" + obj["langName"] + "</b></p>";
                text += "<p>" + obj["text"] + "</p>";
            });

            if (translationId !== null) {
                text += "<p>Your results are saved at /translations/"
                    + translationId + "</p>";
            }

            await emailer.sendMail(req.body.to, SUBJECT, text);
        } catch (err) {
            await emailer.sendMail(req.body.to, ERROR_SUBJECT, err);
        }
    });

    async function computeResults(req) {
        switch (req.body.type) {
        case 0:
            return await translator.customNumber(req.body.text, Number(req.body.options));
        case 1:
            return await translator.randomPermutation(req.body.text);
        case 2:
            return await translator.customSequence(req.body.text, req.body.options);
        default:
            throw createError(404);
        }
    }

    async function saveResults(req, results) {
        if (!req.body.isPublic) {
            return null;
        }

        let newTranslation = await query.createTranslation(results);
        let translationId = newTranslation["translationId"];

        let recentTranslations = app.get("recentTranslations");
        recentTranslations.push({
            "results": results,
            "translationId": translationId
        });

        return translationId;
    }

    return router;
};

module.exports = TranslateRouter;
