const express = require("express");

let RecentTranslationsRouter = function(app) {
    let router = express.Router();

    /**
     * @api {get} /api/recentTranslations   Recent translation results.
     * @apiName GetRecentTranslations
     * @apiGroup RecentTranslations
     *
     * @apiSuccess {!Translation[]} recentTranslations   a list of recent
     * translation results; each translation result contains a list of Entries
     * and a translationId
     *
     * @apiSuccessExample
     *     HTTP/1.1 200 OK
     *     {
     *         "recentTranslations": [{
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
     *             "translationId": "9285894fa296e6af5b86bae296b63e06"
     *         }, {
     *             "results": [{
     *                 "langName": "English",
     *                 "text": "Goodbye"
     *             }, {
     *                 "langName": "Korean",
     *                 "text": "별"
     *             }, {
     *                 "langName": "English",
     *                 "text": "Stars"
     *             }],
     *             "translationId": "9ba71951cdaed7b5110785ff46fe49e0"
     *         }]
     *     }
     */
    router.get("/", function(req, res) {
        let recentTranslations = app.get("recentTranslations");
        let list = recentTranslations.toList().reverse();

        res.json({
            "recentTranslations": list
        });
    });

    return router;
};

module.exports = RecentTranslationsRouter;
