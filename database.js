require('dotenv').config();
const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('MongoDB Connection Successful')
            })
            .catch(err => {
                console.error('MongoDB Connection Error');
            });
    }

}

module.exports = new Database();