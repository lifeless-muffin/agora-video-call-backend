const ChannelModel = require("../models/channel");
const crypto = require('crypto')

const calculateTotalDuration = (timeline) => {
  let totalDuration = 0; 
  for (let i=0; i<timeline?.length; i++) {
    totalDuration = totalDuration + timeline[i].duration;
  }

  return totalDuration
}

const saveNewChannel = (props) => {

  // destructure props
  const {username, clientId, timeline, name} = props;
  const channelId = crypto.randomBytes(16).toString("hex");
	const totalDuration = calculateTotalDuration(timeline); // in seconds
  const dateTimeInSecs = Math.round(new Date().getTime() / 1000); // in seconds

  const hostInformation = {
    username,
    uid: clientId,
    joinedAt: dateTimeInSecs,
    isHost: true
  }

	const channel = new ChannelModel({
		id: channelId,
		timeline: timeline,
		channelName: name,
		host: clientId,
		createdAt: dateTimeInSecs,
		expiresAt: dateTimeInSecs + totalDuration,
    participant: [hostInformation]
	})

  return channel;
}

const joinAChannel = async (props) => {

  // destructure props
  const {username, clientId, name} = props;
  const dateTimeInSecs = Math.round(new Date().getTime() / 1000); // in seconds

  const clientInformation = {
    username,
    uid: clientId,
    joinedAt: dateTimeInSecs,
    isHost: false
  }

  const channel = await ChannelModel.findOneAndUpdate(
    {channelName: name}, 
    {$push: {participant: clientInformation}},
    {safe: true, upsert: true},
  )
  
  return {channel, clientInformation};
}

module.exports = {saveNewChannel, joinAChannel}