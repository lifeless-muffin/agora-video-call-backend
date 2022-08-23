const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const channelSchema = new Schema({
	id: {type: String, required: true},
	channelName: {type: String, required: true, unique: true},
	host: {type: String, required: true},
	createdAt: {type: Number, required: true},
	expiresAt: {type: Number, required: true},
	timeline: [{
		name: {type: String, required: true},
		duration: {type: Number, required: true},
		index: {type: Number, required: true},
		isBreak: {type: Boolean, required: false}
	}]
}, {strict: true})

const ChannelModel = mongoose.model('Channel', channelSchema); 
module.exports = ChannelModel;
