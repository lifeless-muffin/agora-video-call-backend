const ChannelModel = require("../models/channel");
const { generateRTCToken } = require("./agora.service");
const { validateJoinChannel } = require("./validation.service");
const { saveNewChannel, joinAChannel } = require("./database.service");

const joinChannelValidation = ({req, resp}) => {
  if (!req?.params?.channel || !req?.params?.username) {
		resp.status(400).json({'error': 'channel name is required'});
		return false
  } else {
    return true;
  }
}

const createChannelFormValidation = ({req, resp}) => {
	if (!req?.params?.channel) {
		resp.status(400).json({'error': 'channel name is required'});
		return false
	} else if (!req?.body?.timeline || req.body?.timeline.length < 1) {
		resp.status(400).json({'error': 'channel timeline is required'});
		return false
	} else {
		return true
	}
}

const createNewChannel = async ({req, resp, APP_CERTIFICATE, APP_ID}) => {

  let channelDetails = {}; 
	const name = req.params?.channel;
	const clientId = req.params?.uid; // agora ID
	const username = req.params?.username; // agora ID
	const timeline = req.body?.timeline;
  
	if (!createChannelFormValidation({req, resp})) {return null}
  const channel = saveNewChannel({username, clientId, timeline, name})

  try {
    channelDetails = await channel.save()
  } catch (error) {
    resp.status(400)
      .json(error);    
      
    return null;
  }
  
  let rtcToken = generateRTCToken({req, resp, APP_CERTIFICATE, APP_ID});
  resp.status(200).json({channelDetails, rtcToken});
}

const joinChannel = async ({req, resp, APP_ID, APP_CERTIFICATE}) => {
  
  let channelDetails = {};
  const name = req.params.channel;
  const username = req.params.username;
  const clientId = req.params.uid

  if (!joinChannelValidation({req, resp})) {return null};
  
  try {
    channelDetails = await joinAChannel({username, clientId, name});
  } catch (error) {
    resp.status(400).json(error);
    return null;
  }

  const isChannelJoinable = validateJoinChannel(channelDetails); 
  if (isChannelJoinable.error) {
    resp.status(isChannelJoinable.status_code)
      .json(isChannelJoinable?.error_message);

    return null;
  }

  let rtcToken = generateRTCToken({req, resp, APP_CERTIFICATE, APP_ID});
  resp.status(200).json({
    channelDetails: channelDetails.channel, 
    rtcToken: rtcToken?.rtcToken, 
    clientInformation: channelDetails.clientInformation
  });
}

module.exports = {createNewChannel, joinChannel};
