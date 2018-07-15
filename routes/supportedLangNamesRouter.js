const express = require("express");

let SupportedLangNamesRouter = function(app) {
    let router = express.Router();

    /**
     * @api {get} /api/supportedLangNames   Supported language names.
     * @apiName GetSupportedLangNames
     * @apiGroup SupportedLangNames
     *
     * @apiSuccess {!string[]} supportedLangNames   the list of language names
     * supported by Yandex Translate
     *
     * @apiSuccessExample
     *     HTTP/1.1 200 OK
     *     {
     *         "supportedLangNames": ["Afrikaans", "Albanian", ...]
     *     }
     */
    router.get("/", function(req, res) {
        let supportedLangNames = app.get("supportedLangNames");

        res.json({
            "supportedLangNames": supportedLangNames
        });
    });

    return router;
};

module.exports = SupportedLangNamesRouter;
