const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const history = new Schema({
    history: Array,
    user_id: String,
});

const History = mongoose.model('History', history);
module.exports = History;