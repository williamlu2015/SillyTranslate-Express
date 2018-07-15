const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let translationSchema = new Schema({
    translationId: {
        type: String,
        required: true,
        unique: true
    },
    results: [{
        langName: String,
        text: String
    }]
});

let TranslationModel = mongoose.model(
    "Translation", translationSchema, "translations");

module.exports = TranslationModel;
