const mongoose = require("mongoose");

// Using dotenv
require('dotenv').config();

const dbPassword = process.env.MONGODB_PASSWORD;
const dbUsername = process.env.MONGODB_USERNAME;

const DbConnection = async () => {
    mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@cluster0.ck6is8n.mongodb.net/?retryWrites=true&w=majority`)
        .then(() => {
            console.log('Connected to DB!')
        })
        .catch((e) => {
            console.error(e, "\n\nCan't connect to DB");
        })
}
module.exports = DbConnection;