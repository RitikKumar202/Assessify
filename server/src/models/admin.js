const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = new Schema({
    firstname: String,
    lastname: String,
    termAgree: { type: Boolean, default: true },
    organisation: String,
    email: String,
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
}, { timestamps: true });

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', adminSchema);
