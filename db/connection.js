const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");

let username = fs.readFileSync(path.join(__dirname, "db_username.txt"), "utf-8");
console.log("MongoDB username: " + username);
let password = fs.readFileSync(path.join(__dirname, "db_password.txt"), "utf-8");
console.log("MongoDB password: " + password);

let url = "mongodb://" + username + ":" + password
    + "@ds235461.mlab.com:35461/silly_translate";

mongoose.connect(url, {
    useNewUrlParser: true
}, function(err) {
    if (err) {
        throw err;
    }

    console.log("Connected to MongoDB");
});

process.on("SIGINT", async function() {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
    console.log("Ending Node process");
    process.exit(0);
});
