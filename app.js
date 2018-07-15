const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const initialize = require("./lib/initialize.js");

const SupportedLangNamesRouter = require("./routes/supportedLangNamesRouter.js");
const TranslateRouter = require("./routes/translateRouter.js");
const RecentTranslationsRouter = require("./routes/recentTranslationsRouter.js");
const translationsRouter = require("./routes/translationsRouter.js");

require("./db/connection.js");

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

initialize(app);

app.use("/api/supportedLangNames", SupportedLangNamesRouter(app));
app.use("/api/translate", TranslateRouter(app));
app.use("/api/recentTranslations", RecentTranslationsRouter(app));
app.use("/api/translations", translationsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.log(JSON.stringify(err));
    res.sendStatus(err.status || 500);
});

module.exports = app;
